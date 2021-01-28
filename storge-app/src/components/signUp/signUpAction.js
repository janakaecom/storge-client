import {SIGN_UP} from './signUpType';

export const signupUser=(data)=>{
    return {
        type:SIGN_UP,
        payload:data
    }
}