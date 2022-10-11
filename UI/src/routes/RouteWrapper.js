import React from 'react'
import {Route, Navigate} from 'react-router-dom'
import {PropTypes} from 'prop-types'
import {TokenProvider} from '../utils/TokenProvider'

function RouteWrapper({
    component: Component,
    isPrivate,
    ...rest
}) {
    
    const tokenProvider = TokenProvider();
    const signedIn = tokenProvider.isLoggedIn()

    //TODO: check if logged in or not

    //Route is private and user is NOT logged in

    if(isPrivate && !signedIn){
        return <Route to="/login"/>
    }

    //Route is public and user is logged in

    if(!isPrivate && signedIn){
        return <Route to="/workflow"/>
    }

    return <Route {...rest} component={Component}/>    
}

RouteWrapper.propTypes = {
    isPrivate: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
}

RouteWrapper.defaultProps = {
    isPrivate: false
}

export default RouteWrapper
