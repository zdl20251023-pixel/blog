/**
 * 配置表数据管理模块
 * 
 * 负责初始化和管理 Luban 导表工具生成的配置表数据
 * 在应用启动时加载所有表数据到内存中，提供快速查询能力
 */

import { Tables } from '../../output_code/schema';
import { createJsonLoader } from './loader';

/**
 * 初始化配置表数据
 * 
 * 使用静态加载方案，在应用启动时一次性加载所有表数据到内存中
 * 适合数据量较小的场景，查询速度快，但会占用一定内存
 */
let configTables: Tables;

try {
  // 创建 JSON 文件加载器
  // output_data 目录相对于 src 目录的路径
  const jsonLoader = createJsonLoader('output_data');
  
  // 初始化 Tables 实例
  // 构造函数会自动：
  // 1. 调用 loader 加载所有 JSON 文件（demo_tbitem.json, demo_tbreward.json）
  // 2. 创建对应的表类实例（Tbitem, Tbreward）
  // 3. 执行各表的 resolve() 方法（用于解析表间引用关系）
  configTables = new Tables(jsonLoader);
  
  // 验证初始化结果
  if (!configTables.Tbitem || !configTables.Tbreward) {
    throw new Error('配置表初始化失败：部分表数据未加载');
  }
  
  // 输出加载成功的日志
  const itemCount = configTables.Tbitem.getDataList().length;
  const rewardCount = configTables.Tbreward.getDataList().length;
  
  console.log('✅ 配置表加载完成');
  console.log(`   - Tbitem: ${itemCount} 条记录`);
  console.log(`   - Tbreward: ${rewardCount} 条记录`);
  
} catch (error) {
  // 初始化失败时的错误处理
  console.error('❌ 配置表加载失败:', error);
  
  // 抛出错误，阻止应用启动
  // 如果希望应用在配置表加载失败时仍能启动，可以在这里创建空表或默认表
  throw new Error(`配置表初始化失败: ${error instanceof Error ? error.message : String(error)}`);
}

// 导出配置表实例
export { configTables };

// 导出类型（可选，方便其他模块使用）
export type { Tables } from '../../output_code/schema';

