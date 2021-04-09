import { MongoClient } from 'mongodb'
import Config from '../Config'

/**
 * This MongoClient instance is used cross the whole app for
 * communicating with MongoDB. It must be connected before
 * the server can start working.
 * 
 * You should run mongoClientShared.connect() before any operation.
 * 
 */
const mongoClientShared = new MongoClient(
    Config.shared.mongodb_uri,
    { useUnifiedTopology: true, ignoreUndefined: true }
)

export default mongoClientShared