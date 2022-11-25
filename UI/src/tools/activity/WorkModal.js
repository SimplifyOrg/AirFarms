import React from 'react'
import WorkUpdate from './WorkUpdate'
import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalHeader,
    Button
} from '@chakra-ui/react'

function WorkModal({onChange, addAssignee, work}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (        
        <>
        <Button onClick={onOpen}>{work.title}</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{work.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <WorkUpdate onChange={onChange} addAssigneeInNode={addAssignee} work={work}/>
                </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}

export default WorkModal