import React, {useState, useEffect, useContext} from 'react'
import {
    WrapItem,
    Avatar
} from '@chakra-ui/react'
import { AuthProvider } from '../../utils/AuthProvider'

function AssigneeList(props) {

    const [role, SetRole] = useState(null)
    
    // useEffect(() => {
    //     if(props.id !== 0)
    //     {
    //         let config = {
    //             headers: {
    //                 'Accept': 'application/json'
    //             }
    //         }
            
    //         // Get approver object
    //         const authProvider = AuthProvider()
    //         authProvider.authGet(`/account/user/?id=${props.id}`, config)
    //         .then(res =>{
    //             console.log(res);
    //             console.log(res.data);
    //             SetUser(res.data[0])

    //             // Get approver's profile picture
    //             authProvider.authGet(`/account/profilepicture/?user=${props.id}`, config)
    //             .then(resPic =>{
    //                 console.log(resPic);
    //                 console.log(resPic.data);
    //                 SetPicture(resPic.data[0].image)
    //                 const data = {
    //                     assignee: res.data[0],
    //                     picture: resPic.data[0].image
    //                 }

    //                 // Set the approver for top level
    //                 // transition class
    //                 props.addAssignee(data)
    //             })
    //             .catch(errorPic => {
    //                 console.log(errorPic);
    //                 console.log(errorPic.data);
    //             })

    //         })
    //         .catch(error => {
    //             console.log(error);
    //             console.log(error.data);
    //         })

            
    //     }
    // }, [])

    useEffect(() => {

        const authProvider = AuthProvider()
        let config = {
            headers: {
                'Accept': 'application/json'
            }
        }
        authProvider.authGet(`/activity/work-group/handle/?id=${props.id}`, config)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            SetRole(res.data[0])
            props.addAssignee(res.data[0])
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })

    }, [])

  return (
    <WrapItem>
        <Avatar name={role === null? '':(role.name).split('_')[0]} src={role === null? '':role.image} />
    </WrapItem>
  )
}

export default AssigneeList