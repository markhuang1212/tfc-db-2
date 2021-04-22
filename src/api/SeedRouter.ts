import express, { Router } from 'express'
import DBSeed from '../db/DBSeed'
import { Afid, DBSeedDocDefault, TfcAddress } from '../Types'

const seedRouter = Router()
seedRouter.use(express.json())

interface SeedUploadReq {
    owner: TfcAddress
    afid: Afid
}

seedRouter.post('/upload', async (req, res) => {
    const body = req.body as SeedUploadReq

    if (typeof (body.afid) !== 'string' || typeof (body.owner) !== 'string') {
        req.log.info('Input error')
        res.status(400).end()
    }

    await DBSeed.shared.insertOne({
        ...DBSeedDocDefault,
        owner: body.owner,
        afid: body.afid
    })
    res.status(200).end()

})

interface SeedLikeReq {
    afid: Afid
    liked_by: TfcAddress
}
seedRouter.post('/like', async (req, res) => {
    const body = req.body as SeedLikeReq

    await DBSeed.shared.like(body.afid, body.liked_by)
    res.status(200).end()
})

interface SeedDislikeReq {
    afid: Afid
    disliked_by: TfcAddress
}

seedRouter.post('/like', async (req, res) => {
    const body = req.body as SeedDislikeReq

    await DBSeed.shared.dislike(body.afid, body.disliked_by)
    res.status(200).end()
})

export default seedRouter