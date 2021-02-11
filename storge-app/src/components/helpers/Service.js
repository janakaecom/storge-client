import axios from "axios";
import { authHeader } from "./Auth-Header";
// const baseUrl = "https://localhost:44369/api/"
const baseUrl = "https://api.estorge.com/api/"


export const service = {
    sendPostRequest,
    sendGetRequest,
    logout,
    get currentUser() { return JSON.parse(localStorage.getItem('currentUser')); }
};



function sendPostRequest(obj, myUrl) {
    return axios.post(baseUrl + myUrl,JSON.stringify(obj),{headers:authHeader()})
}

function sendGetRequest(obj, myUrl) {
    return axios.get(baseUrl + myUrl,{headers:authHeader(), params:obj})
}

function logout() {
    localStorage.removeItem('currentUser');
}
// changee



