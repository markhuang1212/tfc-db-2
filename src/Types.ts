/**
 * @fileoverview
 * 
 * This file contains type decorations
 * 
 */

import { Decimal128 } from "mongodb";

export type TfcAddress = string

export type Afid = string

/**
 * Account Information Stored in database
 */
export interface DBAccountDoc {
    address: TfcAddress
    recommender?: TfcAddress
    free_balance: Decimal128
    locked_balance: LockedBalanceRecord[]
    next_unlock_date: Date
}

/**
 * A reserved account is an account that has special functionality
 * 
 */
export interface DBReservedAccount extends DBAccountDoc {
    alias: string
}


export interface LockedBalanceRecord {
    amount: Decimal128
    unlock_at: Date
}

/**
 * Sector Information
 */
export interface DBSectorDoc {
    owner: TfcAddress
    afid: Afid
    last_verify: Date
}

/**
 * Seed Information
 */
export interface DBSeedDoc {
    owner: TfcAddress // the person that uploaded the seed
    evaluation: SeedEvaluationRecord
}

export interface SeedEvaluationRecord {
    likes: TfcAddress[]
    dislikes: TfcAddress[]
}