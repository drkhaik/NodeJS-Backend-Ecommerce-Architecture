'use strict'

const {SuccessResponse} = require('../core/success.response');
const { addComment, getCommentsByParent, deleteComment } = require('../services/comment.service');

class CommentController {
    addComment = async (req, res) => {
        new SuccessResponse({
            message: 'add new comment',
            metadata: await addComment(req.body)
        }).send(res);
    }

    getComments = async (req, res) => {
        new SuccessResponse({
            message: 'get comment',
            metadata: await getCommentsByParent(req.query)
        }).send(res);
    }

    deleteComment = async (req, res) => {
        new SuccessResponse({
            message: 'delete comment',
            metadata: await deleteComment(req.body)
        }).send(res);
    }
}

module.exports = new CommentController();