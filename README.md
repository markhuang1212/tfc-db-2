# Tfc-db-2

由于Tfc-Chain性能限制，无法实时收集Seed的点赞/点踩信息。这部分信息由Database收集，并在一个Seed得到足够的点/踩后将这个Seed提交给Tfc-Chain。

同时，Database负责给Seed提交者，点赞者和点踩者分账。

## 配置参数

运行本程序需要在`src/Config.ts`中填入需要的参数。

## 具体API设计

### 由手机端/其他客户端向DB提交Seed，点赞，点踩。提供Restful API

```ts
// POST /seed/upload
{
    afid: string,
    owner: string // 提交Seed的用户的TfcAddress
}

// POST /seed/like
{
    afid: string
    liked_by: string // 点赞的用户的TfcAddress
}

// POST /seed/dislike
{
    afid: string
    liked_by: string // 点踩的用户的TfcAddress
}
```

本程序暂时只会收集点赞和点踩信息。

### 上传Seed到TfcChain

DB会定期（根据`submit_seed_interval`参数）上传符合条件的Seed到TfcChain。

DB选择上传的Seed的方式为：在符合条件的Seed中随机选择。

### Seed分账

Seed提交给TfcChain后，DB会收到TfcChain关于这个Seed的分账。DB需要将他们分给Seed的拥有者。

## 运行所需要的API

本程序运行需要TFC-Chain的SeedSubmitter Role。调用`@tfc-chain/adapter`里的`submitSeed()`函数

## Database具体设计

database的设计以性能和可分布式为目标。有一下几个table/collection

### Seed

```ts
interface DBSeedDoc {

    afid: string // the afid of the seed. Indexed.
    date: Date // upload date
    owner: string // the person that uploaded the seed

    used: boolean // 该Seed是否己经被提交给TfcChain用于验证。如果为True，则不可再此提交。已验证过的Seed理论上可以直接从DB中删除。

    num_likes: number
    num_dislikes: number

    evaluation: {
        likes: TfcAddress[] // 点赞的用户的TfcAddress。数组。
        dislikes: TfcAddress[] // 点踩的用户的TfcAddress。数组。
    }
}
```