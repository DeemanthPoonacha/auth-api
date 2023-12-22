import mongoose from "mongoose";
import config from "config";
import log from "./logger";

export default async function connectToDb() {
    const dbUri = config.get<string>("dbUri");

    try {
        await mongoose.connect(dbUri, { dbName: "authentication_db" });
        log.info("Connected to database");
    } catch (error) {
        log.error("An error occurred while connecting to database");
        process.exit(1);
    }
}
