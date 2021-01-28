import React, { useState, useEffect } from "react";
import { service } from '../helpers/Service';
import useForm from "../useForm";
import { useHistory } from 'react-router-dom';
const initialFieldValues = {
    Password: '',
    ConfirmPassword: '',
}

export default function PasswordEnteringScreen() {
    let history = useHistory();

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            values.MobileNo=localStorage.getItem("mobile_no");
            service.sendPostRequest(values, 'WebSignup/SetPasswordForWebSignIn')
                .then((response) => { setPasswordSuccess(response) })
                .catch((error) => { setPasswordErrorHandling(error.response) });
        }
    }
    const setPasswordSuccess = (result) => {
        if(result){
            localStorage.setItem('currentUser', JSON.stringify(result.data));
            history.push('/home');
        }
    }
    const setPasswordErrorHandling = (error) => {
        if (error) {
            error.error = error.data.message;
            setErrors({ ...error })
        }
    }


    const validate = (fieldValues = values) => {
        let temp = {}
        if ('Password' in fieldValues) {
            temp.Password = fieldValues.Password ? "" : "Password is required."
        }
        if ('ConfirmPassword' in fieldValues) {
            temp.ConfirmPassword = fieldValues.ConfirmPassword ? "" : "Confirm Password is required."
        }
        if (fieldValues.ConfirmPassword && fieldValues.Password) {
            temp.ComparePasswordValidator = fieldValues.Password == fieldValues.ConfirmPassword ? '' : "Password does not not match with the above one";
        }
        if (fieldValues.Password && !(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,15}$/.test(fieldValues.Password))) {
            temp.Password = "Min 6 characters including at least on capital letter,number and  special character ,max length 15.";
        }
        if (fieldValues.ConfirmPassword && !(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,15}$/.test(fieldValues.ConfirmPassword))) {
            temp.ConfirmPassword = "Min 6 characters including at least on capital letter,number and  special character ,max length 15.";
        }

        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }
    const showValidateMsg = (field) => {
        if (errors[field]) {
            return <small className="form-text text-muted">{errors[field]}</small>
        }
    }
    const {
        values,
        errors,
        setErrors,
        setValues,
        handleInputChange,
    } = useForm(initialFieldValues, validate);

    return (
        <div>
            <div className="col-md-6">
                <h3>Password Entering Screen</h3>

                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Password</label>
                        <input type="password"
                            name="Password"
                            value={values.Password}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                        {showValidateMsg('Password')}
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Confirm Password</label>
                        <input type="password"
                            name="ConfirmPassword"
                            value={values.ConfirmPassword}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                        {showValidateMsg('ConfirmPassword')}
                        {showValidateMsg('ComparePasswordValidator')}
                    </div>
                    <button type="submit" className="btn btn-primary ml-4" >Continue</button>
                </form>
                {errors.error && <span >{errors.error}</span>}
            </div>
        </div>

    )
}
