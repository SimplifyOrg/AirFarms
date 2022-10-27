from django.db.models.signals import post_save

from account.models import User
from .models import JSONWorkflow, State, Transition, TransitionApproval, Work, Workflow
from django.dispatch import receiver
import json

# this dictionary keep map of old node id to database id
# this is needed to update source and target node id in
# transition objects
nodeDict = {}

def CreateTransition(transition, workflowId):
    transition['associatedFlow'] = workflowId
    needApproval = False
    sizeApproval = len(transition['transitionapprovals'])
    if sizeApproval > 0:
        needApproval = True
    tran = Transition.objects.create(
                                    previous=State.objects.get(id=transition['previous']),
                                    next=State.objects.get(id=transition['next']),
                                    associatedFlow=Workflow.objects.get(id=workflowId),
                                    need_approval=needApproval
                                    )
    transition['id'] = tran.id
    transition['need_approval'] = tran.need_approval
    # Iterate to create all transition approvals
    for approval in transition['transitionapprovals']:
        CreateTransitionApproval(approval, tran)
    
    return tran

def CreateTransitionApproval(transitionApproval, tran):
    user = User.objects.get(id=transitionApproval['approver'])
    approval = TransitionApproval.objects.create(transitionToApprove=tran, approver=user, approval=False, reject=False)
    transitionApproval['id'] = approval.id
    transitionApproval['transitionToApprove'] = tran.id

def CreateState(node):
    # query all the notifiers objects
    stateNotifiers = []
    for userId in node['data']['notifiers']:
        if userId != None:
            stateNotifiers.append(User.objects.get(id=userId))

    # Create new state object
    state = State.objects.create(title=str(node['data']['title']), notes=str(node['data']['notes']))
    if len(stateNotifiers) > 0:
        state.notifiers.set(stateNotifiers)

    # Map old ids to database state ids
    # This will help map correct database
    # node ids to edges/transitions
    nodeDict[node['id']] = state.id
    # Update node id with correct database state id
    node['id'] = state.id
    #Create work objects added in the state
    for work in node['data']['works']:
        newWork = CreateWork(work, work['notifiers'], state)
        work['id'] = newWork.id

def CreateWork(work, notifiers, state):
    # query all the assignees objects
    workOwners = []
    for userId in work['assignee']:
        if userId != None:
            workOwners.append(User.objects.get(id=userId))
    
    # query all the notifiers objects
    workNotifiers = []
    for userId in notifiers:
        if userId != None:
            workNotifiers.append(User.objects.get(id=userId))
    
    # return created work object
    newWork = Work.objects.create(notes=work['notes'], associatedState=state)
    work['associatedState'] = state.id
    
    if len(workOwners) > 0:
        newWork.assignee.set(workOwners)
    
    if len(workNotifiers) > 0:
        newWork.notifiers.set(workNotifiers)
    
    return newWork

def SetCurrentStates(current):
    Workflow.update(current)

@receiver(post_save, sender=JSONWorkflow)
def JSONWorkflowHandler(sender, instance, created, **kwargs):
    if created:
        #Create entrie flow here
        try:
            flow = json.loads(instance.jsonFlow)
            
            #Create state for each node
            for node in flow['nodes']:
                CreateState(node=node)

            # Update ids for current state
            for i in range(len(flow['workflow']['currentStates'])):
                flow['workflow']['currentStates'][i] = nodeDict[flow['workflow']['currentStates'][i]]
            
            #Create transition for each edge
            for edge in flow['edges']:
                # update edge source and target id from
                # database id of equivalent nodes
                edge['source'] = nodeDict[edge['source']]
                edge['target'] = nodeDict[edge['target']]
                edge['data']['transition']['previous'] = edge['source']
                edge['data']['transition']['next'] = edge['target']
                tran = CreateTransition(edge['data']['transition'], flow['workflow']['id'])
                edge['id'] = tran.id

            # Update object ids in JSON saved in db
            instance.jsonFlow = json.dumps(flow)
            instance.save()
        except Exception as e: 
            print(e)
    else:
        try:
            #User.objects.filter(id=1).update(username='edited_username')
            flow = json.loads(instance.jsonFlow)
            # savedFlow = json.loads(JSONWorkflow.objects.get(id=instance.id))

            #Create state for new nodes
            for node in flow['nodes']:                
                if(str(node['id']).__contains__('dndnode')):
                    CreateState(node=node)

            #Create transition for new edge
            for edge in flow['edges']:
                if(str(edge['id']).__contains__('dndedge')):
                    # update edge source and target id from
                    # database id of equivalent nodes
                    if (str(edge['source']).__contains__('dndnode')) and nodeDict[str(edge['source'])]:
                        edge['source'] = nodeDict[str(edge['source'])]
                        edge['data']['transition']['previous'] = edge['source']
                    if (str(edge['target']).__contains__('dndnode')) and nodeDict[str(edge['target'])]:
                        edge['target'] = nodeDict[edge['target']]
                        edge['data']['transition']['next'] = edge['target']
                    
                    tran = CreateTransition(edge['data']['transition'], flow['workflow']['id'])
                    edge['id'] = tran.id

            JSONWorkflow.objects.filter(id=instance.id).update(jsonFlow=json.dumps(flow))
            obj = JSONWorkflow.objects.get(id=instance.id)
            print(obj)

        except Exception as e:
            print(e)
        

# @receiver(post_save, sender=Workflow)
# def InitializeWorkflow(sender, instance, created, **kwargs):
#     if created:
#         start = State.objects.create(title="Start")
#         #owner = User.objects.filter(id=instance.owner).get()
#         start.notifiers.add(instance.owner)
#         end = State.objects.create(title="End")
#         end.notifiers.add(instance.owner)
#         instance.currentStates.add(start)
#         Transition.objects.create(previous=start, next=end, associatedFlow=instance)