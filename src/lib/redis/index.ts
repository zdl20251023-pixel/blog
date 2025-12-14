import Redis from "ioredis";

// Redis客户端初始化
const redisClient = new Redis({
  host: "localhost",
  port: 6379,
  password: "123456",  // 密码
  db: 0,  // 使用第0个数据库

  // 连接管理
  maxRetriesPerRequest: 3,  // 每个请求的最大重试次数
  enableReadyCheck: true,  // 启用连接检查
  lazyConnect: false,  // 懒连接   

  // 重连策略
  retryStrategy: (times) => {
    return Math.min(times * 50, 1000);  // 重试策略，每次重试等待50ms，最多1000ms
  },

  // 连接池相关配置
  connectionName: "blog-redis",  // 连接名称  
  enableOfflineQueue: true,  // 启用离线队列  
});

// 定义一个静态类来管理Redis操作
class RedisManager {
  private static instance: RedisManager;
  private redisClient: Redis;

  private constructor() {
    this.redisClient = redisClient;
  }

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  public async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  public async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }
}

export const redisManagerInstance = RedisManager.getInstance();
