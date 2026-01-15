using System.Numerics;

/// <summary>
/// 外部类型工具类
/// 用于将 Luban 生成的向量类型转换为 System.Numerics 中的向量类型
/// </summary>
public static class ExternalTypeUtil
{
    /// <summary>
    /// 将 cfg.vector2 转换为 System.Numerics.Vector2
    /// </summary>
    /// <param name="v">Luban 生成的 vector2 类型</param>
    /// <returns>System.Numerics.Vector2 实例</returns>
    public static Vector2 NewVector2(cfg.vector2 v)
    {
        return new Vector2(v.X, v.Y);
    }

    /// <summary>
    /// 将 cfg.vector3 转换为 System.Numerics.Vector3
    /// </summary>
    /// <param name="v">Luban 生成的 vector3 类型</param>
    /// <returns>System.Numerics.Vector3 实例</returns>
    public static Vector3 NewVector3(cfg.vector3 v)
    {
        return new Vector3(v.X, v.Y, v.Z);
    }

    /// <summary>
    /// 将 cfg.vector4 转换为 System.Numerics.Vector4
    /// </summary>
    /// <param name="v">Luban 生成的 vector4 类型</param>
    /// <returns>System.Numerics.Vector4 实例</returns>
    public static Vector4 NewVector4(cfg.vector4 v)
    {
        return new Vector4(v.X, v.Y, v.Z, v.W);
    }
}