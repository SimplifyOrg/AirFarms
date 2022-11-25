from django.db.models.signals import post_save

from account.models import User
from .models import JSONWorkflow, State, Transition, TransitionApproval, Work, WorkGroups, Workflow
from django.dispatch import receiver
import json

# this dictionary keep map of old node id to database id
# this is needed to update source and target node id in
# transition objects

# It might make sense to move this dictionary to
# a more object oriented structure. As of now any server
# crash can result in loss of mapping. Moreover, there 
# might be conflict because of multiple parallel sessions
# Probably it should not be needed to persist accross 
# sessions as we stablize the UI code better.

# One solution could be to append user id along with node id
# as the key. This will create the user specific keys.
# Map will also need to be cleaned once objects are created
# and response JSON has updated ids.
nodeDict = {}

def CreateTransition(transition, workflowId):
    transition['associatedFlow'] = int(workflowId)
    needApproval = False
    sizeApproval = len(transition['transitionapprovals'])
    if sizeApproval > 0:
        needApproval = True
    tran = Transition.objects.create(
                                    previous=State.objects.get(id=int(transition['previous'])),
                                    next=State.objects.get(id=int(transition['next'])),
                                    associatedFlow=Workflow.objects.get(id=int(workflowId)),
                                    need_approval=needApproval
                                    )
    transition['id'] = int(tran.id)
    transition['need_approval'] = tran.need_approval
    # Iterate to create all transition approvals
    for approval in transition['transitionapprovals']:
        CreateTransitionApproval(approval, tran)
    
    return tran

def CreateTransitionApproval(transitionApproval, tran):
    user = User.objects.get(id=transitionApproval['approver'])
    approval = TransitionApproval.objects.create(transitionToApprove=tran, approver=user, approval=False, reject=False)
    transitionApproval['id'] = int(approval.id)
    transitionApproval['transitionToApprove'] = int(tran.id)

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
    nodeDict[node['id']] = int(state.id)
    # Update node id with correct database state id
    node['id'] = int(state.id)
    #Create work objects added in the state
    for work in node['data']['works']:
        newWork = CreateWork(work, work['notifiers'], state)
        work['id'] = int(newWork.id)

def CreateWork(work, notifiers, state):
    # query all the assignees objects
    workOwners = []
    for userId in work['assignee']:
        if userId != None:
            workOwners.append(WorkGroups.objects.get(id=userId['id']))
    
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

def UpdateWorkNotifiers(work):
    currWork = Work.objects.get(id=work['id'])
    for notifier in work['notifiers']:
        if notifier is not None:
            currWork.notifiers.add(notifier)

def UpdateWorkAssignees(work):
    currWork = Work.objects.get(id=work['id'])
    for assignee in work['assignee']:
        if assignee is not None:
            currWork.assignee.add(assignee)

def UpdateWorkFinishedStatus(work):
    val = False
    if work['has_finished'] == 'true':
        val = True
    Work.objects.filter(id=work['id']).update(has_finished=val)

def UpdateWorkNotes(work):
    Work.objects.filter(id=work['id']).update(notes=work['notes'])

def UpdateWorkCompletionDate(work):
    if work['completion_date'] != '':
        Work.objects.filter(id=work['id']).update(completion_date=work['completion_date'])

def UpdateWorkHaltedStatus(work):
    val = False
    if work['is_halted'] == 'true':
        val = True
    Work.objects.filter(id=work['id']).update(is_halted=val)

def UpdateWork(work):
    #Update notifiers
    UpdateWorkNotifiers(work)
    #Update assignees
    UpdateWorkAssignees(work)
    #Update notes
    UpdateWorkNotes(work)
    #Update Completion date
    UpdateWorkCompletionDate(work)
    #Update finished status
    UpdateWorkFinishedStatus(work)
    #Update halted status
    UpdateWorkHaltedStatus(work)

def UpdateOrCreateWork(node):
    state = State.objects.get(id=node['id'])
    for work in node['data']['works']:
        if str(work['id']).__contains__('temp'):
            newWork = CreateWork(work, work['notifiers'], state)
            work['id'] = int(newWork.id)
        else:
            existingWork = Work.objects.get(id=work['id'])
            if existingWork is None:
                newWork = CreateWork(work, work['notifiers'], state)
                work['id'] = int(newWork.id)
            else:
                UpdateWork(work)

def UpdateTransition(transition, flowId):
    #Update associated flow id
    transition['associatedFlow'] = int(flowId)
    Transition.objects.filter(id=transition['id']).update(associatedFlow=transition['associatedFlow'])
    tran = Transition.objects.get(id=transition['id'])
    #Update or create Transistion approvals
    for transitionApproval in transition['transitionapprovals']:
        try:
            approval = TransitionApproval.objects.get(id = transitionApproval['id'])
            if approval is not None:
                approvalVal = False
                if transitionApproval['approval'] == 'true':
                    approvalVal = True
                rejectVal = False
                if transitionApproval['reject'] == 'true':
                    rejectVal = True
                #Update existing transition approval
                TransitionApproval.objects.filter(id=transitionApproval['id']).update(transitionToApprove=tran,
                                                                                    approver=int(transitionApproval['approver']),
                                                                                    approval=approvalVal,
                                                                                    reject=rejectVal
                                                                                    )
        except TransitionApproval.DoesNotExist:
            #Create new Transition approval
            CreateTransitionApproval(transitionApproval, tran)
            

def UpdateOrCreateTransition(edge, flow):
    # update edge source and target id from
    # database id of equivalent nodes
    if (str(edge['source']).__contains__('dndnode')) and nodeDict[str(edge['source'])]:
        edge['source'] = int(nodeDict[str(edge['source'])])
        edge['data']['transition']['previous'] = int(edge['source'])
    if (str(edge['target']).__contains__('dndnode')) and nodeDict[str(edge['target'])]:
        edge['target'] = int(nodeDict[edge['target']])
        edge['data']['transition']['next'] = int(edge['target'])
    #Create new transition(edge) if not created already
    if(str(edge['id']).__contains__('dndedge')):
        #This takes care of creating all child elements like Transition approvals
        tran = CreateTransition(edge['data']['transition'], flow['workflow']['id'])
        edge['id'] = int(tran.id)
    else:
        #Upate transitions
        UpdateTransition(edge['data']['transition'], flow['workflow']['id'])

@receiver(post_save, sender=JSONWorkflow)
def JSONWorkflowHandler(sender, instance, created, **kwargs):
    if created:
        #Create entrie flow here
        try:
            flow = json.loads(instance.jsonFlow)
            
            #Create state for each node
            for node in flow['nodes']:
                CreateState(node=node)

            # Update ids for start state
            flow['workflow']['startState'] = int(nodeDict['n1'])
            # Update ids for current state
            # for i in range(len(flow['workflow']['currentStates'])):
            #     flow['workflow']['currentStates'][i] = int(nodeDict[flow['workflow']['currentStates'][i]])
            
            #Create transition for each edge
            for edge in flow['edges']:
                # update edge source and target id from
                # database id of equivalent nodes
                edge['source'] = int(nodeDict[edge['source']])
                edge['target'] = int(nodeDict[edge['target']])
                edge['data']['transition']['previous'] = int(edge['source'])
                edge['data']['transition']['next'] = int(edge['target'])
                tran = CreateTransition(edge['data']['transition'], flow['workflow']['id'])
                edge['id'] = int(tran.id)

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
                if(str(node['id']).__contains__('dndnode') or str(node['id']).__contains__('n1')):
                    #This will take care of creating
                    #all the child objects like work
                    #and assigning people appropriately
                    CreateState(node=node)
                else:
                    #update title, label, notes and notifiers
                    State.objects.filter(id=node['id']).update(title=node['data']['title'], 
                                                                notes=node['data']['notes']
                                                                )
                    #Add notifiers
                    state = State.objects.get(id=node['id'])
                    for notifier in node['data']['notifiers']:
                        if notifier is not None:
                            state.notifiers.add(notifier)
                    #update/create work
                    UpdateOrCreateWork(node=node)

            #Create transition for new edge
            #Update or create edges after nodes
            #This helps in getting the updated 
            #ID from db for nodes.
            for edge in flow['edges']:
                UpdateOrCreateTransition(edge, flow)
                

            JSONWorkflow.objects.filter(id=instance.id).update(jsonFlow=json.dumps(flow))
            instance.jsonFlow = json.dumps(flow)
            # obj = JSONWorkflow.objects.get(id=instance.id)
            # print(obj)

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