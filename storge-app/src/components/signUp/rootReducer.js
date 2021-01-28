import { combineReducers} from  'redux'
import signupReducer from './signUpReducer'

const rootReducer=combineReducers({
    signup:signupReducer
})

export default rootReducer