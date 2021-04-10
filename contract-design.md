# Private Chain 智能合约

## 主要目的

由于TFC的锁定机制，完整的分账逻辑很难在智能合约中实现，因此，我们只在Private Chain上记录已经解锁的TFC。

这样做的主要目的是使用区块链提供一个可以追溯每一笔收益的服务，以提升整个系统的可信度。

## 合约函数（API）

### Sector押金

```solidity
/// @notice 用户调用这个函数来支付TFC押金
/// @notice 押金会在lockPeriod之后解锁
/// @dev 此函数应在提交sector的时候由rnode调用，以支付sector押金。
function sectorDeposit(address user, uint256 value, uint256 lockPeriod, string sector_afid)
event Deposit(address user, uint256 value, uint256 unlockTime, string sector_afid)
```

### 提现

```solidity
/// @notice 此函数应由用户调用，用户需要在调用函数是附带TFC转账，转账的金额即为提现的金额。
/// @dev 此函数的执行会销毁收到的TFC转账，并发出Withdraw事件。
/// @dev 链下程序监听Withdraw事件，并在相应的目标区块链上生成TFC-ERC20或TFC-DB
function withdraw(address user, uint256 value)
event Withdraw(address user, uint256 value)
```

### 分账记录

```solidity
/// @notice 当验证sector的收益解锁时调用此函数。
/// @notice 调用此函数时应该附带TFC收益的金额（作为transaction value）
/// @dev 此函数执行发出SectorVerificationReward事件
function rewardSectorVerification(address rnode, string sector_afid, uint256 value)
event SectorVerificationReward(address rnode, string sector_afid, string value);
```

```solidity
/// @notice 当评价seed的收益解锁时调用此函数。
/// @notice 调用此函数时应该附带TFC收益的金额（作为transaction value）
/// @dev 此函数执行发出SeedEvaluationReward事件
function rewardSeedEvaluation(address evaluator, string seed_afid, uint256 value)
event SeedEvaluationReward(address evaluator, string seed_afid, string value);
```

```solidity
/// @notice 当seed被使用的收益解锁时调用此函数。
/// @notice 调用此函数时应该附带TFC收益的金额（作为transaction value）
/// @dev 此函数执行发出SeedConsumptionReward事件
function rewardSeedConsumption(address submitter, string seed_afid, uint256 value)
event SeedConsumptionReward(address submitter, string seed_afid, string value);
```

## 功能流程

### Sector

1. RNode挖出一个新的sector时，首先调用Private Chain上智能合约的deposit函数，支付押金。
   - 支付押金的时候需要提供sector afid，智能合约会内建一个sector_afid => deposit的映射。
2. RNode将支付押金的交易哈希值与sector一起提交至DB
3. DB验证支付押金的交易真实有效，在DB中追踪这个sector，周期性地进行验证。
4. 每一次验证成功都要在DB中生成发放TFC收益（锁定三个月）。
5. 当TFC收益解锁时，DB调用智能合约的rewardSectorVerification函数来记录一次解锁的分账。并将TFC转账给rnode。
6. rewardSectorVerification函数执行的过程中会检查与sector_afid绑定的押金是否已经返还，如果还未返还，那么释放押金。

### Seed

1. 普通手机用户提交seed到DB，不发放任何收益。
2. 普通手机用户给其他人的seed点赞，发放点赞收益。
3. 点赞收益解锁时DB调用rewardSeedEvaluation函数来记录点赞收益。并将TFC转账给点赞人。
4. 点赞超过三个的seed才能被用于验证sector。
5. 被用于验证sector的seed才能发放TFC收益。
6. seed被使用的收益解锁时DB调用rewardSeedConsumption函数来记录seed被使用的收益。并将TFC转账给seed提交者。

### 提现

1. 用户调用合约中withdraw函数并将提现的TFC转账给合约。
2. 合约销毁收到的TFC并发出Withdraw事件
3. 链下程序监听Withdraw事件
4. 如果提现到以太坊ERC20，方案一：授权码自行提现
    1. 链下程序使用ERC20的管理员账户生成一个授权码并发送给用户。授权码一经生成无法取消，并且授权码并不会过期。
    2. 用户利用这个授权码调用以太坊上的ERC20合约铸造TFC-ERC20代币。
    - 优势：我们无需支付以太坊上的ERC20铸币手续费，手续费由用户使用授权码铸币的时候支付。
    - 劣势：需要提供一个图形界面来帮助用户调用以太坊上的铸币函数，可以用集成Metamask做成一个网页，用户只要粘贴授权码，并链接Metamask钱包即可。
    
4. 如果提现到以太坊ERC20，方案二：用户提前支付手续费
    1. 用户需要先在以太坊上向管理员账户转账铸币手续费。
    2. 用户提交转账交易哈希值给DB。
    2. DB确认收到手续费转账之后，调用以太坊ERC20铸币函数，生成TFC-ERC20给用户。
    - 优势：我们无需支付以太坊ERC20铸币手续费。
    - 劣势：需要用户自行向我们的管理员账户转账以太币。
    
4. 如果提现到以太坊ERC20，方案三：扣除TFC作为手续费
    1. DB直接调用以太坊函数进行ERC20铸币，由我们支付手续费。
    2. 铸币时扣除一定金额的TFC作为手续费。
    - 优势：流程简单，所有操作一次性完成。
    - 劣势：当TFC价值较低时会亏损。
    
5. 如果提现到DB，DB内直接生成TFC给用户即可。

## 性能问题

私有链上数量较大的交易主要是分账记录函数的调用。
- rewardSeedConsumption函数的调用频率和sector验证的频率相同。
- rewardSectorVerification函数的调用频率和sector验证的频率相同。
- rewardSeedEvaluation函数的调用频率很难预测，并至少是sector验证频率的三倍。
因此，分账函数调用的频率至少为sector验证频率的5倍。

以太坊主网平均每个区块执行大约200个交易。
假设我们的交易平均执行复杂度和以太坊主网的其他交易相同，并且私有链挖矿的速率为5s/个，那么私有链的平均TPS为40。 
也就是说，每秒能处理的交易大约为40个。
在这种情况下，sector验证的频率不能超过8个/秒。

这个结果非常粗糙，私有链的情况和主链不同。
- 主链中，每一个区块能够执行的交易数量受block gas limit制约。但私有链中gas limit我们可以自己设置。
- 假设在私有链中没有gas limit，那么每个区块交易执行的数量取决于以太坊客户端单线程执行交易的速度。
  这可能需要具体做实验才能得到比较精确的TPS。
  
但是，由于历史上所有的sector都需要持续验证，sector验证的频率会随时间推移而增长。
所以也许我们无法在每一笔收益解锁的时候都调用链上合约进行分账记录。
此外，解锁的收益也必须合并之后再在私有链上发放。