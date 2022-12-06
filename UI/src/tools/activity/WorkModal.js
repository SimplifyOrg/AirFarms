import React from 'react'
import WorkUpdate from './WorkUpdate'
import {
    useDisclosure,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalHeader,
    Button,
    Grid,
    GridItem,
    Checkbox
} from '@chakra-ui/react'
import DiscussionBoard from '../DiscussionBoard'
import { BiCommentDetail } from "react-icons/bi";
import { AuthProvider } from '../../utils/AuthProvider';

function WorkModal({onChange, addAssignee, work, check}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    // Mark work as complete
    // Send direct request to database
    const sendSelection = (e, work) => {
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        const authProvider = AuthProvider()
        work.has_finished = e.target.checked
        const finished = {
            has_finished: e.target.checked
        }
        authProvider.authPatch(`/activity/execution/work/handle/${work.id}/`, finished, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
            onChange(res.data)
            toast({
                position: 'top',
                title: `Approved`,
                description: `${work.title} is marked complete`,
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
        })
        .catch(error => {
            console.log(error);
        })
    }

    return (        
        <>
        <Button variant='ghost' onClick={onOpen}><BiCommentDetail/></Button>
        <Modal size='3xl' isOpen={isOpen} onClose={onClose} display='flex' isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{work.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Grid
                    templateRows='repeat(2, 1fr)'
                    templateColumns='repeat(10, 1fr)'
                    gap={4}
                    >
                        <GridItem rowSpan={2} colStart={0} colEnd={1}>
                            <WorkUpdate onChange={onChange} addAssigneeInNode={addAssignee} work={work}/>
                            {check?<Checkbox isChecked={work.has_finished === 'true' || work.has_finished === true} size='sm' colorScheme='green' borderColor='red.400' onChange={(e)=>{sendSelection(e, work)}}></Checkbox>:<Checkbox size='sm' colorScheme='green' iconColor='red.400' isDisabled></Checkbox>}
                        </GridItem>
                        <GridItem rowSpan={2} colStart={2} colEnd={11}>
                            <DiscussionBoard discussion_id={work.id}/>
                        </GridItem>
                    </Grid>                    
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}

export default WorkModal