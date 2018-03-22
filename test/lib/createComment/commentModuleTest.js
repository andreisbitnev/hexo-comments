const assert = require("assert");
const sinin = require("sinon");
const commentModule = require("../../../lib/createComment/commentModule");
const Joi = require("joi");

describe("commentsModule", () => {
    let mock = {};
    beforeEach(() => {
        mock.commentsJson = JSON.stringify({timestamp: 123456, name: "test_post", comments: []});
        mock.template = {
            name: Joi.string().default("defaultName"),
            avatar: Joi.string().default("defaultAvatar"),
            text: Joi.string().required(),
            timestamp: Joi.number().forbidden().default(123456),
            comments: Joi.array().forbidden().default([])
        }
    });

    it("should return a new comment", done => {
        const commentBodyStub = {"text": "Lorem Ipsum"};
        const expectedResult = {
            name: "test_post",
            timestamp: 123456,
            comments: [
                {
                "text":"Lorem Ipsum",
                "name":"defaultName",
                "avatar":"defaultAvatar",
                "timestamp":123456,
                "comments":[]
                }
            ]
        };
        commentModule.createComment(mock.commentsJson, commentBodyStub, mock.template).then(result => {
            assert.deepEqual(JSON.parse(result), expectedResult);
            done();
        }).catch(err => {
            done(err);
        });
    });
    it("should reject if timestamp is supplied", done => {
        const commentBodyStub = {"text": "Lorem Ipsum", "timestamp": 9876};
        commentModule.createComment(mock.commentsJson, commentBodyStub, mock.template)
        .catch(err => {
            done();
        });
    });
    it("should reject if comments are supplied", done => {
        const commentBodyStub = {"text": "Lorem Ipsum", "comments": [{"test":"test"}]};
        commentModule.createComment(mock.commentsJson, commentBodyStub, mock.template)
        .catch(err => {
            done();
        });
    });
    it("should reject if text is not supplied", done => {
        const commentBodyStub = {};
        commentModule.createComment(mock.commentsJson, commentBodyStub, mock.template)
        .catch(err => {
            done();
        });
    });
})