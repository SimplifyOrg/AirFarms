import React, {useEffect, useState} from 'react'
import { AuthProvider } from '../../utils/AuthProvider';
import RoleUsers from './RoleUsers';

function Role({role}) {

    let initSet = new Set()
    let initialUsers = []
    const [users, SetUsers] = useState(initialUsers)
    
    useEffect(() => {

        // const currWorkflow = localStorage.getItem(workflow);
        // const workflowObj = JSON.parse(currWorkflow)

        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        authProvider.authGet(`/account/user/?groups=${role.id}&&ordering=-id`, config)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            for(let i = 0; i <  res.data.length; ++i)
            {
                if(!initSet.has(res.data[i].id))
                {
                    initSet.add(res.data[i].id)
                    initialUsers.push(res.data[i])
                    SetUsers(initialUsers.slice())
                }
            }

        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })

    }, [])

    return (
        <RoleUsers role={role} users={users}/>
    )
}

export default Role