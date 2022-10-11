import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react-dom";
// import { useCookies } from 'react-cookie';

export const TokenProvider = () => {
    // const [cookies, setCookie] = useCookies(['airfarms']);
    
    /* Implementation */
    const _token = {
        accessToken:'',
        refreshToken: ''
    }

    //const secret = useAccessToken()

    const getToken = async () => {
        let accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)airfarms_access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        let refreshToken = document.cookie.replace(/(?:(?:^|.*;\s*)airfarms_refresh_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")
        _token.accessToken = accessToken
        _token.refreshToken = refreshToken

        return _token;
    };

    const isLoggedIn = () => {
        let logged = false
        getToken()
        if(_token.accessToken === 'undefined' || _token === '')
        {
            logged = false;
        }
        else
        {
            logged = true;
        }
        return logged;
    };

    let observers = [];

    const subscribe = (observer) => {
        observers.push(observer);
    };

    const unsubscribe = (observer) => {
        observers = observers.filter(_observer => _observer !== observer);
    };

    const notify = () => {
        const isLogged = isLoggedIn();
        observers.forEach(observer => observer(isLogged));
    };

    const setToken = (accessToken, refreshToken) => {
        
        const token = {
            accessToken: accessToken,
            refreshToken: refreshToken
            };
        if (token) 
        {
            //setAccessToken(token.accessToken)
            _token.accessToken = token.accessToken
            _token.refreshToken = token.refreshToken
        } 
        else 
        {
            _token = ''//__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        }
        notify();
    };

    return {
        getToken,
        isLoggedIn,
        setToken,
        subscribe,
        unsubscribe,
    };
};

export const {isLoggedIn} = TokenProvider();