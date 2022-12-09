import React, {useState, useEffect} from 'react'
import { useLocation } from "react-router-dom"
import {
    useDisclosure,
    Text,
    Heading
} from '@chakra-ui/react'
import NavBar from '../navigation/NavBar';
import useNotification from '../../utils/useNotification';

function Transitions() {
    const location = useLocation();
    const [notificationData, SetNotificationData] = useState(location?.state?.data)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {markRead} = useNotification()

    useEffect(() => {
        
        // let incomingTransition = undefined
        if(location?.state?.data !== null && location?.state?.data !== undefined)
        {
            // This means we came here after user clicked on a notification
            // menu item. We should mark that notification as read.
            // incomingTransition = location?.state?.data;
            markRead(location.state.data)
        }

    }, [])

    return (
        <NavBar>
            <Heading>
                <Text>{notificationData?.data?.workflow.workflow.title}</Text>
            </Heading>
        </NavBar>
    )
}

export default Transitions