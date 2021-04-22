/**
 * @fileoverview
 * 
 * This file contains type decorations
 * 
 */

import { Decimal128, Int32 } from "mongodb";

export type TfcAddress = string

export type Afid = string

/**
 * Account Information Stored in database
 * 
 * It IS NOT the full account information that
 * is on TFC-Chain. It is only those accounts that
 * the TFC-db will need
 */
export interface DBAccountDoc {
    address: TfcAddress
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
 */
export interface DBSeedDoc {
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