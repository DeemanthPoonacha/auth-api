import UserModel, { User } from "../models/user.model";

export function createUser(user: Partial<User>) {
    return UserModel.create(user);
}

export function findUserById(id: string) {
    return UserModel.findById(id);
}

export function findUserByEmail(email: string) {
    return UserModel.findOne({ email });
}

export function findAndUpdateUserById(_id: string, update: Partial<User>) {
    return UserModel.findOneAndUpdate({ _id }, update);
}

export function deleteUserById(_id: string) {
    return UserModel.deleteOne({ _id });
}
