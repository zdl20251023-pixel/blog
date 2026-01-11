set WORKSPACE=..
set LUBAN_DLL=%WORKSPACE%\Tools\Luban\Luban.dll
set CONF_ROOT=.

dotnet %LUBAN_DLL% ^
    -t server ^
    -d json ^
    --conf %CONF_ROOT%\luban.conf ^
    -x outputDataDir=output_data ^
    -x outputCodeDir=output_code

pause