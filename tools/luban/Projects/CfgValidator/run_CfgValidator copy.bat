set WORKSPACE=..\..

set LUBAN_DLL=%WORKSPACE%\Tools\Luban\Luban.dll
set CONF_ROOT=%WORKSPACE%\MiniTemplate
set TextFile=%WORKSPACE%\MiniTemplate\Datas|#demo.lang.xlsx

dotnet %LUBAN_DLL% ^
    -t all ^
    -c typescript-json ^
    -d json  ^
    --conf %CONF_ROOT%\luban.conf ^
    -x outputCodeDir=output_code ^
    -x outputDataDir=output_data ^
    -x pathValidator.rootDir=%WORKSPACE%\Projects\TypeScript_NodeJs_json ^
    -x l10n.provider=default ^
    -x l10n.textFile.path=%TextFile% ^
    -x l10n.textFile.keyFieldName=key


dotnet test -v m
pause