@echo off
set WORKSPACE=..\..

set LUBAN_DLL=%WORKSPACE%\Tools\Luban\Luban.dll
set CONF_ROOT=%WORKSPACE%\MiniTemplate
set TextFile=%WORKSPACE%\MiniTemplate\Datas\#demo.lang.xlsx

echo 正在生成配置代码和数据...
dotnet %LUBAN_DLL% -t all -c cs-dotnet-json -d json --conf %CONF_ROOT%\luban.conf -x outputCodeDir=output_code -x outputDataDir=output_data -x l10n.provider=default -x l10n.textFile.path=%TextFile% -x l10n.textFile.keyFieldName=key

if %ERRORLEVEL% NEQ 0 (
    echo Luban 代码生成失败！
    pause
    exit /b %ERRORLEVEL%
)

echo 正在运行单元测试...
dotnet test -v m

pause