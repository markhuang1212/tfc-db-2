import { setTimeout } from 'timers/promises'

/**
 * An Interface for implementing periodic tasks.
 *
 */
abstract class PTask {
    abstract task(): Promise<any>

    period: number

    async runTask() {
        while (true) {
            await setTimeout(this.period)
            this.task().catch(err => {
                console.log('Error when executing task')
                console.log(err.stack ?? err)
            })
        }
    }

    constructor(period: number) {
        this.period = period
    }

}

export default PTask