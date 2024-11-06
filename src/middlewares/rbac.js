'use strict'

const rbac = require('./role.middleware');
const { AuthFailureError } = require('../core/error.response');
const { roleList } = require('../services/rbac.service');
/**
 * 
 * @param {_id} resource profile | inventory | product
 * @param {string} action read | write | delete | update
 */

const grantAccess = (action, resource) => {

    return async (req, res, next) => {
        try{
            rbac.setGrants( await roleList({
                userId: 999
            }));
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