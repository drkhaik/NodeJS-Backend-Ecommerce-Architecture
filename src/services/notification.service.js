'use strict'

const { NOTI } = require('../models/notification.model');
const { SHOP_001, PROMOTION_001, ALL } = require('../constants/notification');
const { create } = require('lodash');

const pushNotiToSystem = async({
    type = SHOP_001,
    receivedId = 1,
    senderId = 1,
    options = {},
}) => {
    let noti_content

    if(type === SHOP_001){
        noti_content = `New product by User ${senderId} following`
    }else if(type = PROMOTION_001){
        noti_content = `New promotion by User ${senderId}`
    }

    const newNoti = await NOTI.create({
        noti_type: type,
        noti_content,
        noti_senderId: senderId,
        noti_receiverId: receivedId,
        noti_options: options
    });

    return newNoti;
}

const listNotiByUser = async({
    user = 1,
    type = ALL,
    isRead = 0
}) => {
    const match = {noti_receiverId: user};
    if(type !== ALL) match.noti_type = type;

    return await NOTI.aggregate([
        { $match: match},
        { $project: {
            noti_type: 1,
            noti_senderId: 1,
            noti_receiverId: 1,
            // noti_content: {
            //     $concat: [
            //         {
            //             $substr: ['$noti_options.shop_owner', 0, -1]
            //         },
            //         " vừa mới thêm một sản phẩm mới: ",
            //         {
            //             $substr: ['$noti_options.product_name', 0, -1]
            //         }
            //     ]
            // },
            noti_content: 1,
            noti_options: 1,
            createdAt: 1,
        }}
    ])
}

module.exports = {
    pushNotiToSystem,
    listNotiByUser
}