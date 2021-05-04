import { setTimeout } from 'timers/promises'

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
            try {
                this.task()
            } catch (e) {
                console.log('Error when executing task')
                console.log(e.stack ?? e)
            }
        }
    }

    constructor(period: number) {
        this.period = period
    }

}

export default PTask