import Express from 'express'
import Config from './Config'
import PinoHttp from 'pino-http'
import Pino from 'pino'
import authMiddleware from './api/AuthMiddleware'
import seedRouter from './api/SeedRouter'
import PSubmitSeedToChain from './tasks/PSubmitSeedToChain'
import mongoClientShared from './db/MongoClientShared'
import IDistributeAward from './tasks/IDistributeAward'

const app = Express()

mongoClientShared.connect().then(() => {
    Pino().info('Mongo Client connected')
})

/**
 * Automatic Logging of requests
 */
app.use(PinoHttp())

/**
 * Authentication of users
 */
app.use(authMiddleware)

/**
 * Handle APIs related to Seed
 */
app.use('/seed', seedRouter)

app.listen(Config.shared.port, () => {
    Pino().info(`Server starts listening at port ${Config.shared.port}`)
})

/**
 * Submit seed to Tfc-Chain peridocally
 */
PSubmitSeedToChain.shared.runTask()

/**
 * Distribute award to the persion that submitted the seed
 */
IDistributeAward.shared.initialize()