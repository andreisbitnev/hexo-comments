"use strict";
const Joi = require("joi");
const config = require("../config")

module.exports = {
    name: Joi.string().forbidden().default(config.commentDefault.name),
    text: Joi.string().required(),
    timestamp: Joi.number().forbidden(),
    comments: Joi.array().forbidden().default([]),
    position: Joi.array().items(Joi.number()).required()
};