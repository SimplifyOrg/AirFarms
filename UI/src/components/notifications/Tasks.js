import React, {useState, useEffect} from 'react'
import { useLocation } from "react-router-dom"
import NavBar from '../navigation/NavBar';
import useNotification from '../../utils/useNotification';

function Tasks() {
    const location = useLocation();
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
            <div>Tasks</div>
        </NavBar>
    )
}

export default Tasks