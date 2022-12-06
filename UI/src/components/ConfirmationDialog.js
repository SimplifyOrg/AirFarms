import React, {useCallback} from 'react'
import {
    useDisclosure,
    Button,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter
} from '@chakra-ui/react'

function ConfirmationDialog({handleOk, handleCancel, ok, cancel, title, body, isOpen, onOpen, onClose}) {

    return (
        <>
        <Modal isOpen={isOpen} onClose={onClose} closeOnEsc={true} closeOnOverlayClick={true} onCloseComplete={handleCancel} onEsc={handleCancel}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {body}
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={handleOk}>
                    {ok}
                </Button>
                <Button variant='ghost' onClick={handleCancel}>
                    {cancel}
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default ConfirmationDialog