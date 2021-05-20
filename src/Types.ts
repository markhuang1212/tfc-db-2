/**
 * @fileoverview
 * 
 * This file contains type decorations
 * 
 */

import { ObjectId } from "bson"

export type TfcAddress = string

export type Afid = string

interface DBDocAbstract {
    _id?: ObjectId
}

/**
 * Seed Information
 * 
 */
export interface DBSeedDoc extends DBDocAbstract {
    owner: TfcAddress // the person that uploaded the seed
    afid: Afid // the afid of the seed

    used: boolean

    verification?: string

    num_likes: number
    num_dislikes: number
    evaluation: {
        likes: TfcAddress[]
        dislikes: TfcAddress[]
    }
}

export const DBSeedDocDefault = {
    num_likes: 0,
    num_dislikes: 0,
    used: false,
    evaluation: {
        likes: [],
        dislikes: []
    }
}