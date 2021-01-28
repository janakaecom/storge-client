import { service } from './Service';

export function authHeader() {
    const currentUser = service.currentUser;
    if (currentUser && currentUser.Token) {
        return {  Authorization: `Bearer ${currentUser.Token}` }
        // return { 'Content-Type': 'application/json' }
    } else {
        return { 'Content-Type': 'application/json' }
    }
}