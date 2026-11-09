@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo MARZZELLI PERU CUEROS - ACTUALIZAR CATALOGO
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 generar_catalogo.py
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    python generar_catalogo.py
  ) else (
    echo ERROR: Instala Python 3 para usar este generador.
    echo Alternativamente, edita catalogo-fotos.js a mano.
  )
)
echo.
pause
