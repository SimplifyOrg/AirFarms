import React, {useContext} from 'react'
import {Box} from '@chakra-ui/react'
import {AuthProvider} from '../utils/AuthProvider'
// import { useCookies } from 'react-cookie';
import UserContext from '../utils/UserContext';
import NavBar from '../components/navigation/NavBar';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../utils/useLocalStorage'

export default function Logout(props) {

    // const [cookies, removeCookie] = useCookies(['airfarms_access_token']);
    const {setLocalStorage} = useLocalStorage()
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()

    const readCookie = (cname) => {
        var name = cname + "=";
        var decoded_cookie = 
            decodeURIComponent(document.cookie);
        var carr = decoded_cookie.split(';');
        for(var i=0; i<carr.length;i++){
            var c = carr[i];
            while(c.charAt(0)==' '){
                c=c.substring(1);
            }
            if(c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    const onLogout = function() {
        //Call login API
        const refresh_token = readCookie('airfarms_refresh_token')
        const refresh = {
            refresh_token: refresh_token
        };        

        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        const authProvider = AuthProvider()
        authProvider.authPost(`/account/logout/`, refresh, config, false)
        .then(res =>{
            console.log(res);
            console.log(res.data);
            // removeCookie('airfarms_access_token');
            
        })
        .catch(error => {
            console.log(error);
            console.log(error.data);
        })

        document.cookie="name=airfarms_access_token;max-age=0";
        document.cookie="name=airfarms_refresh_token;max-age=0";
        setLocalStorage("airfarms_refresh_token", '')
        setLocalStorage("airfarms_access_token", '')
        authProvider.logout()
        setUser('user')
        navigate('/')
    };

    return (
        <Box>
            <NavBar></NavBar>
            User logged out
            <div>{onLogout.call(this)}</div>
        </Box>
    )
}
