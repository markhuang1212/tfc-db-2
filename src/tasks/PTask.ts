import { setTimeout as __setTimeout } from 'timers'
import { promisify } from 'util'

const setTimeout = (ms: number) => {
    return new Promise((res) => __setTimeout(res, ms))
}

/**
 * An Interface for implementing periodic tasks.
 *
 */
abstract class PTask {
    abstract task(): any

    period: number

    async runTask() {
        while (true) {
            await setTimeout(this.period)
            this.task()
        }
    }

    constructor(period: number) {
        this.period = period
    }
    
}

export default PTask