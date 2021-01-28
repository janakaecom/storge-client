import {SIGN_UP} from './signUpType';
const initialValues={
    MobileNo:'0715701413',
}

const signUpReducer=(state=initialValues,action)=>{
    switch(action.type){
        case SIGN_UP:return{
            ...state,
            MobileNo:action.payload
        }
        default:return state;
    }

}
export default signUpReducer