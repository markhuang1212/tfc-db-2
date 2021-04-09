import { ClientSession, Collection, MongoClient, ObjectID } from "mongodb";


abstract class DBAbstract<T> {

    client: MongoClient
    dbName: string
    collectionName: string

    /**
     * The shared instance with default configuration.
     */
    static shared: DBAbstract<any>

    constructor(client: MongoClient, dbName: string, collectionName: string) {
        this.client = client
        this.dbName = dbName
        this.collectionName = collectionName
    }

    /**
     * Set up the mongodb collection. Create Indexes, etc.
     */
    abstract setup(): Promise<void>

    get collection(): Collection<T> {
        if (this.client.isConnected()) {
            return this.client.db(this.dbName).collection(this.collectionName)
        } else {
            throw Error('Trying to access collection when MongoClient is NOT connected.')
        }
    }

}

export default DBAbstract