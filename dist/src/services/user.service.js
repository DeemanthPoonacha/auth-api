"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserById = findUserById;
exports.findUserByEmail = findUserByEmail;
exports.findAndUpdateUserById = findAndUpdateUserById;
exports.deleteUserById = deleteUserById;
const user_model_1 = __importDefault(require("../models/user.model"));
function createUser(user) {
    return user_model_1.default.create(user);
}
function findUserById(id) {
    return user_model_1.default.findById(id);
}
function findUserByEmail(email) {
    return user_model_1.default.findOne({ email });
}
function findAndUpdateUserById(_id, update) {
    return user_model_1.default.findOneAndUpdate({ _id }, update);
}
function deleteUserById(_id) {
    return user_model_1.default.deleteOne({ _id });
}
