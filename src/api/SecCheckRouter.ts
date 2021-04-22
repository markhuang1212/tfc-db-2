import { Router } from "express";
import CVerifySector from "../cli/CVerifySector";

const secCheckRouter = Router()

secCheckRouter.get('/check/:sectorAfid', async (req, res) => {

    const ret = await CVerifySector.shared.verifySector(
        req.params.sectorAfid as string,
        req.query.seed_hash as string)

    res.json({
        result: ret
    })

})

export default secCheckRouter