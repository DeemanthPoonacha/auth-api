import { FlattenMaps, Types } from "mongoose";
import { User, privateUserFields } from "../models/user.model";

export type CurrentUser = Partial<
    Omit<
        FlattenMaps<
            User & {
                _id: Types.ObjectId;
            }
        >,
        (typeof privateUserFields)[number]
    >
>;
