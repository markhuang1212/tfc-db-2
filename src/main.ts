import Express from 'express'
import Config from './Config'
import PinoHttp from 'pino-http'
import Pino from 'pino'
import authMiddleware from './api/AuthMiddleware'
import seedRouter from './api/SeedRouter'
import PSubmitSeedToChain from './tasks/PSubmitSeedToChain'

const app = Express()

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