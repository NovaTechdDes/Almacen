; ==============================
; SETUP
; ==============================
[Setup]
AppName=ServidorAlmacen
AppVersion=3.0.2
DefaultDirName={commonappdata}\ServidorAlmacen
DefaultGroupName=ServidorAlmacen
OutputDir=output
OutputBaseFilename=Instalador_ServidorAlmacen
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64

; ==============================
; FILES
; ==============================
[Files]
Source: "nssm.exe"; DestDir: "{app}"
Source: "node-v24.14.1-x64.msi"; DestDir: "{tmp}"
Source: "..\package.json"; DestDir: "{app}"
Source: "backend\*"; DestDir: "{app}"; Flags: recursesubdirs; AfterInstall: CrearEnv

; ==============================
; DIRECTORIOS
; ==============================
[Dirs]
Name: "{app}\logs"

; ==============================
; INSTALAR NODE SILENCIOSO
; ==============================
[Run]
Filename: "msiexec.exe"; Parameters: "/i ""{tmp}\node-v24.14.1-x64.msi"" /qn"; StatusMsg: "Instalando Node.js..."; Flags: waituntilterminated
Filename: "cmd.exe"; Parameters: "/C ""{pf}\nodejs\npm.cmd"" install --omit=dev"; WorkingDir: "{app}"; StatusMsg: "Instalando dependencias..."; Flags: waituntilterminated

; Instalar servicio con NSSM
Filename: "{app}\nssm.exe"; Parameters: "install MiServidorBackup ""C:\Program Files\nodejs\node.exe"" ""{app}\dist\server.js"""; Flags: runhidden waituntilterminated

; Directorio de trabajo
Filename: "{app}\nssm.exe"; Parameters: "set MiServidorBackup AppDirectory ""{app}"""; Flags: runhidden waituntilterminated

; Logs
Filename: "{app}\nssm.exe"; Parameters: "set MiServidorBackup AppStdout ""{app}\logs\output.log"""; Flags: runhidden waituntilterminated
Filename: "{app}\nssm.exe"; Parameters: "set MiServidorBackup AppStderr ""{app}\logs\error.log"""; Flags: runhidden waituntilterminated

; Inicio automatico
Filename: "{app}\nssm.exe"; Parameters: "set MiServidorBackup Start SERVICE_AUTO_START"; Flags: runhidden waituntilterminated

; Iniciar servicio
Filename: "{app}\nssm.exe"; Parameters: "start MiServidorBackup"; Flags: runhidden waituntilterminated

; ==============================
; DESINSTALAR
; ==============================
[UninstallRun]
Filename: "{app}\nssm.exe"; Parameters: "stop MiServidorBackup"; Flags: runhidden waituntilterminated
Filename: "{app}\nssm.exe"; Parameters: "remove MiServidorBackup confirm"; Flags: runhidden waituntilterminated

[Code]
var
  DBPage: TInputQueryWizardPage;
  ConfigPage: TInputQueryWizardPage;

procedure InitializeWizard;
begin
  DBPage := CreateInputQueryPage(wpWelcome, 'Configuración de Base de Datos', 'Ingrese el nombre de la base de datos', 'Este valor se guardará en el archivo .env del sistema.');
  DBPage.Add('DB_NAME:', False);
  DBPage.Add('IMAGE_URL:', False);

  ConfigPage := CreateInputQueryPage(wpWelcome, 'Configuración de Base de Datos', 'Ingrese los datos de conexion', 'Estos valor se guardará en el archivo .env del sistema.');
  ConfigPage.Add('DB_USER:', False);
  ConfigPage.Add('DB_PASSWORD:', False);
  ConfigPage.Add('DB_HOST:', False);
  ConfigPage.Add('DB_PORT:', False);

  // Valor Por defecto
  ConfigPage.Values[0] := 'sa';
  ConfigPage.Values[1] := '1234';
  ConfigPage.Values[2] := 'localhost';
  ConfigPage.Values[3] := '3000';
end;

procedure CrearEnv;
var
  EnvFile: string;
  EnvContent: string;
begin
  EnvFile := ExpandConstant('{app}\.env');
  EnvContent := 'DB_NAME=' + DBPage.Values[0] + #13#10 +
                'IMAGE_URL=' + DBPage.Values[1] + #13#10 +
                'DB_USER=' + ConfigPage.Values[0] + #13#10 +
                'DB_PASSWORD=' + ConfigPage.Values[1] + #13#10 +
                'DB_HOST=' + ConfigPage.Values[2] + #13#10 +
                'PORT=' + ConfigPage.Values[3] + #13#10 + 
                'DB_PORT=1433';
  SaveStringToFile(EnvFile, EnvContent, False);
end;