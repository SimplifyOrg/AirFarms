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
    GridItem
} from '@chakra-ui/react'
import DiscussionBoard from '../DiscussionBoard'
import { BiCommentDetail } from "react-icons/bi";
import { AuthProvider } from '../../utils/AuthProvider';

function WorkModal({onChange, addAssignee, work, check}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

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