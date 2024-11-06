'use strict'

const { SuccessResponse } = require("../core/success.response");
const { 
    createRole, 
    createResource, 
    roleList, 
    resourceList
} = require("../services/rbac.service");

/**
 * @description Create new Role
 * @param {String} req 
 * @param {String} res 
 * @returns {JSON} 
 */

const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create new Role Success',
        metadata: await createRole(req.body),
    }).send(res);
}

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create new Resource Success',
        metadata: await createResource(req.body),
    }).send(res);
}

const getRoleList = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get Role Success',
        metadata: await roleList(req.query),
    }).send(res);
}

const getResourceList = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get Resource Success',
        metadata: await resourceList(req.query),
    }).send(res);
}

module.exports = {
    newRole,
    newResource,
    getRoleList,
    getResourceList
}