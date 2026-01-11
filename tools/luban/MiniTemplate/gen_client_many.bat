set WORKSPACE=..
set LUBAN_DLL=%WORKSPACE%\Tools\Luban\Luban.dll
set CONF_ROOT=.

dotnet %LUBAN_DLL% ^
    -t client ^
    -d json ^
    -d lua ^
    -c typescript-json ^
    -c cs-simple-json ^
    --conf %CONF_ROOT%\luban.conf ^
    -x json.outputDataDir=output_data_json ^
    -x lua.outputDataDir=output_data_lua ^
    -x typescript-json.outputCodeDir=output_code_typescript ^
    -x cs-simple-json.outputCodeDir=output_code_cs
pause