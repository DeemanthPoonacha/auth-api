import UserModel, { User } from "../models/user.model";

export function createUser(user: Partial<User>) {
    return UserModel.create(user);
}

export function findUserById(id: string) {
    return UserModel.findById(id);
}
