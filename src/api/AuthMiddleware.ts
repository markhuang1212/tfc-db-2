/**
 * To be implemented in the future.
 */

import { Router } from 'express'

declare module 'http' {
    interface IncomingMessage {
        authAddress: string
    }
}

/**
 * This middleware handles authentications
 */
const authMiddleware = Router()

authMiddleware.use((req, res, next) => {
    req.authAddress = 'placeholder'
    next()
})

export default authMiddleware