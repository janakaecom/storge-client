import React, { useState, useEffect } from "react";
import useForm from "../useForm";
import { service } from "../helpers/Service";
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { loadReCaptcha } from 'react-recaptcha-google'
import * as action from "../signUp/signUpAction";
import Recaptcha from 'react-recaptcha'
import Captcha from "./Captcha";

const initialFieldValues = {
    MobileNo: '0715701413',
    DOB: '1994-06-30',
    PIN: 'a',
    verified: false

}
function SignUp(props) {

    let history = useHistory();
    const [error, setError] = useState('')

    const handleSubmit = e => {
        e.preventDefault();
        doHandleSubmit();
    }
    const doHandleSubmit = () => {
        props.signupUser(initialFieldValues);
        localStorage.setItem("mobile_no", values.MobileNo)
        values.action = props.action;
        if (validate()) {
            service.sendGetRequest(values, 'WebSignup/SignUp')
                .then(
                    response => signUpSuccess(response),
                    error => {
                    }
                );
        }
    }
    const signUpSuccess = (result) => {

        if (result.data[0].Code == -1) {
            setError(result.data[0].Msg);
        }
        else {
            history.push('/otp-verification');
        }
    }

    const validate = (fieldValues = values) => {
        let temp = {}
        if ('MobileNo' in fieldValues)
            temp.MobileNo = fieldValues.MobileNo ? "" : "Mobile is required."
        if ('DOB' in fieldValues)
            temp.DOB = fieldValues.DOB ? "" : "Dob is required."
        if ('PIN' in fieldValues)
            temp.PIN = fieldValues.PIN ? "" : "Pin Code is required."
        if (!fieldValues.verified) {
            temp.verified = fieldValues.verified ? "" : "Please verified that your are human."
        }
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
    const DoVerifiedCaptcha = (isVerified) => {
        values.verified = isVerified;
        doHandleSubmit();
    }

    return (
        <>
            <div className="col-md-6">
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
                        <label htmlFor="exampleInputPassword1">Pin code</label>
                        <input type="password"
                            name="PIN"
                            value={values.PIN}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                        {showValidateMsg('PIN')}
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <br />
                    <br />
                    <Captcha verifiedCaptcha={DoVerifiedCaptcha} />

                </form>
                {error && <span >{error}</span>}

            </div>
        </>
    )


}


const mapStateToProps = state => ({
    mobileNo: state.signup.MobileNo
})

const mapActionToProps = dispatch => {
    return {
        signupUser: (initialFieldValues) => dispatch(action.signupUser(initialFieldValues))
    }

}

export default connect(mapStateToProps, mapActionToProps)(SignUp);