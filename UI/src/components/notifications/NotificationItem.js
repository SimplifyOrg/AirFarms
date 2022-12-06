import React from 'react'
import {Link} from 'react-router-dom'

function NotificationItem(props) {
    const messageMap = {
        1:{'message':'You are added as an approver to a transistion', 'link':'/transitions'},
        2:{'message':'A new work is assigned to you', 'link': '/work'},
        3:{'message':'Some tasks are overdue', 'link':'/tasks'}
    }

    return (
        <Link to={messageMap[props.notificationBody.notification_type].link} state= {{ data: props.notificationBody.data }}>
            {messageMap[props.notificationBody.notification_type].message}
        </Link>
    )
}

export default NotificationItem