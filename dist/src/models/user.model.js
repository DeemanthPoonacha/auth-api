"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.privateUserFields = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const argon2_1 = __importDefault(require("argon2"));
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("../utils/logger"));
exports.privateUserFields = [
    "password",
    "__v",
    "verificationCode",
    "passwordResetCode",
    "verified",
];
let User = class User {
    validatePassword(candidatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield argon2_1.default.verify(this.password, candidatePassword);
            }
            catch (error) {
                logger_1.default.error(`Error occured while validating password: ${error}`);
            }
        });
    }
};
exports.User = User;
__decorate([
    (0, typegoose_1.prop)({ lowercase: true, required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, default: () => (0, uuid_1.v4)() }),
    __metadata("design:type", String)
], User.prototype, "verificationCode", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Object)
], User.prototype, "passwordResetCode", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "verified", void 0);
exports.User = User = __decorate([
    (0, typegoose_1.index)({ email: 1 }),
    (0, typegoose_1.pre)("save", function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isModified("password")) {
                return;
            }
            const hash = yield argon2_1.default.hash(this.password);
            this.password = hash;
            return;
        });
    }),
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
        },
        options: {
            allowMixed: typegoose_1.Severity.ALLOW,
        },
    })
], User);
const UserModel = (0, typegoose_1.getModelForClass)(User);
exports.default = UserModel;
