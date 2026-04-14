# Iniciaur distribucion

1. Crear carpeta dist `pnpm build`
2. copiar la carpeta dist a la carpeta de distribucion
3. Luego de instalar poner habilitar puerto en el firewall `New-NetFirewallRule -DisplayName "MiServidorBackup 4000" -Direction Inbound -Protocol TCP -LocalPort 4000 -Action Allow`
