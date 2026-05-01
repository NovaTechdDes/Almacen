# Ejecutar build para probar en tablet android

1. `npx expo prebuild`
2. Ejecutar `npx expo run:android`

# Verificar que no hay errores

1. `npx expo-doctor`
2. `npx expo install --check`

# Subir a produccion

1. ejecutar `eas build:configure`
2. ejecutar `eas build --platform android --profile production`

# Subir Actualizacion

1. Ejecutar `eas update --channel preview --message ""`

# Configurar Variables de entorno

1. Ejecutar `eas env:create`
