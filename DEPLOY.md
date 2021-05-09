# Tfc-Db-2 部署

此部署指南适用于Ubuntu 18.04，20.04，21.04.

## 部署前

1. 安装NodeJS

以下内容来源于此链接：https://github.com/nodesource/distributions#debian-and-ubuntu-based-distributions

```bash
# 可以将lts替换为其他需要安装的版本，如14，15，16...
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

此应用只需要node和npm可执行文件在$PATH中，node和npm也可以用其他方式安装。

2. 安装MongoDB

建议安装MongoDB-4.4版本。

以下内容来源于此链接：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -s -c)/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

3. 安装yarn

```bash
sudo npm i -g yarn
```

4. 安装应用依赖

将应用解压，并进入应用的根目录。

运行应用前需配置应用。配置选项在`src/Config.ts`。里面有关于每个选项含义的注释。

```bash
yarn
yarn test # 测试应用是否报错
yarn run build

# 启动（开发环境）
yarn start

# 启动（生产环境）
node dist/main.js

```