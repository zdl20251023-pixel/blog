using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using Bright.Serialization;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using CfgCheck;
using System.Text.Json;

namespace CfgCheck
{
    [TestClass]
    public class ConfigSetUp
    {
        public static cfg.Tables Configs { get; set; }

        [AssemblyInitialize]
        public static void Initialize(TestContext testContext)
        {
            LoadConfig();
        }

        public static void LoadConfig()
        {
            Configs = new cfg.Tables(LoadJson);
        }

        /// <summary>
        /// 加载 JSON 配置文件
        /// </summary>
        /// <param name="file">文件名（不含扩展名）</param>
        /// <returns>JSON 元素</returns>
        private static JsonElement LoadJson(string file)
        {
            // 获取当前程序集所在目录，然后定位到 output_data 目录
            // 编译后的 DLL 在 bin/Debug/net8.0/ 目录下，需要返回到项目根目录
            var assemblyLocation = System.Reflection.Assembly.GetExecutingAssembly().Location;
            var assemblyDir = Path.GetDirectoryName(assemblyLocation);
            
            // 从 bin/Debug/net8.0/ 返回到项目根目录（CfgValidator）
            // .. -> bin/Debug/
            // .. -> bin/
            // .. -> 项目根目录（CfgValidator）
            var projectRoot = Path.GetFullPath(Path.Combine(assemblyDir, "..", "..", ".."));
            var configDir = Path.Combine(projectRoot, "output_data");
            
            var jsonPath = Path.Combine(configDir, file + ".json");
            
            if (!File.Exists(jsonPath))
            {
                throw new FileNotFoundException($"配置文件未找到: {jsonPath}。请确保已运行 Luban 生成配置数据。");
            }
            
            return JsonDocument.Parse(File.ReadAllBytes(jsonPath)).RootElement;
        }

        [AssemblyCleanup]
        public static void CleanUp()
        {
            Close();
        }

        public static void Init()
        {

        }

        public static void Close()
        {

        }

    }
}
