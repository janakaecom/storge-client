import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { Route } from 'react-router-dom';
import { isLogin } from '../helpers/IsUserLogged';
import { isAllowed } from './UserRight';


const PrivateRoute = ({ component: Component, permission, ...rest }) => {
    // return (
    //     <Route {...rest} render={props =>
    //         (
    //             isLogin() ?
    //                 (isAllowed(permission) ? <Component {...props} /> : <Redirect to="/UnAuthorized" />)
    //                 : <Redirect to="/" />
    //         )} />

    // );
    debugger
    return (
        <Route {...rest} render={props =>
            (
                isLogin() ?
                    <Component {...props} />
                    : <Redirect to="/signIn" />
            )} />
    );
};

export default PrivateRoute
