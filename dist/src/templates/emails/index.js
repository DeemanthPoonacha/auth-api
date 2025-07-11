"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alreadyVerifiedTemplate = exports.verificationSuccessTemplate = exports.passwordResetEmailTemplate = exports.verificationEmailTemplate = void 0;
var verification_1 = require("./verification");
Object.defineProperty(exports, "verificationEmailTemplate", { enumerable: true, get: function () { return verification_1.verificationEmailTemplate; } });
var passwordReset_1 = require("./passwordReset");
Object.defineProperty(exports, "passwordResetEmailTemplate", { enumerable: true, get: function () { return passwordReset_1.passwordResetEmailTemplate; } });
var verificationSuccess_1 = require("./verificationSuccess");
Object.defineProperty(exports, "verificationSuccessTemplate", { enumerable: true, get: function () { return verificationSuccess_1.verificationSuccessTemplate; } });
var alreadyVerified_1 = require("./alreadyVerified");
Object.defineProperty(exports, "alreadyVerifiedTemplate", { enumerable: true, get: function () { return alreadyVerified_1.alreadyVerifiedTemplate; } });
