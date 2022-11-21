import React, {useState, useEffect, useContext} from 'react'
import { BellIcon } from '@chakra-ui/icons'
import {IconButton} from '@chakra-ui/button'
import UserContext from '../utils/UserContext'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button
  } from '@chakra-ui/react'

import NotificationBadge from '../components/notifications/NotificationBadge'
import NotificationItem from '../components/notifications/NotificationItem'

function Notifications() {

    const { user } = useContext(UserContext)
    let initialNotifications = []
    let initNotifications = new Set()
    const [notifications, SetNotifications] = useState(initialNotifications)
    const [websocket, SetWebsocket] = useState(null)

    useEffect(() => {
        //TODO: make changes to receive notifications
        if(user.data.id !== undefined && websocket === null)
        {
            // const websocketLink = `ws://ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:9001/messaging/notification/${user.data.id}`
            const websocketLink = `ws://127.0.0.1:8000/messaging/notification/${user.data.id}`
            const webSock = new WebSocket(websocketLink)
            SetWebsocket(webSock)


            webSock.onopen = () => {
                // on connecting, do nothing but log it to the console
                console.log('connected')
            }

            webSock.onmessage = evt => {
                // listen to data sent from the websocket server
                const message = JSON.parse(evt.data)
                let messages = JSON.parse(message.data.value)
                for(let i = 0; i < messages.length; ++i)
                {
                    if(!initNotifications.has(messages[i].id))
                    {
                        initNotifications.add(messages[i].id)
                        initialNotifications.push(messages[i])
                    }                    
                }
                SetNotifications(initialNotifications.slice())
                console.log(message)
            }

            webSock.onerror = function(error) {
                //alert(`[error] ${error.message}`);
                console.log(error)
            }

        }

    }, []);

    useEffect(() => {
        //TODO: make changes to receive notifications        

    }, [notifications]);

    return (
        <Menu>
            <MenuButton ml={8}>
                { <NotificationBadge count={notifications.length}/>}
            </MenuButton>
            {notifications.length === 0 ? <></>:
                <MenuList>
                {
                    Array.from(notifications).map((notificationBody, idx) => {
                    return(
                        <MenuItem>
                            <NotificationItem key={idx} notificationBody={notificationBody}/>
                        </MenuItem>
                    )
                    })
                }
                </MenuList>
            }
        </Menu>
    )
}

export default Notifications