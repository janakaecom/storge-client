import React, { useState, useEffect } from "react";
import useForm from "../useForm";
import { service } from "../helpers/Service";
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import { isLogin } from "../helpers/IsUserLogged";

const initialFieldValues = {
    MobileNo: '0715701413',
    DOB: '1994-06-30',
    Password: 'a',

}
export default function SignIn() {

    let history = useHistory();
    // useEffect(() => {
    //     if (isLogin) {
    //         history.push('/home');
    //     }

    // });

    const handleSubmit = e => {
        debugger
        e.preventDefault()
        if (validate()) {
            service.sendPostRequest(values, 'WebSignup/SignIn')
                .then((response) => { signInSuccess(response) })
                .catch((error) => { signInSuccessErrorHandling(error.response) });
        }


    }
    const signInSuccess = (result) => {
        if (result != null) {
            localStorage.setItem('currentUser', JSON.stringify(result.data));
            history.push('/home');
        }
    }
    const signInSuccessErrorHandling = (error) => {
        if (error) {
            error.error = error.data[0].Msg;
            setErrors(error)
        }
    }
    const signInAsDifferent = () => {
        history.push('/');
    }
    const validate = (fieldValues = values) => {
        let temp = {}
        if ('MobileNo' in fieldValues)
            temp.MobileNo = fieldValues.MobileNo ? "" : "Mobile is required."
        if ('DOB' in fieldValues)
            temp.DOB = fieldValues.DOB ? "" : "Dob is required."
        if ('Password' in fieldValues)
            temp.Password = fieldValues.Password ? "" : "Password  is required."

        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
    } = useForm(initialFieldValues, validate)

    const showValidateMsg = (field) => {
        if (errors[field]) {
            return <small className="form-text text-muted">{errors[field]}</small>
        }
    }
    const forgotPassword = () => {
        history.push('/reset-password');
    }

    return (
        <>
            <div className="col-md-6">
                <h3>Sign In</h3>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Mobile No</label>
                        <input type="text"
                            name="MobileNo"
                            value={values.MobileNo}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                        {showValidateMsg('MobileNo')}
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">DateOfBirth</label>
                        <input type="date"
                            name="DOB"
                            onChange={handleInputChange}
                            value={values.DOB}
                            className="form-control"
                        />
                        {showValidateMsg('DOB')}

                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password"
                            name="Password"
                            value={values.Password}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                        {showValidateMsg('Password')}
                    </div>
                    <button type="submit" className="btn btn-primary ml-3">SignIn</button>
                    <button type="button" className="btn btn-primary ml-3" onClick={forgotPassword}>Forget Password</button>
                    <button type="button" className="btn btn-primary ml-3" onClick={signInAsDifferent}>Sign in as Different user</button>
                </form>
                {errors.error && <span >{errors.error}</span>}


            </div>
        </>
    )

}
