@echo off
:: === CONFIGURATION ===
set DB_HOST=metro.proxy.rlwy.net
set DB_PORT=58824
set DB_USER=root
set DB_NAME=railway
set DB_PASS=LeJAfeqvzcnhGPeIjCccrXplYqXQTNjG
set BACKUP_DIR=C:\Users\YOU\Documents\Triple_A\backups

:: === CREATE TIMESTAMP ===
for /f "tokens=2 delims==" %%I in ('"wmic os get localdatetime /value"') do set datetime=%%I
set DATESTAMP=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%

:: === RUN BACKUP ===
echo Backing up database %DB_NAME%...
set BACKUP_FILE=%BACKUP_DIR%\%DB_NAME%_backup_%DATESTAMP%.sql

set MYSQL_PWD=%DB_PASS%
mysqldump -h %DB_HOST% -P %DB_PORT% -u %DB_USER% %DB_NAME% > "%BACKUP_FILE%"

:: === COMPRESS THE BACKUP ===
powershell Compress-Archive -Path "%BACKUP_FILE%" -DestinationPath "%BACKUP_FILE%.zip"
del "%BACKUP_FILE%"

:: === KEEP ONLY LATEST 5 BACKUPS ===
for /f "skip=5 delims=" %%F in ('dir "%BACKUP_DIR%\%DB_NAME%_backup_*.zip" /b /o-d') do del "%BACKUP_DIR%\%%F"

echo ✅ Backup complete! File saved as: %BACKUP_FILE%.zip
pause
