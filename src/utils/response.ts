import { t, type TSchema } from "elysia";
import { ErrorCode } from "./errorCode";

/**
 * 创建标准的 API 响应 schema（仅返回 200 状态码对应的 schema 对象）
 * @param dataSchema - data 字段的 schema，如果为 null 则 data 只能为 null，否则 data 可以是 schema 或 null
 * @returns 返回 t.Object({ code: t.Number(), data: ... }) schema 对象
 * 
 * @example
 * // 使用完整形式（推荐）
 * response: {
 *     200: createResponseSchema(demo_get_rsp)
 * }
 * 
 * @example
 * // 使用简写形式（Elysia 自动识别为 200）
 * response: createResponseSchema(demo_get_rsp)
 * 
 * @example
 * // data 只能为 null
 * response: createResponseSchema(null)
 */
export function createResponseSchema<T extends TSchema | null>(
  dataSchema: T
) {
  const dataField = dataSchema === null
    ? t.Null()  // 如果传入 null，data 只能为 null
    : t.Union([dataSchema, t.Null()]);  // 否则 data 可以是 schema 或 null

  return t.Object({
    code: t.Number({ default: ErrorCode.SUCCESS, description: "错误码" }),
    data: dataField,
    // message: t.String({ default: "成功", description: "错误信息" })
  });
}

/**
 * 标准响应对象类型
 */
export interface StandardResponse<T = unknown> {
  code: number;
  data: T | null;
}

/**
 * 创建成功响应对象
 * @param data - 响应数据，可以为 null
 * @param code - 错误码，默认为 ErrorCode.SUCCESS
 * @returns 标准响应对象 { code, data }
 * 
 * @example
 * return successResponse({ id: 1, name: "test" });
 * 
 * @example
 * return successResponse(null);
 */
export function successResponse<T>(
  data: T | null,
  code: number = ErrorCode.SUCCESS
): StandardResponse<T> {
  return { code, data };
}

/**
 * 创建标准响应对象
 * @param code - 错误码
 * @param data - 响应数据，可以为 null
 * @returns 标准响应对象 { code, data }
 * 
 * @example
 * const [code, data] = await DemoService.getDemo();
 * return responseFromService(code, data);
 */
export function responseFromService<T>(
  code: number,
  data: T | null
): StandardResponse<T> {
  return { code, data };
}
