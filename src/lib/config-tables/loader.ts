/**
 * 配置表 JSON 文件加载器
 * 
 * 实现 JsonLoader 接口，用于从 output_data 目录加载 JSON 配置文件
 * Tables 构造函数会调用此加载器来加载各个表的 JSON 数据
 */

import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * JSON 文件加载器类型定义
 * 接收文件名（不含扩展名），返回解析后的 JSON 对象
 */
type JsonLoader = (file: string) => unknown;

/**
 * 创建 JSON 文件加载器
 * 
 * @param basePath JSON 文件的基础路径，相对于 src 目录
 * @returns JsonLoader 函数
 */
export function createJsonLoader(basePath: string): JsonLoader {
  return (fileName: string) => {
    try {
      // 使用 import.meta.dir 获取当前文件所在目录（Bun 特有）
      // import.meta.dir 指向 src/lib/config-tables/
      // 需要回到 src 目录，然后进入 output_data 目录
      const currentDir = import.meta.dir; // src/lib/config-tables/
      const srcDir = join(currentDir, '..', '..'); // src/
      const targetPath = join(srcDir, basePath, `${fileName}.json`);

      // 读取文件内容
      const fileContent = readFileSync(targetPath, 'utf-8');

      // 解析 JSON
      const jsonData = JSON.parse(fileContent);

      return jsonData;
    } catch (error) {
      // 文件不存在时的错误处理
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new Error(`配置表文件不存在: ${fileName}.json (路径: ${join(basePath, `${fileName}.json`)})`);
      }

      // JSON 格式错误
      if (error instanceof SyntaxError) {
        throw new Error(`配置表 JSON 格式错误 [${fileName}]: ${error.message}`);
      }

      // 其他错误
      console.error(`加载配置表失败 [${fileName}]:`, error);
      throw error;
    }
  };
}

