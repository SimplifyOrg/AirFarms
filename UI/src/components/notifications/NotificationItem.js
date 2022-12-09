import React, {useState, useEffect, useCallback} from 'react'
import {Link} from 'react-router-dom'
import { AuthProvider } from '../../utils/AuthProvider'

function NotificationItem(props) {

    const [sender, SetSender] = useState(null)
    const [work, SetWork] = useState(null)
    const [isClicked, SetIsClicked] = useState(false)

    useEffect(() => {
        // TODO: get the sender object
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }           
        
        // Get approver object
        const authProvider = AuthProvider()
        authProvider.authGet(`/account/user/?id=${props.notificationBody.sender_id}`, config)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            SetSender(res.data[0])
        })
        .catch(error => {
            console.log(error);
        })

    }, [props.notificationBody, isClicked])

    useEffect(() => {
        if(props.notificationBody?.data?.transition)
        {
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }           
            
            const authProvider = AuthProvider()
            authProvider.authGet(`/activity/work/handle/?associatedState=${props.notificationBody.data.transition.previous}`, config)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                SetWork(res.data[0])
            })
            .catch(error => {
                console.log(error);
            })
        }

    }, [props.notificationBody, isClicked])

    const onClick = useCallback((event) => {     
        SetIsClicked(true)       
    }, [])
    

    const messageMap = {
        1:{'message':`${sender?.first_name} added you as an approver to a task ${work?.title}`, 'link':'/transitions'},
        2:{'message':`${sender?.first_name} assigned a task ${work?.title} to you`, 'link': '/work'},
        3:{'message':'Some tasks are overdue', 'link':'/tasks'}
    }

    return (
        <Link to={messageMap[props.notificationBody.notification_type].link} state= {{ data: props.notificationBody }} onClick={onClick}>
            {messageMap[props.notificationBody.notification_type].message}
        </Link>
    )
}

export default NotificationItem