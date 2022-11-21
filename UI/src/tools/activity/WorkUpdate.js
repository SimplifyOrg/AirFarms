import React, {useContext, useCallback} from 'react'
import EditableComponent from '../../components/EditableComponent'
import NodeContext from '../../utils/NodeContext';
import WorkflowContext from '../../utils/WorkflowContext';
import {
    Box,
    Stack,
    Heading
} from '@chakra-ui/react'

function WorkUpdate({onChange, work}) {

    const { node } = useContext(NodeContext);
    const { workflow } = useContext(WorkflowContext);

    const updateWorkTitle = useCallback((name) => {

        let workObj = work;
        workObj.tittle = name;
        onChange(workObj);
        
        
        // let currWorkflow = JSON.parse(localStorage.getItem(workflow));
        // let nodeIndex = -1;

        // // Iterate over all nodes and find the node
        // // to add the new work
        // for(let i = 0; i < currWorkflow.nodes.length; ++i)
        // {
        //     if(currWorkflow.nodes[i].id == node.id)
        //     {
        //         nodeIndex = i
        //         break;
        //     }
        // }

        // if(nodeIndex != -1)
        // {
        //     for(let i = 0; i < currWorkflow.nodes[nodeIndex].data.works.lenght; ++i)
        //     {
        //         if(currWorkflow.nodes[nodeIndex].data.works.id === work.id)
        //         {
        //             currWorkflow.nodes[nodeIndex].data.works[i].title = name;
        //             localStorage.setItem(workflow, JSON.stringify(currWorkflow));
        //             onChange(workObj);
        //             break;
        //         }
        //     }
        // }
        
        
    }, []);

    const updateDescription = useCallback((name) => {

        let workObj = work;
        workObj.tittle = name;
        onChange(workObj);
        
        // let currWorkflow = JSON.parse(localStorage.getItem(workflow));
        // let nodeIndex = -1;

        // // Iterate over all nodes and find the node
        // // to add the new work
        // for(let i = 0; i < currWorkflow.nodes.length; ++i)
        // {
        //     if(currWorkflow.nodes[i].id == node.id)
        //     {
        //         nodeIndex = i
        //         break;
        //     }
        // }

        // if(nodeIndex != -1)
        // {
        //     for(let i = 0; i < currWorkflow.nodes[nodeIndex].data.works.lenght; ++i)
        //     {
        //         if(currWorkflow.nodes[nodeIndex].data.works.id === work.id)
        //         {
        //             currWorkflow.nodes[nodeIndex].data.works[i].notes = name;
        //             localStorage.setItem(workflow, JSON.stringify(currWorkflow));
        //             onChange(workObj);
        //             break;
        //         }
        //     }
        // }
        
    }, []);
    return (
        <>
            <Box p={6}>
                <Stack spacing={0} align={'center'} mb={5}>
                    <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                        <EditableComponent color={'gray.500'} defaultValue={work.title} updateTitle={updateWorkTitle}/>
                    </Heading>
                    <EditableComponent color={'gray.500'} defaultValue={work.notes} updateTitle={updateDescription}/>
                </Stack>
            </Box>
        </>
    )
}

export default WorkUpdate