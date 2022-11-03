import React from 'react'
import {Link} from 'react-router-dom'

function NotificationItem(props) {
    const messageMap = {
        1:`You are added as an approver to a transistion`,
        2:`A new work is assigned to you`,
        3:`Some tasks are overdue`

    }
  return (
    <Link to={{
        pathname: "/load-task",
        state: { task: props.notificationBody },
      }}>
          {messageMap[props.notificationBody.notification_type]}
    </Link>
  )
}

export default NotificationItem