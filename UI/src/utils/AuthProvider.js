import React, { useEffect, useState } from "react"
import {TokenProvider} from './TokenProvider'
import {decode as atob, encode as btoa} from 'base-64'
import axios from 'axios';
import useLocalStorage from './useLocalStorage'
axios.defaults.withCredentials = true;

export const AuthProvider = () => {

    const tokenProvider = TokenProvider();
    const {setLocalStorage, getLocalStorage} = useLocalStorage()

    const login = (accessToken, refreshToken) => {
        tokenProvider.setToken(accessToken, refreshToken);
        document.cookie = `airfarms_access_token=${accessToken};airfarms_refresh_token=${refreshToken};path=/`;
        setLocalStorage("airfarms_refresh_token", refreshToken)
        setLocalStorage("airfarms_access_token", accessToken)
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
        let refreshToken;
        if(token?.refreshToken === undefined || token?.refreshToken === '')
        {
            refreshToken = document.cookie.replace(/(?:(?:^|.*;\s*)airfarms_refresh_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
            if(token?.refreshToken === undefined || token?.refreshToken === '' )
            {
                refreshToken = getLocalStorage("airfarms_refresh_token")
            }
        }
        else
        {
            refreshToken = token.refreshToken;
        }
        
        const tokenRefresh = {
            refresh: refreshToken
        };
        // console.log(user);
        let config = {
            headers: {
              'Content-Type': 'application/json'
            }
        }
        await authPost(`/account/token/refresh/`, tokenRefresh, config, true)
        .then(res =>{            
            login(res.data.access, refreshToken)
        })
        .catch(error => {
            // console.log("In catch");
            console.log(error);
            console.log(error.data);
            // document.cookie="name=airfarms_access_token;max-age=0";
            // document.cookie="name=airfarms_refresh_token;max-age=0";
            // setLocalStorage("airfarms_refresh_token", '')
            // setLocalStorage("airfarms_access_token", '')
            // setLocalStorage("user", 'user')
            // setLocalStorage("workflow", 'workflow')
            // setLocalStorage("farm", 'farm')
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
        if(lastFetch !== undefined && lastFetch !== null)
        {
            const lastFetchTime = new Date(lastFetch)
            
            if(lastFetchTime !== undefined && now.getTime() - lastFetchTime.getTime()  > fourMinutes ){
                await updateToken();
                sessionStorage.setItem("lastFetch", new Date());
            }
        }
        else
        {
            await updateToken();
            sessionStorage.setItem("lastFetch", new Date());
        }
    }

    // window.onload = fetchValidToken;
    window.addEventListener("load", (event) => {
        fetchValidToken();
    });

    const authPost = async (url, body, init, isLogin) => {
        
        // let domain = `http://127.0.0.1:8000`;
        let domain = `http://ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:8000`;
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
        // let domain = `http://127.0.0.1:8000`;
        let domain = `http://ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:8000`;
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
        // let domain = `http://127.0.0.1:8000`;
        let domain = `http://ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:8000`;
        let location = domain.concat("", url);
        init.headers = {
            ...init.headers,
            Authorization: `Bearer ${token.accessToken}`,
        };
        
        return axios.put(location, body, init)      
    };

    const authGet = async (url, init, useToken=true) => {
        
        init = init || {};
        // let domain = `http://127.0.0.1:8000`;
        let domain = `http://ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:8000`;
        let location = domain.concat("", url);

        if(useToken)
        {
            await fetchValidToken();
            const token = await tokenProvider.getToken();
            
            init.headers = {
                ...init.headers,
                Authorization: `Bearer ${token.accessToken}`,
            };
            console.log(init.headers)
        }
        
        return axios.get(location, init)      
    };

    const authDelete = async (url, init) => {       
        
        init = init || {};
        await fetchValidToken();
        const token = await tokenProvider.getToken();
        // let domain = `http://127.0.0.1:8000`;
        let domain = `http://ec2-65-1-131-213.ap-south-1.compute.amazonaws.com:8000`;
        let location = domain.concat("", url);
        init.headers = {
            ...init.headers,
            Authorization: `Bearer ${token.accessToken}`,
        };
        
        return axios.delete(location, init)      
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
        authDelete,
        login,
        logout
    };
};

export const {useAuth, authPost, login, logout} = AuthProvider();
//export default {createAuthProvider};