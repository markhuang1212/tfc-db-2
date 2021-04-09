import { MongoClient } from "mongodb";
import Config from "../Config";
import { DBAccountDoc } from "../Types";
import DBAbstract from "./DBAbstract";
import mongoClientShared from "./MongoClientShared";

class DBAccount extends DBAbstract<DBAccountDoc> {

    static shared = new DBAccount(mongoClientShared, Config.shared.db_name)

    constructor(client: MongoClient, dbName: string) {
        super(client, dbName, 'accounts')
    }

    setup(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}