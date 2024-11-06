'use strict'

const rbac = require('./role.middleware');
const { AuthFailureError } = require('../core/error.response');
/**
 * 
 * @param {_id} resource profile | inventory | product
 * @param {string} action read | write | delete | update
 */

const grantAccess = (action, resource) => {

    return async (req, res, next) => {
        try{
            const role_name = req.query.role;
            const permission = rbac.can(role_name)[action](resource);
            if(!permission.granted){
                throw new AuthFailureError('you dont have permission...');
            }

            next();
        }catch(error){
            next(error)
        }
    }
}

module.exports = {
    grantAccess
}