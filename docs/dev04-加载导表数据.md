# Luban 导表数据集成方案

## 📋 概述

本文档说明如何将 Luban 导表工具生成的代码和数据文件集成到当前项目中。

### 导表工具输出结构

```
src/
├── output_code/          # Luban 导出的 TypeScript 代码
│   └── schema.ts        # 包含数据类定义和 Tables 加载器
└── output_data/         # Luban 导出的 JSON 数据文件
    ├── demo_tbitem.json
    └── demo_tbreward.json
```

### 核心组件说明

1. **schema.ts**: 包含以下内容：
   - 数据类定义（如 `demo.item`、`demo.reward`）
   - 表类定义（如 `demo.Tbitem`、`demo.Tbreward`）
   - `Tables` 主类：统一管理和加载所有表数据
   - `JsonLoader` 类型：定义 JSON 文件加载器接口

2. **JSON 数据文件**: 各表的实际数据内容

## 🚀 快速开始

### 最小化实现步骤（推荐方案一）

1. **创建加载器文件**
   ```bash
   # 创建目录和文件
   mkdir -p src/lib/config-tables
   touch src/lib/config-tables/loader.ts
   touch src/lib/config-tables/index.ts
   ```

2. **实现 JSON 加载器** (`src/lib/config-tables/loader.ts`)
   - 参考下方"实现要点"章节的方式 A 或 C
   - 实现 `createJsonLoader` 函数

3. **初始化 Tables** (`src/lib/config-tables/index.ts`)
   - 导入 `Tables` 类和加载器
   - 创建并导出 `configTables` 实例

4. **集成到应用** (`src/index.ts`)
   - 导入 `configTables`
   - 使用 `.decorate('tables', configTables)` 注入

5. **在路由中使用**
   - 通过 `context.tables` 访问表数据
   - 或直接导入 `configTables` 使用

### 验证集成是否成功

```typescript
// 在应用启动后验证
app.get('/test/config-tables', ({ tables }) => {
  return {
    itemCount: tables.Tbitem.getDataList().length,
    rewardCount: tables.Tbreward.getDataList().length,
    sampleItem: tables.Tbitem.get(1001),
  };
});
```

## 🎯 集成方案

### 方案一：静态加载方案（推荐）

**适用场景**: 数据量较小，启动时一次性加载所有数据到内存

#### 实现步骤

1. **创建表数据加载器**

   位置: `src/lib/config-tables/index.ts`

   - 实现 `JsonLoader` 函数，从 `output_data` 目录读取 JSON 文件
   - 在应用启动时初始化 `Tables` 实例
   - 将 `Tables` 实例导出供全局使用

2. **JSON 文件加载方式**

   - 使用 Bun 的文件读取 API 或 Node.js 的 `fs` 模块
   - 路径解析: `src/output_data/${fileName}.json`
   - 使用 `JSON.parse()` 解析文件内容

3. **在 Elysia 应用中注入**

   - 在 `src/index.ts` 中导入初始化后的 `Tables` 实例
   - 使用 Elysia 的 `.decorate()` 方法将 `Tables` 注入到应用上下文
   - 在路由处理函数中通过 `context.tables` 访问表数据

#### 优点

- 启动时加载，运行时查询速度快
- 实现简单，代码清晰
- 适合读取频繁的场景

#### 缺点

- 占用内存较大（所有数据常驻内存）
- 数据更新需要重启应用

---

### 方案二：动态加载方案

**适用场景**: 数据量较大，需要按需加载或支持热更新

#### 实现步骤

1. **创建表数据管理器**

   位置: `src/lib/config-tables/manager.ts`

   - 实现懒加载机制，首次访问时才加载对应表
   - 支持缓存机制，避免重复加载
   - 可选：支持定时刷新或文件监听

2. **文件监听（可选）**

   - 使用 Bun 的 `watch()` API 监听 `output_data` 目录
   - 文件变更时自动重新加载对应的表数据
   - 实现热更新功能

3. **在 Elysia 中的应用**

   - 注入表管理器而非直接注入 Tables 实例
   - 在路由中通过管理器获取表数据

#### 优点

- 内存占用可控
- 支持热更新，无需重启
- 适合大数据量场景

#### 缺点

- 实现复杂度较高
- 首次访问可能有延迟

---

### 方案三：混合方案

**适用场景**: 部分表使用静态加载，部分表使用动态加载

- 核心配置表（如物品表、奖励表）使用静态加载
- 非核心表或大表使用动态加载

---

## 📁 推荐目录结构

```
src/
├── lib/
│   └── config-tables/           # 新增：配置表管理模块
│       ├── index.ts             # 导出 Tables 实例或管理器
│       ├── loader.ts            # JSON 文件加载器实现
│       └── types.ts             # 类型定义（如有需要）
├── output_code/                 # Luban 导出代码（保持不变）
│   └── schema.ts
└── output_data/                 # Luban 导出数据（保持不变）
    ├── demo_tbitem.json
    └── demo_tbreward.json
```

## 🔧 实现要点

### 1. JSON 文件加载器实现（Bun 环境）

> **重要提示**: 
> - `schema.ts` 中的 `JsonLoader` 类型可能未导出，需要在 `loader.ts` 中自行定义
> - **必须使用 `unknown` 类型，不要使用 `any`**，以避免 ESLint 错误
> - `unknown` 是 `JSON.parse()` 的标准返回类型，更符合 TypeScript 最佳实践

#### 方式 A: 使用 Bun.file()（推荐）

```typescript
// src/lib/config-tables/loader.ts

// 如果 JsonLoader 类型未导出，在此定义
// 注意: 使用 unknown 而不是 any，避免 ESLint 错误
type JsonLoader = (file: string) => unknown;

import { join } from 'path';

/**
 * 使用 Bun.file() API 创建 JSON 加载器
 * 优点: 性能好，异步读取，支持流式处理
 */
export function createJsonLoader(basePath: string): JsonLoader {
  return (fileName: string) => {
    const filePath = join(import.meta.dir, '..', basePath, `${fileName}.json`);
    const fileContent = Bun.file(filePath);
    // 注意: Bun.file().json() 返回 Promise，需要同步处理
    // 如果 Tables 构造函数需要同步加载，使用 readFileSync
    return JSON.parse(fileContent.textSync());
  };
}
```

#### 方式 B: 使用动态 import()（ESM）

```typescript
// src/lib/config-tables/loader.ts

// 如果 JsonLoader 类型未导出，在此定义
// 注意: 使用 unknown 而不是 any，避免 ESLint 错误
type JsonLoader = (file: string) => unknown;

import { join } from 'path';

/**
 * 使用动态 import 加载 JSON（需要配置 TypeScript/Bun 支持）
 * 优点: 简洁，自动解析 JSON
 * 注意: 需要确保 JSON 文件可以被作为模块导入
 */
export function createJsonLoader(basePath: string): JsonLoader {
  return (fileName: string) => {
    // 动态导入 JSON 文件
    // 注意: 这需要在运行时执行，可能需要调整构建配置
    const modulePath = `../../output_data/${fileName}.json`;
    // 使用 require 或 import，根据环境选择
    // 如果支持，可以直接返回导入的结果
  };
}
```

#### 方式 C: 使用 fs.readFileSync()（Node.js 兼容）✅ 已实现

```typescript
// src/lib/config-tables/loader.ts

// 如果 JsonLoader 类型未导出，在此定义
// 注意: 使用 unknown 而不是 any，避免 ESLint 错误
type JsonLoader = (file: string) => unknown;

import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * 使用 Node.js fs 模块同步读取
 * 优点: 兼容性好，同步加载
 * 注意: 确保文件路径正确
 */
export function createJsonLoader(basePath: string): JsonLoader {
  return (fileName: string) => {
    // 使用 import.meta.dir 获取当前文件所在目录（Bun）
    // 或使用 __dirname（Node.js with CommonJS）
    const filePath = join(import.meta.dir, '..', basePath, `${fileName}.json`);
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  };
}
```

**推荐使用方式 C（已实现）**，因为：
- Tables 构造函数需要同步加载数据
- 使用 `fs.readFileSync` 简单可靠
- 类型使用 `unknown` 符合 ESLint 规范

**实现要点**:
- `JsonLoader` 的 `fileName` 参数是文件名（不含扩展名），如 `'demo_tbitem'`
- Tables 构造函数会自动调用 `loader('demo_tbitem')` 来加载对应的 JSON 文件
- 需要在 loader 中处理文件路径拼接和 `.json` 扩展名添加
- 使用 `import.meta.dir` 获取当前文件目录，然后构建相对路径
- **重要**: 类型定义必须使用 `unknown` 而不是 `any`，避免 ESLint 报错

---

### 2. Tables 实例初始化

```typescript
// src/lib/config-tables/index.ts

import { Tables } from '../../output_code/schema';
import { createJsonLoader } from './loader';

/**
 * 初始化配置表数据
 * 在应用启动时创建 Tables 实例，所有表数据会被加载到内存中
 */
const jsonLoader = createJsonLoader('output_data'); // 相对于 src 目录的路径

// 初始化 Tables 实例
// 构造函数会自动调用 loader 加载所有 JSON 文件
// 并执行各表的 resolve() 方法（用于解析表间引用关系）
export const configTables = new Tables(jsonLoader);

// 可选: 添加初始化验证
if (!configTables.Tbitem || !configTables.Tbreward) {
  throw new Error('配置表初始化失败：部分表数据未加载');
}

// 可选: 添加日志
console.log('✅ 配置表加载完成');
console.log(`  - Tbitem: ${configTables.Tbitem.getDataList().length} 条记录`);
console.log(`  - Tbreward: ${configTables.Tbreward.getDataList().length} 条记录`);
```

### 3. Elysia 应用集成

```typescript
// src/index.ts 伪代码示例

import { configTables } from './lib/config-tables';

const app = new Elysia()
  .decorate('db', db)
  .decorate('tables', configTables)  // 注入 Tables 实例
  // ... 其他配置
```

### 4. 在路由中使用

#### 方式1: 通过 Elysia context 访问（推荐）

```typescript
// src/index.ts 或路由文件中

import { configTables } from './lib/config-tables';

const app = new Elysia()
  .decorate('db', db)
  .decorate('tables', configTables)  // 注入 Tables 实例
  .get('/api/item/:id', ({ params, tables }) => {
    const itemId = Number(params.id);
    const item = tables.Tbitem.get(itemId);
    
    if (!item) {
      return { error: '物品不存在', itemId };
    }
    
    return {
      id: item.id,
      name: item.name,
      desc: item.desc,
      count: item.count,
    };
  })
  .get('/api/items', ({ tables }) => {
    // 获取所有物品列表
    return tables.Tbitem.getDataList();
  });
```

#### 方式2: 在 Service 层直接导入使用

```typescript
// src/modules/item/service.ts

import { configTables } from '../../lib/config-tables';

/**
 * 物品服务
 */
export class ItemService {
  /**
   * 根据 ID 获取物品
   */
  static getItemById(id: number) {
    return configTables.Tbitem.get(id);
  }
  
  /**
   * 获取所有物品
   */
  static getAllItems() {
    return configTables.Tbitem.getDataList();
  }
  
  /**
   * 根据 ID 列表批量获取物品
   */
  static getItemsByIds(ids: number[]) {
    return ids
      .map(id => configTables.Tbitem.get(id))
      .filter(item => item !== undefined);
  }
}
```

#### 方式3: 在 Controller 中使用

```typescript
// src/modules/item/controller.ts

import { Elysia } from 'elysia';
import { configTables } from '../../lib/config-tables';

export const itemController = new Elysia({ prefix: '/api/items' })
  .get('/:id', ({ params }) => {
    const item = configTables.Tbitem.get(Number(params.id));
    if (!item) {
      throw new Error('物品不存在');
    }
    return item;
  })
  .get('/', () => {
    return configTables.Tbitem.getDataList();
  });
```

## ⚠️ 注意事项

### 1. ESLint 代码规范问题

在实现过程中可能会遇到 ESLint 报错，主要有两类问题需要处理：

#### 问题 1: `any` 类型不符合 ESLint 规则

**错误信息**:
```
error  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
```

**出现位置**: `src/lib/config-tables/loader.ts` 中的 `JsonLoader` 类型定义

**解决方法**:

在定义 `JsonLoader` 类型时，**必须使用 `unknown` 而不是 `any`**：

```typescript
// ❌ 错误写法（会导致 ESLint 报错）
type JsonLoader = (file: string) => any;

// ✅ 正确写法（符合 TypeScript 和 ESLint 规范）
type JsonLoader = (file: string) => unknown;
```

**原因说明**:
- `unknown` 是 `JSON.parse()` 的标准返回类型（在 TypeScript 严格模式下）
- `unknown` 比 `any` 更安全，要求在使用前进行类型检查
- 符合 `@typescript-eslint/no-explicit-any` 规则要求
- `unknown` 可以赋值给 `any` 类型，因此与 `schema.ts` 中的 `Tables` 构造函数兼容

#### 问题 2: 自动生成代码的 ESLint 错误

**错误信息**:
```
error  ES2015 module syntax is preferred over namespaces  @typescript-eslint/no-namespace
error  Unexpected any. Specify a different type           @typescript-eslint/no-explicit-any
error  'tables' is defined but never used                 @typescript-eslint/no-unused-vars
error  Unexpected var, use let or const instead           no-var
error  'data' is never reassigned. Use 'const' instead    prefer-const
```

**出现位置**: `src/output_code/schema.ts`（Luban 自动生成的代码）

**解决方法**:

由于 `schema.ts` 是 Luban 工具自动生成的代码，**不应该手动修改**（修改会在重新生成时丢失）。正确的做法是在文件顶部添加 ESLint 禁用注释：

```typescript
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

/* eslint-disable */
// 此文件为自动生成的代码，忽略所有 ESLint 规则
```

**重要提示**:
- ⚠️ **每次重新运行 Luban 导表工具后，需要重新添加 `/* eslint-disable */` 注释**
- 建议在导表工具配置或文档中记录此操作步骤
- 或者在 ESLint 配置文件中排除 `src/output_code/` 目录（见下方配置方式）

**可选方案：在 ESLint 配置中排除目录**

如果不想每次都在文件中添加注释，可以在 `eslint.config.ts` 中排除整个目录：

```typescript
// eslint.config.ts
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser } 
  },
  tseslint.configs.recommended,
  // 排除自动生成的代码目录
  {
    ignores: ["src/output_code/**/*"]
  }
]);
```

**验证修复**:

运行以下命令确认所有 ESLint 错误已解决：

```bash
# 检查 ESLint
bun run lint

# 检查 TypeScript 类型
bun run tsc-check
```

两者都应该无错误通过 ✅

---

### 2. 文件路径处理

#### Bun 环境路径处理

```typescript
// 推荐方式: 使用 import.meta.dir
import { join } from 'path';

// import.meta.dir 是当前文件所在目录的绝对路径（Bun 特有）
const currentDir = import.meta.dir; // 例如: /path/to/project/src/lib/config-tables

// 构建目标路径（相对于项目根目录）
const outputDataPath = join(currentDir, '..', 'output_data');

// 或者使用相对于 src 目录的路径
const outputDataPath = join(currentDir, '../output_data');
```

#### 路径解析要点

- **开发环境**: 
  - 使用 `import.meta.dir`（Bun）获取当前文件目录
  - 使用 `join()` 拼接路径，避免手动拼接字符串
  - 测试不同工作目录下的路径解析是否正常

- **生产环境**: 
  - 确保 JSON 文件会被部署到正确位置
  - 如果使用打包工具，检查 JSON 文件是否会被包含
  - 考虑使用环境变量配置数据文件路径

- **路径验证**:
  - 在初始化时验证路径是否存在
  - 提供清晰的错误信息，便于排查路径问题

### 3. 类型支持

- 确保 `src/output_code/schema.ts` 中的类型定义正确
- 注意检查 `Tables` 类中引用的 `JsonLoader` 类型定义
- 如果 schema.ts 中有 `resolve()` 方法，确保在初始化后调用

### 4. 错误处理

#### JSON 文件不存在

```typescript
// 在 loader 中添加文件存在性检查
export function createJsonLoader(basePath: string): JsonLoader {
  return (fileName: string) => {
    const filePath = join(import.meta.dir, '..', basePath, `${fileName}.json`);
    
    // 检查文件是否存在
    try {
      const file = Bun.file(filePath);
      if (!file.exists()) {
        throw new Error(`配置表文件不存在: ${filePath}`);
      }
      return JSON.parse(file.textSync());
    } catch (error) {
      console.error(`加载配置表失败 [${fileName}]:`, error);
      throw error;
    }
  };
}
```

#### JSON 格式错误

```typescript
// 添加 JSON 解析错误处理
export function createJsonLoader(basePath: string): JsonLoader {
  return (fileName: string) => {
    try {
      const filePath = join(import.meta.dir, '..', basePath, `${fileName}.json`);
      const content = Bun.file(filePath).textSync();
      return JSON.parse(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`配置表 JSON 格式错误 [${fileName}]: ${error.message}`);
      }
      throw error;
    }
  };
}
```

#### 初始化失败处理

```typescript
// src/lib/config-tables/index.ts

import { Tables } from '../../output_code/schema';
import { createJsonLoader } from './loader';

let configTables: Tables;

try {
  const jsonLoader = createJsonLoader('output_data');
  configTables = new Tables(jsonLoader);
  console.log('✅ 配置表加载成功');
} catch (error) {
  console.error('❌ 配置表加载失败:', error);
  // 根据业务需求选择:
  // 1. 抛出错误，阻止应用启动
  throw error;
  
  // 2. 使用空数据，允许应用启动（不推荐）
  // configTables = createEmptyTables();
  
  // 3. 使用默认数据
  // configTables = createDefaultTables();
}

export { configTables };
```

#### 文件读取权限问题

- 确保应用运行用户对 JSON 文件有读取权限
- 在生产环境检查文件权限设置
- 添加权限错误的明确提示

### 5. 性能考虑

- 大量数据时的加载时间
- 内存占用评估
- 是否需要索引优化

### 6. 数据更新流程

- 确定数据更新的触发方式（手动、定时、文件监听）
- 更新时的数据一致性保证
- 更新失败的回滚机制

## 🔄 更新流程建议

### 导表工具更新后的操作流程

1. **替换文件**
   - 将 Luban 新生成的 `schema.ts` 覆盖 `src/output_code/schema.ts`
   - 将新的 JSON 数据文件复制到 `src/output_data/` 目录

2. **⚠️ 重要：重新添加 ESLint 禁用注释**
   - 在 `schema.ts` 文件顶部（`<auto-generated>` 注释之后）添加：
     ```typescript
     /* eslint-disable */
     // 此文件为自动生成的代码，忽略所有 ESLint 规则
     ```
   - 如果使用了 ESLint 配置排除目录的方式，可跳过此步骤

3. **验证类型和代码规范**
   - 运行 `bun run tsc-check` 检查类型错误
   - 运行 `bun run lint` 检查 ESLint 错误
   - 确保新增或修改的表类正确导出

4. **测试加载**
   - 重启应用验证数据加载是否正常
   - 检查控制台是否有错误信息
   - 访问测试路由 `/test/config-tables` 验证数据

5. **更新使用代码**（如有变更）
   - 如果表结构或字段有变化，更新相关的业务代码
   - 验证 API 返回数据是否正确

## 📝 后续优化建议

1. **ESLint 自动化**: 
   - 考虑在导表工具的输出模板中添加 `/* eslint-disable */` 注释
   - 或在导表工具配置中添加后处理脚本自动添加注释

2. **缓存策略**: 考虑使用 Redis 缓存热门表数据

3. **版本管理**: 为导表数据添加版本号，支持多版本并存

4. **数据校验**: 在加载时验证数据完整性

5. **监控告警**: 添加数据加载失败的通知机制

6. **文档生成**: 自动生成表结构的 API 文档

## 🔗 相关文件

- `src/output_code/schema.ts` - Luban 导出的类型定义和加载器
- `src/output_data/*.json` - Luban 导出的数据文件
- `src/index.ts` - 应用入口，集成 Tables 的地方
- `src/lib/config-tables/` - 表数据管理模块（需创建）

