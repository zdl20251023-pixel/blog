set WORKSPACE=..
set LUBAN_DLL=%WORKSPACE%\Tools\Luban\Luban.dll
set CONF_ROOT=.
set OUTPUT_DATA_DIR=%WORKSPACE%\..\..\config_table_data
set OUTPUT_CODE_DIR=%WORKSPACE%\..\..\config_table_code

dotnet %LUBAN_DLL% ^
    -t client ^
    -d json ^
    -c typescript-json ^
    --conf %CONF_ROOT%\luban.conf ^
    -x outputDataDir=%OUTPUT_DATA_DIR% ^
    -x outputCodeDir=%OUTPUT_CODE_DIR%
pause