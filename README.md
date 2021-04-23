# TFC链下程序设计

TFC链下程序分为两部分。一部分在RNode/超级节点上运行，负责提供sector的提交和验证。另一部分为一个可以分布式部署的database，用于储存Seed的点赞和点踩的相关信息。

## RNode/超级节点部分

这部分链下程序负责：
1. 提供“提交sector信息到TFC-Chain和集群”的功能
2. （Rnode）监听链上的验证请求，在自己的sector需要被验证时，（sector和seed的afid）及时提交验证结果（proof）
3. （超级节点）监听链上的验证请求，在Tfc-Chain需要时验证其他RNode提交的proof
4. 将RNode获得的分账的一部分给FNode

### 具体API设计

#### 提交sector到Tfc-Chain和集群

```ts
/**
 * 该函数将rnode上的sector提交到Tfc-Chain和集群中。
 * @params afid - 提交的sector的afid 
 * @params owner - sector拥有者的TfcAddress
 * @params private_key - sector拥有者的TfcAddress的私钥。用于向Tfc-Chain提交请求时签名
 * @throws 若操作失败则报错
 */
function uploadSector(afid: string, owner: string, private_key: string): void // 该函数后续可以根据需要分装为CLI或Restful
```

#### 分账给FNode

具体分账方式取决于RNode的配置。Rnode可以指定`percentage_to_distribute`和`distribute_period`三个参数，决定分账给FNode的比例和分账的周期。如果`percentage_to_distribute`为0.5，则rnode获得的分账有50%会分给所有的FNode，每个FNode获得的比例由该FNode贡献的空间决定。

### 程序运行需要的API

1. TfcChain
2. 向集群提交sector的函数
3. 生成sector验证结果（proof）的函数
4. 验证其他RNode提交的proof的函数
5. 获得RNode旗下FNode和每个FNode贡献的存储空间的函数（否则向FNode分账的功能无法运作）

## Database部分

由于Tfc-Chain性能限制，无法实时收集Seed的点赞/点踩信息。这部分信息由Database收集，并在一个Seed得到足够的点/踩后将这个Seed提交给Tfc-Chain。

同时，Database负责给Seed提交者，点赞者和点踩者分账。

### 具体API设计

#### 由手机端/其他客户端向DB提交Seed，点赞，点踩。提供Restful API

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

#### Seed分账

Seed提交给TfcChain后，DB会收到TfcChain关于这个Seed的分账。DB需要将他们分给Seed的拥有者和点赞者（如果Seed通过），或者Seed的点踩者（如果Seed不通过）。（Seed在不通过的情况下是否会收到TfcChain分账待定。如果不会则不用考虑这种情况）

Seed的分账由`percentage_to_owner`，`percentage_to_evaluator`，`num_of_evaluation_needed`这两个参数决定。`num_of_evaluation_needed`暂定为3，即DB收到3个赞/3个踩后会向TfcChain提交Seed结果。`percentage_to_owner + percentage_to_evaluator = 1`。

如果Seed的验证通过（点赞数>num_of_evaluation_needed，且点赞数>点踩数），那么`percentage_to_owner`比例的TFC会分给Seed的提交者，`percentage_to_evaluator`比例的TFC会分平均分给点赞的人。

如果Seed的验证不通过（点踩数>num_of_evaluation_needed，且点踩数>点赞数），那么点踩的人均分奖励。

### 运行所需要的API

1. TfcChain