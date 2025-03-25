# 使用官方 Node.js 镜像作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 并安装依赖
COPY package.json package-lock.json ./
RUN npm install

# 复制项目的所有文件到容器中
COPY . .

# 暴露后端服务的端口
EXPOSE 3000

# 启动后端服务
CMD ["node", "server.js"]