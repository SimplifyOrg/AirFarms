import React, {useCallback, useContext, useState, useEffect} from 'react'
import {Handle, Position} from 'react-flow-renderer'
import { 
    Accordion,
    AccordionItem, 
    AccordionPanel, 
    AccordionButton, 
    Box,
    AvatarGroup,
    Avatar,
    Button,
    Portal,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverCloseButton,
    PopoverBody,
    VStack,
    useDisclosure
 } from '@chakra-ui/react';
import { MinusIcon, AddIcon } from '@chakra-ui/icons'
import Work from './Work';
import NodeContext from '../../utils/NodeContext';

const handleStyle = { left: 10 };

function WorkflowNode({data}) {

    let initialWorks = []
    const [workList, SetWorkList] = useState(initialWorks)
    
    const {node} = useContext(NodeContext)

    const onChange = useCallback((work) => {
        initialWorks.push(work)
        SetWorkList(initialWorks)
    }, []);
    
  return (
    <Box bg='#DBF1FF' display='flex' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Handle type="target" position={Position.Top} />
        {/* <div>
            <label htmlFor="text">Work:</label>
            <input id="work" name="text" onChange={onChange} />
        </div> */}
        <VStack display='flex'>
        <Accordion>
            <AccordionItem>
                {({ isExpanded }) => (
                <>
                    <h2>
                    <AccordionButton>
                        <Box flex='1' textAlign='left'>
                        {data !== {}? data?.label : 'New Node'}
                        </Box>
                        {isExpanded ? (
                        <MinusIcon fontSize='12px' />
                        ) : (
                        <AddIcon fontSize='12px' />
                        )}
                    </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <Popover>
                            <PopoverTrigger>
                                <Button>Add work</Button>
                            </PopoverTrigger>
                            <Portal>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverHeader>New Work</PopoverHeader>
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        <Work onChange={onChange}/>
                                    </PopoverBody>
                                </PopoverContent>
                            </Portal>
                        </Popover>
                    </AccordionPanel>
                </>
                )}
            </AccordionItem>
        </Accordion>
        <VStack display='flex' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        {
            workList.length === 0 ? <p></p>: workList.map((work, idx) => {
            return(
                <Button key={idx} >{work.notes}</Button>
            )
            })
        }
        </VStack>
        <AvatarGroup size='xs' max={2}>
            <Avatar name='Ryan Florence' src='https://bit.ly/ryan-florence' />
            <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
            <Avatar name='Kent Dodds' src='https://bit.ly/kent-c-dodds' />
            <Avatar name='Prosper Otemuyiwa' src='https://bit.ly/prosper-baba' />
            <Avatar name='Christian Nwamba' src='https://bit.ly/code-beast' />
        </AvatarGroup>
        </VStack>
        <Handle type="source" position={Position.Bottom} id="a" />
    </Box>
  )
}

export default WorkflowNode