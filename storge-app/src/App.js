import './App.css';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';
import SignUp from './components/login/SignUp'
import OTPVerification from './components/login/OTPVerification';
import PasswordEnteringScreen from './components/login/PasswordEnteringScreen';
import store from './components/signUp/store';
import { Provider } from 'react-redux';
import SignIn from './components/login/SignIn';
import Home from './components/Home';
import UnAuthorized from './components/UnAuthorized';
import PrivateRoute from './components/route/PrivateRoute';
import ResetPassword from './components/login/ResetPassword';
import ChangePassword from './components/login/ChangePassword';
import Profile from './components/pages/Profile';
import DefaultPage from './components/pages/DefaultPage';
import student from './components/student/Student';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Staff from './components/staff/Staff';

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <PrivateRoute  path="/home" component={Home}></PrivateRoute>
          <Route exact path="/" component={DefaultPage}></Route>
          <Route path="/otp-verification" component={OTPVerification}></Route>
          <Route path="/password" component={PasswordEnteringScreen}></Route>
          <Route path="/reset-password" component={ResetPassword}></Route>
          <Route path="/change-password" component={ChangePassword}></Route>
          <Route path="/signIn" component={SignIn}></Route>
          <Route path="/student" component={student}></Route>
          <Route path="/staff" component={Staff}></Route>
          <Route path="/profile" component={Profile}></Route>
          <Route path="/unAuthorized" component={UnAuthorized}></Route>
        </Switch>
      </BrowserRouter>


    </>

  );
}

export default App;
