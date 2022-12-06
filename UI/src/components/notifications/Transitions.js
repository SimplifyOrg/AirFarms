import React, {useState, useEffect} from 'react'
import { useLocation } from "react-router-dom"
import {
    useDisclosure,
    Text,
    Heading
} from '@chakra-ui/react'
import NavBar from '../navigation/NavBar';

function Transitions() {
    const location = useLocation();
    const [notificationData, SetNotificationData] = useState(location?.state?.data)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        
        let incomingTransition = undefined
        if(location?.state?.data !== null && location?.state?.data !== undefined)
        {
            incomingTransition = location?.state?.data;
        }

    }, [])

    return (
        <NavBar>
            <Heading>
                <Text>{notificationData?.workflow.workflow.title}</Text>
            </Heading>
        </NavBar>
    )
}

export default Transitions