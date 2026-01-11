set WORKSPACE=..
set LUBAN_DLL=%WORKSPACE%\Tools\Luban\Luban.dll
set CONF_ROOT=.
set OUTPUT_DATA_DIR=%WORKSPACE%\..\..\config_table_data
set OUTPUT_CODE_DIR=%WORKSPACE%\..\..\config_table_code
set L10N_FILE=%WORKSPACE%\MiniTemplate\Datas\#demo.lang.xlsx

dotnet %LUBAN_DLL% ^
    -t client ^
    -d json ^
    -c typescript-json ^
    --conf %CONF_ROOT%\luban.conf ^
    -x outputDataDir=%OUTPUT_DATA_DIR% ^
    -x outputCodeDir=%OUTPUT_CODE_DIR% ^
    -x l10n.provider=default ^
    -x "l10n.textFile.path=%L10N_FILE%" ^
    -x l10n.textFile.keyFieldName=key
pause