import Express from 'express'
import Config from './Config'
import PinoHttp from 'pino-http'

const app = Express()

/**
 * Automatic Logging of requests
 */
app.use(PinoHttp())

app.listen(Config.shared.port, () => {

})