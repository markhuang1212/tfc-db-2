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
 * Account Information Stored in database
 * 
 * It IS NOT the full account information that
 * is on TFC-Chain. It is only those accounts that
 * the TFC-db will need
 */
export interface DBAccountDoc extends DBDocAbstract {
    address: TfcAddress
    auth_keys: {
        key: string
        expire_by: Date
    }[]
}

export const DBAccountDocDefault = {
    auth_keys: []
}

/**
 * A reserved account is an account that has special functionality
 * 
 */
export interface DBReservedAccount extends DBAccountDoc {
    alias: string
}

/**
 * Seed Information
 * 
 */
export interface DBSeedDoc extends DBDocAbstract {
    owner: TfcAddress // the person that uploaded the seed
    afid: Afid // the afid of the seed

    used: boolean

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