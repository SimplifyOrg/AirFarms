import React, {useContext, useEffect} from 'react'
import WorkflowDiagram from './activity/WorkflowDiagram'
// import NavBar from '../components/NavBar'
import {Box} from '@chakra-ui/react'
import { useLocation } from "react-router-dom"
import FarmContext from '../utils/FarmContext'
import WorkflowContext from '../utils/WorkflowContext'
import UserContext from '../utils/UserContext'

function Workflow() {
    const {workflow, setWorkflow} = useContext(WorkflowContext)
    const {farm} = useContext(FarmContext)
    const {user} = useContext(UserContext)

    useEffect(() => {   
        const workflowInit = {
            workflow: {
                id: "1",
                title: "New workflow",
                currentStates: [1],
                has_finished: "false",
                farm: farm,
                owner: user.id,
                is_production: "false"
            },
            nodes: [
                {
                    id: 'n1',
                    type: 'workflowNode',
                    data: { 
                        label: 'start',
                        title: 'start',
                        notifiers: [user.id],
                        notes: "",
                        works: []
                    },
                    position: { x: 50, y: 5 },
                },
                {
                    id: 'n2',
                    type: 'workflowNode',
                    data: { 
                        label: 'end',
                        title: 'end',
                        notifiers: [user.id],
                        notes: "",
                        works: []
                    },
                    position: { x: 250, y: 5 },
                },
            ],
            edges: [
                {
                    id: '1',
                    source: 'n1',
                    target: 'n2',
                    type: 'buttonedge',
                    sourceHandle: "a",
                    animated: true,
                    data: { 
                        label:'Approval', 
                        text: 'New transition',
                        transition: 
                        {
                            id: "1",
                            previous: "n1",
                            next: "n2",
                            associatedFlow: "1",
                            need_approval: false,
                            transitionapprovals: []
                        }
                    }
                }
            ]

        }     
        const flowJSON = JSON.stringify(workflowInit);
        setWorkflow(flowJSON)
    }, [])

  return (
        <>
            {/* <NavBar/> */}
            <Box 
            display='flex' 
            p='3' 
            maxW='bg' 
            alignItems='top' 
            height='600px' 
            borderWidth="2px" 
            borderRadius="lg"
            ml='2'
            mr='2'
            > 
                <WorkflowDiagram/>
            </Box>
        </>
  )
}

export default Workflow