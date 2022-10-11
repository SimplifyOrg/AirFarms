import React from 'react'
import {Box} from '@chakra-ui/react'
import {AuthProvider} from '../utils/AuthProvider'
import { useCookies } from 'react-cookie';

export default function Logout(props) {

    const [cookies, removeCookie] = useCookies(['airfarms_access_token']);

    const onLogout = function() {
        //Call login API
        const user = {};

        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        const authProvider = AuthProvider()
        authProvider.authPost(`/accounts/logout`, user, config, false)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            removeCookie('airfarms_access_token');
            authProvider.logout()
            
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })
    };

    return (
        <Box>
            User logged out
            <div>{onLogout.call(this)}</div>
        </Box>
    )
}
