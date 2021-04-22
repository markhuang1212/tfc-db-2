import { Router } from "express";

const secCheckRouter = Router()

secCheckRouter.get('/check/:sectorAfid', async (req, res) => {
    res.json({
        result: true
    })
})

export default secCheckRouter