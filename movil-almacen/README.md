# Ejecutar build para probar en tablet android

1. `pnpm expo prebuild`
2. Ejecutar `pnpm expo run:android`

# Verificar que no hay errores

1. `pnpm dlx expo-doctor`
2. `pnpm dlx expo install --check`

# Subir a produccion

1. ejecutar `eas build:configure`
2. ejecutar `eas build --platform android --profile production`

# Subir Actualizacion

1. Ejecutar `eas update --channel preview --message ""`

# Configurar Variables de entorno

1. Ejecutar `eas env:create`
