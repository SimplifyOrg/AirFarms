import React, { useEffect, useState } from "react"
import {TokenProvider} from './TokenProvider'
import {decode as atob, encode as btoa} from 'base-64'
import axios from 'axios';
axios.defaults.withCredentials = true;

export const AuthProvider = () => {

    const tokenProvider = TokenProvider();

    const login = (accessToken, refreshToken) => {
        tokenProvider.setToken(accessToken, refreshToken);
        document.cookie = `airfarms_access_token=${accessToken};airfarms_refresh_token=${refreshToken};path=/`;
    };
    
    const logout = () => {
        tokenProvider.setToken();
    };

    const getPayload = (jwt) =>
    {
        // A JWT has 3 parts separated by '.'
        // The middle part is a base64 encoded JSON
        // decode the base64 
        return atob(jwt.split(".")[1])
    }

    const updateToken = async () =>
    {
        const token = await tokenProvider.getToken();
        const tokenRefresh = {
            refresh: token.refreshToken
          };
        // console.log(user);
        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        await authPost(`/account/token/refresh/`, tokenRefresh, config, true)
        .then(res =>{            
            login(res.data.access, res.data.refresh)

        })
        .catch(error => {
            // console.log("In catch");
            // console.log(error);
            // console.log(error.data);
            //dispatch(userAction('{}'));
            // setErrorFlag(true)
            // setError(error)
        })
    }
    
    const fetchValidToken = async () =>
    {
        // const token = await tokenProvider.getToken();
        // const payloadText = getPayload(token.accessToken);
        // const payload = JSON.parse(payloadText)
        // const expiration = new Date(payload.exp);
        const now = new Date();
        const fourMinutes = 1000 * 60 * 4;
        let lastFetch = sessionStorage.getItem("lastFetch");
        if(lastFetch !== undefined)
        {
            const lastFetchTime = new Date(lastFetch)
            
            if(lastFetchTime !== undefined && now.getTime() - lastFetchTime.getTime()  > fourMinutes ){
                await updateToken();
                sessionStorage.setItem("lastFetch", new Date());
            }
        }
    }

    const authPost = async (url, body, init, isLogin) => {
        
        let domain = `http://127.0.0.1:8000`;
        //let domain = `http://airfa-loadb-k74y8ct6ljs9-46c5c512b06feb5a.elb.ap-south-1.amazonaws.com:8000`;
        let location = domain.concat("", url);
        init = init || {};
        if(!isLogin)
        {
            await fetchValidToken();
            const token = await tokenProvider.getToken();
    
            init.headers = {
                ...init.headers,
                Authorization: `Bearer ${token.accessToken}`,
            };
        }
        // console.log(location);
        // console.log(body);
        // console.log(init);
        return axios.post(location, body, init)      
    };

    const authPatch = async (url, body, init) => {
        
        
        init = init || {};
        await fetchValidToken();
        const token = await tokenProvider.getToken();
        let domain = `http://127.0.0.1:8000`;
        //let domain = `http://airfa-loadb-k74y8ct6ljs9-46c5c512b06feb5a.elb.ap-south-1.amazonaws.com:8000`;
        let location = domain.concat("", url);
        init.headers = {
            ...init.headers,
            Authorization: `Bearer ${token.accessToken}`,
        };
        
        return axios.patch(location, body, init)      
    };

    const authPut = async (url, body, init) => {
        
        
        init = init || {};
        await fetchValidToken();
        const token = await tokenProvider.getToken();
        let domain = `http://127.0.0.1:8000`;
        //let domain = `http://airfa-loadb-k74y8ct6ljs9-46c5c512b06feb5a.elb.ap-south-1.amazonaws.com:8000`;
        let location = domain.concat("", url);
        init.headers = {
            ...init.headers,
            Authorization: `Bearer ${token.accessToken}`,
        };
        
        return axios.put(location, body, init)      
    };

    const authGet = async (url, init) => {
        
        init = init || {};
        await fetchValidToken();
        const token = await tokenProvider.getToken();
        let domain = `http://127.0.0.1:8000`;
        //let domain = `http://airfa-loadb-k74y8ct6ljs9-46c5c512b06feb5a.elb.ap-south-1.amazonaws.com:8000`;
        let location = domain.concat("", url);
        init.headers = {
            ...init.headers,
            Authorization: `Bearer ${token.accessToken}`,
        };
        console.log(init.headers)
        
        return axios.get(location, init)      
    };

    const useAuth = () => {
        const [isLogged, setIsLogged] = useState(tokenProvider.isLoggedIn());
    
        useEffect(() => {
            const listener = (newIsLogged) => {
                setIsLogged(newIsLogged);
            };
            
            tokenProvider.subscribe(listener);
            return () => {
                tokenProvider.unsubscribe(listener);
            };
        }, []);
    
        return [isLogged];
    };

    return {
        useAuth,
        authPost,
        authPatch,
        authGet,
        authPut,
        login,
        logout
    };
};

export const {useAuth, authPost, login, logout} = AuthProvider();
//export default {createAuthProvider};