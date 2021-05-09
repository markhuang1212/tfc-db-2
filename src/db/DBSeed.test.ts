import { MongoClient, MongoError } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { DBSeedDoc, DBSeedDocDefault } from '../Types'
import DBSeed from './DBSeed'

const db = new MongoMemoryServer()
let client: MongoClient
let dbSeed: DBSeed

beforeAll(async () => {
    const url = await db.getUri()
    client = new MongoClient(url, { useUnifiedTopology: true, ignoreUndefined: true })
    await client.connect()
    dbSeed = new DBSeed(client, 'tfc-db')
    dbSeed.setup()
})

test('Insert One', async () => {

    const ret1 = await dbSeed.insertOne({
        afid: 'seed-afid-1',
        owner: 'seed-owner-1',
        ...DBSeedDocDefault
    })

    const ret2 = await dbSeed.insertOne({
        afid: 'seed-afid-2',
        owner: 'seed-owner-2',
        ...DBSeedDocDefault
    })

    // this should fail
    try {
        const ret3 = await dbSeed.insertOne({
            afid: 'seed-afid-2',
            owner: 'seed-owner-3',
            ...DBSeedDocDefault
        })
    } catch (e) {
        expect((e as MongoError).code).toBe(11000)
    }
})

test('Like and Dislike', async () => {
    await Promise.all([
        dbSeed.like('seed-afid-1', 'account-3'),
        dbSeed.like('seed-afid-1', 'account-4'),
        dbSeed.like('seed-afid-1', 'account-5'),
        dbSeed.dislike('seed-afid-1', 'account-6'),
        dbSeed.dislike('seed-afid-1', 'account-7')
    ])

    const doc1 = await dbSeed.collection.findOne({ afid: 'seed-afid-1' }) as DBSeedDoc

    expect(doc1.num_likes).toBe(3)
    expect(doc1.num_dislikes).toBe(2)

    expect(doc1.evaluation.likes).toHaveLength(3)
    expect(doc1.evaluation.dislikes).toHaveLength(2)
})

test('Get Seed for Verification', async () => {
    const doc1 = await dbSeed.getOneSeedForVerificationPurpose()
    expect(doc1?.afid).toBe('seed-afid-1')

    await dbSeed.setSeedAsUsed('seed-afid-1')
    const doc2 = await dbSeed.getOneSeedForVerificationPurpose()
    expect(doc2).toBeUndefined()
})

afterAll(async () => {
    await client.close()
    await db.stop()
})