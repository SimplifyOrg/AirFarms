import React, {useState, useEffect} from 'react'
import {
    WrapItem,
    Avatar
} from '@chakra-ui/react'
import { AuthProvider } from '../../utils/AuthProvider'

function Approver(props) {

    const [user, SetUser] = useState(null)
    const [picture, SetPicture] = useState(null)
    
    useEffect(() => {
        if(props.id !== 0)
        {
            let config = {
                headers: {
                    'Accept': 'application/json'
                }
            }
            
            // Get approver object
            const authProvider = AuthProvider()
            authProvider.authGet(`/account/user/?id=${props.id}`, config)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                SetUser(res.data[0])

                // Get approver's profile picture
                authProvider.authGet(`/account/profilepicture/?user=${props.id}`, config)
                .then(resPic =>{
                    console.log(resPic);
                    console.log(resPic.data);
                    SetPicture(resPic.data[0].image)
                    const data = {
                        approver: res.data[0],
                        picture: resPic.data[0].image
                    }

                    // Set the approver for top level
                    // transition class
                    props.addApprover(data)
                })
                .catch(errorPic => {
                    console.log(errorPic);
                    console.log(errorPic.data);
                })

            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })

            
        }
    }, [])

  return (
    <WrapItem>
        <Avatar name={user === null? '':user.first_name} src={picture} />
    </WrapItem>
  )
}

export default Approver