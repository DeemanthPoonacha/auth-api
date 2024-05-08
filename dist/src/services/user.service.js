"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.findAndUpdateUserById = exports.findUserByEmail = exports.findUserById = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
function createUser(user) {
    return user_model_1.default.create(user);
}
exports.createUser = createUser;
function findUserById(id) {
    return user_model_1.default.findById(id);
}
exports.findUserById = findUserById;
function findUserByEmail(email) {
    return user_model_1.default.findOne({ email });
}
exports.findUserByEmail = findUserByEmail;
function findAndUpdateUserById(_id, update) {
    return user_model_1.default.findOneAndUpdate({ _id }, update);
}
exports.findAndUpdateUserById = findAndUpdateUserById;
function deleteUserById(_id) {
    return user_model_1.default.deleteOne({ _id });
}
exports.deleteUserById = deleteUserById;
