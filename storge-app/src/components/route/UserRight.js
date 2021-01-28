import { service } from "../helpers/Service";

export const isAllowed = (right) => {
    var permisson=[1,2,3]
    return permisson.map(x => x).some(v => v == right);
    // return service.currentUser.permissions.map(x => x).some(v => v == right);
   
}

export const hasRole = (user, roles) =>
    roles.some(role => user.roles.includes(role));