'use strict'

const Comment = require('../models/comment.model');
const { convertToObjectId } = require('../utils');
const { NotFoundError } = require("../core/error.response");
const { findProduct } = require('./product.service.xxx');

/**
 * 
    key features: Comment Service
    + add comment [user | shop]
    + get list of comments [user | shop]
    + delete a comment [user | shop | admin]

 */

class CommentService {
    static async addComment({product_id, userId, content, parent_id}) {
        const comment = new Comment({
            comment_product_id: product_id,
            comment_userId: userId,
            comment_content: content,
            comment_parent_id: parent_id
        });

        let rightValue
        if(parent_id){
            // reply comment
            const parentComment = await Comment.findById(parent_id);
            if (!parentComment) throw new NotFoundError('Parent comment does not exist');
            
            rightValue = parentComment.comment_right; //2

            await Comment.updateMany({
                comment_product_id: convertToObjectId(product_id),
                comment_right: {$gte: rightValue},
            },{
                $inc: {comment_right: 2}
            })

            await Comment.updateMany({
                comment_product_id: convertToObjectId(product_id),
                comment_left: {$gt: rightValue},
            },{
                $inc: {comment_left: 2}
            })
        }else{
            // find root comment of product by product_id
            const maxRightValue = await Comment.findOne({
                comment_product_id: convertToObjectId(product_id),
            }, 'comment_right', {sort: {comment_right: -1}});
            if (maxRightValue){
                rightValue = maxRightValue.comment_right + 1; // if this product has few comments, 
                // then increment by 1,vd: 1 14 (comment 1) => 15 16 (comment 2)
            }else{
                // if is dont have, it will be the first comment
                rightValue = 1;
            }
        }

        // insert the comment
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        await comment.save();
        return comment;
    }

    static async getCommentsByParent({
        product_id, 
        parent_id = null, 
        limit = 50, 
        offset = 0  //skip
    }) {
        if(parent_id){
            const parentComment = await Comment.findById(parent_id);
            if (!parentComment) throw new NotFoundError('Parent comment does not exist');

            const comments = await Comment.find({
                comment_product_id: convertToObjectId(product_id),
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lt: parentComment.comment_right },
            })
            .select({
                isDeleted: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0
            })
            .sort({comment_left: 1})
            .limit(limit)
            .skip(offset);

            return comments;
        }

        const comments = await Comment.find({
            comment_product_id: convertToObjectId(product_id),
            comment_parent_id: parent_id,
        })
        .select({
            isDeleted: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        })
        .sort({ comment_left: 1 })
        .limit(limit)
        .skip(offset);

        return comments;
    }

    static async deleteComment({ product_id, comment_id}) {
        const foundProduct = await findProduct({ product_id });
        if (!foundProduct) throw new NotFoundError('Product does not exist');

        const foundComment = await Comment.findOne({
            _id: convertToObjectId(comment_id),
            comment_product_id: convertToObjectId(product_id),
        });
        if (!foundComment) throw new NotFoundError('Comment does not exist');

        const leftValue = foundComment.comment_left;
        const rightValue = foundComment.comment_right;
        const width = rightValue - leftValue + 1;

        await Comment.deleteMany({
            comment_product_id: convertToObjectId(product_id),
            comment_left: {$gte: leftValue, $lte: rightValue},
        })

        // update right value of all of comments
        await Comment.updateMany({
            comment_product_id: convertToObjectId(product_id),
            comment_right: {$gt: rightValue},
        },{
            $inc: {comment_right: -width}
        })

        // update right value of all of comments
        await Comment.updateMany({
            comment_product_id: convertToObjectId(product_id),
            comment_left: {$gt: rightValue},
        },{
            $inc: {comment_left: -width}
        })

        return true;
    }
}

module.exports = CommentService;