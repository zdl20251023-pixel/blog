using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;

namespace CfgCheck.Modules
{
    /// <summary>
    /// TbTest 配置表的验证类
    /// 用于验证 Test 表内部字段的合法性
    /// </summary>
    [TestClass]
    public class Test
    {
        /// <summary>
        /// 验证 TbTest 配置表中每个条目的 x1 列表长度与 x2 列表长度是否相等
        /// </summary>
        [TestMethod]
        public void Check_X1_X2_LengthMatch()
        {
            var testConfigList = ConfigSetUp.Configs.TbTest.DataList;
            
            foreach (var testItem in testConfigList)
            {
                var x1Count = testItem.X1?.Count ?? 0;
                var x2Count = testItem.X2?.Count ?? 0;
                
                Assert.AreEqual(
                    x1Count, 
                    x2Count, 
                    $"TbTest 配置错误: id={testItem.Id}, name={testItem.Name}, x1列表长度({x1Count})与x2列表长度({x2Count})不相等"
                );
            }
        }
    }
}

