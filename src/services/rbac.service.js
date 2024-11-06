'use strict'

const Resource = require('../models/resource.model');
const Role = require('../models/role.model');

/**
 * new resouce
 * @param {string} name 
 * @param {string} slug
 * @param {string} description 
 */
const createResource = async ({
    name = 'profile',
    slug = 'p00001',
    description = ''
}) => {
    try{
        // 1. Check name or slug exist

        // 2. Create new resource
        const resource = await Resource.create({
            src_name: name,
            src_slug: slug,
            src_description: description
        });

        return resource;
    }catch(error){
        next(error)
    }
}


const resourceList = async ({
    userId = 0, // admin
    limit = 30,
    offset = 0,
    search = ''
}) => {
    try {
        // 1. Check user_id is admin // middleware function

        // 2. Get list resource
        const resources = await Resource.aggregate([
            {
                $project: {
                    _id: 0,
                    name: '$src_name',
                    slug: '$src_lug',
                    description: '$src_description',
                    resource_id: '$_id',
                    createdAt: 1
                }
            }
        ])

        return resources;
    } catch (error) {
        return [];
    }
}


const createRole = async ({
    name = 'shop',
    slug = 's00001',
    description = 'extend from shop or user',
    grants = []
}) => {
    try {
        // 1. check role exist

        // 2. Create new role
        const role = await Role.create({
            role_name: name,
            role_slug: slug,
            role_description: description,
            role_grants: grants
        });

        return role;
    } catch (error) {
        return error;
    }
}

const roleList = async ({
    userId = 0, // admin
    limit = 30,
    offset = 0,
    search = ''
}) => {
    try {
        // 1. Check user_id is admin // middleware function

        // 2. Get list role

        /*
        // const roleTest = await Role.find({});
        {
            "_id": "1",
            "name": "Admin",
            "role_grants": [
                { "resource": "Resource1", "action": "read" },
                { "resource": "Resource2", "action": "write" }
            ]
        }

        =======>>>
        const roles = await Role.aggregate([
            {
                $unwind: '$role_grants'
            }
        ]); 

        =======>>>
        [
            {
                "_id": "1",
                "name": "Admin",
                "role_grants": { "resource": "Resource1", "action": "read" }
            },
            {
                "_id": "1",
                "name": "Admin",
                "role_grants": { "resource": "Resource2", "action": "write" }
            }
        ]

        */

        const roles = await Role.aggregate([
            {
                $unwind: '$role_grants'
            },
            {
                $lookup: {
                    from: 'Resources',
                    localField: 'role_grants.resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            },
            {
                $unwind: '$resource'
            },
            {
                $project: {
                    _id: 0,
                    role: '$role_name',
                    resource: '$resource.src_name',
                    action: '$role_grants.actions',
                    attributes: '$role_grants.attributes',
                }
            },
            {
                $unwind: '$action'
            },
            // {
            //     $project: {
            //         role: 1,
            //         resource: 1,
            //         action: '$action',
            //         attributes: 1
            //     }
            // }
        ]);

        console.log("check roles" + roles);

        return roles;
    } catch (error) {
        return error;
    }
}

module.exports = {
    createResource,
    resourceList,
    createRole,
    roleList
}