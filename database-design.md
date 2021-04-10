# tfc-db

## 计划

使用database负责Tfc的分账。其功能包括

* 用户在支付一定押金后可以提交sector
* 用户可以提交Seed
* TfcDb按每天验证的sector数量进行分账
* 分给用户的Tfc会在锁定一段时间后自动释放
* 用户可以将释放后的Tfc转换为TfcErc
  
## 数据库设计

数据库条目可以分片储存

### 用户

```ts
{
    address: string         // 用户的TfcAddress，可索引，Unique
    recommender: string     // 用户的推荐人
    free_balance: Int128    // 用户可以自由支配的余额
    next_unlock_date: Date  // 下一次解锁Tfc的时间，用于快速筛查当天有Tfc需要解锁的用户，可索引
    locked_balance: {       // 记录用户当前无法自用使用的余额（数组）
        amount: Int128          // 数量
        unlock_at: Date         // 解锁时间
    }[]
}
```

预计执行的操作：

* 通过用户的Tfc地址查找用户，转账/提现时修改free_balance，解锁Tfc时删除对应的locked_balance中的条目。

### sector

```ts
{
    afid: string                // sector的afid， 可索引，Unique
    owner: string               // sector的拥有者的TfcAddress
    has_verified_today: bool    // 当天是否被验证。如为true则可在当天获得Tfc奖励
    upload_date: Date           // sector上传（挖出）的时间
    deposit: Int128             // 该sector所含的抵押数额，用于记录
}
```

### seed

```ts
{
    afid: string        // seed的afid，可索引，Unique
    uploaded_by: string // 上传seed的用户的TfcAddress
    used: bool          // seed是否已经被用于验证，可索引，如为false可被随机选中进行验证
    upload_date: Date   // seed上传的时间

    num_likes: Int      // 点赞数量。超过3个的可用于验证，可索引
    seed_evaluations: { // seed接受到的赞和踩，决定该seed是否有效，若无效则seed的上传者可能接受一定惩罚（待定）
        liked_by: string[]          // “赞”过这个seed的用户的TfcAddress（数组）。奖励seed的拥有者时也会奖励给这个seed点赞的人。
        disliked_by: string[]       // “踩”过这个seed的用户的TfcAddress（数组）
    }
}
```
