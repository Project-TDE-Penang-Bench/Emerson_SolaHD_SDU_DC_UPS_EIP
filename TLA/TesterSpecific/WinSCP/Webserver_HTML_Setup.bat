@echo off
%1\WinSCP.exe /console /parameter %2 %3 %4 %5 /script=Webserver_HTML_Setup.script

set WINSCP_RESULT=%ERRORLEVEL%
if %WINSCP_RESULT% equ 0 (
  echo Success
) else (
  echo Error
)

exit /b %WINSCP_RESULT%