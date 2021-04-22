import { MongoClient } from "mongodb";
import Config from "../Config";
import { Afid, DBSeedDoc, TfcAddress } from "../Types";
import DBAbstract from "./DBAbstract";
import MongoClientShared from "./MongoClientShared";

class DBSeed extends DBAbstract<DBSeedDoc> {

    static shared = new DBSeed(MongoClientShared, Config.shared.db_name)

    constructor(client: MongoClient, dbName: string) {
        super(client, dbName, 'seed')
    }

    async setup() {
        this.collection.createIndex({ afid: 1 })
    }

    insertOne = this.collection.insertOne

    async like(afid: Afid, liked_by: TfcAddress) {
        const ret = await this.collection.updateOne({ afid }, {
            $inc: {
                'num_likes': 1
            },
            $push: {
                'evaluation.likes': liked_by
            }
        })
        if (ret.modifiedCount == 0) {
            throw Error(`No Seed with Afid ${afid}`)
        }
        return ret
    }

    async dislike(afid: Afid, disliked_by: TfcAddress) {
        const ret = await this.collection.updateOne({ afid }, {
            $inc: {
                'num_dislikes': 1
            },
            $push: {
                'evaluation.dislikes': disliked_by
            }
        })
        if (ret.modifiedCount == 0) {
            throw Error(`No Seed with Afid ${afid}`)
        }
        return ret
    }

}

export default DBSeed