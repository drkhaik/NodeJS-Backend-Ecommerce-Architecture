const AccessControl = require('accesscontrol');


// let grantList = [
//     { role: 'admin', resource: 'profile', action: 'read:any', attributes: '*, !password' },
//     { role: 'admin', resource: 'profile', action: 'update:any', attributes: '*, !email, !password' },
//     { role: 'admin', resource: 'profile', action: 'delete:any', attributes: '*, !email, !password' },
//     { role: 'admin', resource: 'balance', action: 'read:any', attributes: '*, !amount' },

//     { role: 'shop ', resource: 'profile', action: 'read:own', attributes: '*' },
// ];



module.exports = new AccessControl();