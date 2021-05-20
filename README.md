# Tfc-db-2

由于Tfc-Chain性能限制，无法实时收集Seed的提交，点赞，点踩信息。这部分信息由Database收集，并定时将选中的seed提交给Tfc-Chain。

同时，Database负责给Seed提交者，点赞者分账。当前版本只收集点赞点踩信息，不给点赞者分账。

## 配置参数

运行本程序需要在`src/Config.ts`中填入需要的参数。

## API设计

### 由手机端/其他客户端向DB提交Seed，点赞，点踩。提供Restful API

```ts
// POST /seed/upload
{
    afid: string, // 提交的Seed的Mini-Afid，长度为56character
    owner: string // 提交Seed的用户的TfcAddress。注意，提交的地址不能包含0x prefix，长度为40character。
}

// POST /seed/like
{
    afid: string // 提交的Seed的Mini-Afid，长度为56character
    liked_by: string // 点赞的用户的TfcAddress。注意，提交的地址不能包含0x prefix，长度为40character。
}

// POST /seed/dislike
{
    afid: string // 提交的Seed的Mini-Afid，长度为56character
    liked_by: string // 点踩的用户的TfcAddress。注意，提交的地址不能包含0x prefix，长度为40character。
}
```

### 上传Seed到TfcChain

DB会定期（根据`src/Config.ts`中的`submit_seed_interval`参数）上传符合条件的Seed到TfcChain。

DB选择上传的Seed的方式为：在符合条件的Seed中随机选择。

### Seed分账

Seed提交给TfcChain后，DB会收到TfcChain关于这个Seed的分账。DB需要将他们分给Seed的拥有者。

## 程序调用的API

本程序运行需要拥有SeedSubmitter Role的private key。调用`@tfc-chain/adapter`里的`submitSeed()`函数将Seed提交给tfc-chai；调用`transfer()`和`onReceiveReward()`对Seed的提交者进行分账。

## Database具体设计

本程序使用MongoDB

database的设计以性能和可分布式为目标，只有Seed一个Collection。

### Seed

```ts
interface DBSeedDoc {

    afid: string // the afid of the seed. Indexed.
    date: Date // upload date
    owner: string // the person that uploaded the seed

    used: boolean // 该Seed是否己经被提交给TfcChain用于验证。如果为True，则不可再此提交。已验证过的Seed理论上可以从DB中删除。

    num_likes: number
    num_dislikes: number

    evaluation: {
        likes: TfcAddress[] // 点赞的用户的TfcAddress。数组。
        dislikes: TfcAddress[] // 点踩的用户的TfcAddress。数组。
    }
}
```