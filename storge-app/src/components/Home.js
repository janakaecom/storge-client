import React from 'react'
import { service } from './helpers/Service'
import { useHistory } from 'react-router-dom';

export default function Home() {
    let history = useHistory();

    const logOut = () => {
        service.logout();
        history.push('/signIn');
    }
    const changePassword = () => {
        history.push('/change-password');

    }
    return (
        <>
            <div className="container">
                <div className="row">
                    Wel Come to Home
            <input type="button" className="btn btn-primary" onClick={logOut} value="Sign out" />
                    <input type="button" className="btn btn-primary ml-3" onClick={changePassword} value="Change password" />
                </div>
            </div>

        </>
    )
}
