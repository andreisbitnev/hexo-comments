const Joi = require("joi");

function createComment(commentsJson, commentBody, schema, user) {
    return new Promise((resolve, reject) => {
        const commentsObj = JSON.parse(commentsJson);
        let validComment = validate(commentBody, schema);
        validComment = addUserName(validComment, user);
        validComment = addTimestamp(validComment);
        const updatedComments = insertComment(commentsObj, validComment);
        resolve(JSON.stringify(updatedComments));
    })
}
function validate(commentBody, schema) {
    return Joi.attempt(commentBody, schema);
}
function insertComment(object, newComment) {
    let containersArr = [object];
    let parent;
    for (let i = 0; i < newComment.position.length; i++) {
        const id = newComment.position[i];
        parent = containersArr.find((comment) => {
            return comment.timestamp === id
        });
        containersArr = parent.comments;
    }
    parent.comments.push(newComment);
    return object;
}
function addUserName(commentObj, user) {
    if(user && user.display_name) {
        commentObj.name = user.display_name;
    }
    return commentObj
}
function addTimestamp(commentObj) {
    commentObj.timestamp = new Date().getTime();
    return commentObj;
}
module.exports = {
    createComment
};
