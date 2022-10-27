import React from 'react'
import {Link} from 'react-router-dom'

function NotificationItem(props) {
  return (
    <Link to={{
        pathname: "/load-task",
        state: { task: props.notificationBody },
      }}>
          {props.notificationBody.notification_type}
    </Link>
  )
}

export default NotificationItem