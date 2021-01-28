import React, { useState, useEffect } from "react";
import { service } from '../helpers/Service';
import useForm from "../useForm";
import { useHistory } from 'react-router-dom';
const initialFieldValues = {
    OTP: '',
}
export default function OTPVerification() {
    let history = useHistory();

    const [isResentOTP, setResentOTP] = useState(false)

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            service.sendGetRequest({ mobileNo: localStorage.getItem("mobile_no"), applicationId: '2', otpNo: values.OTP }, 'WebSignup/SubmitOTPSignUp')
                .then((response) => { submitOTPSuccess(response) })
                .catch((error) => { submitOTPErrorHandling(error.response) });
        }
    }

    const submitOTPSuccess = (result) => {
        if (result) {
            history.push('/password');
        }
    }
    const submitOTPErrorHandling = (error) => {
        if (error) {
            if(error.data.code==-2){
                history.push('/signIn');
            }
            else    
            {
                error.error = error.data.message;
                setErrors({ ...error })
            }
          
        }
    }


    const validate = (fieldValues = values) => {
        let temp = {};
        if ('OTP' in fieldValues) {
            temp.OTP = fieldValues.OTP ? "" : "OTP is required."
            temp.OTP = (fieldValues.OTP && isNaN(fieldValues.OTP))?'Please enter correct format':''
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
        clearData
    } = useForm(initialFieldValues, validate);

    const resendOTP = () => {
        clearData();
        return service.sendGetRequest({ mobileNo: localStorage.getItem("mobile_no"), applicationId: '2' }, 'WebSignup/ReSendOTP')
            .then((response) => { resendOTPSuccess(response) })

            .catch((error) => {
                console.log(error)
            })
    }
    const resendOTPSuccess = (result) => {
        if (result) {
            setResentOTP(false);
        }
    }

    return (
        <div>
            <div className="col-md-6">
                <h3>OTP Verification page</h3>

                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">OTP</label>
                        <input type="text"
                            name="OTP"
                            value={values.OTP}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                        {showValidateMsg('OTP')}
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => setResentOTP(true)}>Resend OTP</button>
                    <button type="submit" className="btn btn-primary ml-4">Continue</button>
                </form>
                {errors.error && <span >{errors.error}</span>}
            </div>


            {isResentOTP && <div>
                Do you have mobile no with you?
                <button type="button" className="btn btn-primary" onClick={resendOTP}>Yes</button>
                <button type="button" className="btn btn-primary ml-4" onClick={() => history.push('/')}>No</button>
            </div>}
        </div>

    )

}

