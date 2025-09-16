#!/bin/bash

# Script para configurar GitHub Actions
# Ejecutar: chmod +x scripts/setup-github-actions.sh && ./scripts/setup-github-actions.sh

echo "🚀 Configurando GitHub Actions para Cat Lovers Paradise..."

# Verificar que estamos en un repositorio Git
if [ ! -d ".git" ]; then
    echo "❌ Error: No estás en un repositorio Git"
    exit 1
fi

# Verificar que GitHub CLI está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI no está instalado"
    echo "Instala desde: https://cli.github.com/"
    exit 1
fi

# Verificar autenticación con GitHub
if ! gh auth status &> /dev/null; then
    echo "❌ Error: No estás autenticado con GitHub"
    echo "Ejecuta: gh auth login"
    exit 1
fi

echo "✅ Verificaciones completadas"

# Crear archivo de configuración de secrets
cat > .github/secrets-template.md << 'EOF'
# GitHub Secrets Template

Configura los siguientes secrets en tu repositorio:

## Base de Datos
- `DB_HOST`: Host de la base de datos
- `DB_USER`: Usuario de la base de datos  
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_NAME`: Nombre de la base de datos

## Servidores
- `STAGING_HOST`: IP del servidor de staging
- `STAGING_USERNAME`: Usuario SSH para staging
- `STAGING_SSH_KEY`: Clave SSH privada para staging
- `STAGING_PORT`: Puerto SSH para staging (default: 22)
- `PRODUCTION_HOST`: IP del servidor de producción
- `PRODUCTION_USERNAME`: Usuario SSH para producción
- `PRODUCTION_SSH_KEY`: Clave SSH privada para producción
- `PRODUCTION_PORT`: Puerto SSH para producción (default: 22)
- `PRODUCTION_URL`: URL de producción para health checks

## FTP (Opcional)
- `FTP_SERVER`: Servidor FTP
- `FTP_USERNAME`: Usuario FTP
- `FTP_PASSWORD`: Contraseña FTP
- `FTP_SERVER_DIR`: Directorio en el servidor FTP

## Notificaciones
- `SLACK_WEBHOOK`: URL del webhook de Slack
- `EMAIL_USERNAME`: Usuario de email para notificaciones
- `EMAIL_PASSWORD`: Contraseña de email
- `ADMIN_EMAIL`: Email del administrador

## Seguridad
- `SNYK_TOKEN`: Token de Snyk para escaneo de vulnerabilidades

## Cómo configurar secrets:
1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. New repository secret
4. Agrega cada secret con su valor correspondiente
EOF

echo "📝 Template de secrets creado en .github/secrets-template.md"

# Crear script de validación de secrets
cat > scripts/validate-secrets.sh << 'EOF'
#!/bin/bash

# Script para validar que todos los secrets estén configurados
echo "🔍 Validando configuración de secrets..."

required_secrets=(
    "DB_HOST"
    "DB_USER" 
    "DB_PASSWORD"
    "DB_NAME"
    "STAGING_HOST"
    "STAGING_USERNAME"
    "STAGING_SSH_KEY"
    "PRODUCTION_HOST"
    "PRODUCTION_USERNAME"
    "PRODUCTION_SSH_KEY"
    "PRODUCTION_URL"
)

missing_secrets=()

for secret in "${required_secrets[@]}"; do
    if ! gh secret list | grep -q "$secret"; then
        missing_secrets+=("$secret")
    fi
done

if [ ${#missing_secrets[@]} -eq 0 ]; then
    echo "✅ Todos los secrets requeridos están configurados"
else
    echo "❌ Faltan los siguientes secrets:"
    for secret in "${missing_secrets[@]}"; do
        echo "  - $secret"
    done
    echo ""
    echo "Configura los secrets faltantes en GitHub:"
    echo "https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name")/settings/secrets/actions"
fi
EOF

chmod +x scripts/validate-secrets.sh

echo "✅ Script de validación creado en scripts/validate-secrets.sh"

# Crear script de test de workflows
cat > scripts/test-workflows.sh << 'EOF'
#!/bin/bash

# Script para probar workflows localmente
echo "🧪 Probando workflows localmente..."

# Instalar act (herramienta para ejecutar GitHub Actions localmente)
if ! command -v act &> /dev/null; then
    echo "📦 Instalando act..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install act
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
    else
        echo "❌ Sistema operativo no soportado para act"
        exit 1
    fi
fi

echo "✅ act instalado"

# Crear archivo .secrets para act
cat > .secrets << 'EOF2'
# Secrets para testing local
DB_HOST=localhost
DB_USER=test
DB_PASSWORD=test
DB_NAME=test
STAGING_HOST=localhost
STAGING_USERNAME=test
STAGING_SSH_KEY=test
STAGING_PORT=22
PRODUCTION_HOST=localhost
PRODUCTION_USERNAME=test
PRODUCTION_SSH_KEY=test
PRODUCTION_PORT=22
PRODUCTION_URL=http://localhost:3000
SLACK_WEBHOOK=
EMAIL_USERNAME=
EMAIL_PASSWORD=
ADMIN_EMAIL=admin@example.com
SNYK_TOKEN=
EOF2

echo "📝 Archivo .secrets creado para testing local"

# Ejecutar workflow de CI
echo "🚀 Ejecutando workflow de CI..."
act -j test

echo "✅ Testing completado"
EOF

chmod +x scripts/test-workflows.sh

echo "✅ Script de test creado en scripts/test-workflows.sh"

# Crear .gitignore para secrets
if ! grep -q ".secrets" .gitignore; then
    echo "" >> .gitignore
    echo "# GitHub Actions local testing" >> .gitignore
    echo ".secrets" >> .gitignore
    echo "*.env.local" >> .gitignore
fi

echo "✅ .gitignore actualizado"

# Mostrar resumen
echo ""
echo "🎉 ¡Configuración de GitHub Actions completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura los secrets en GitHub:"
echo "   https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name")/settings/secrets/actions"
echo ""
echo "2. Valida la configuración:"
echo "   ./scripts/validate-secrets.sh"
echo ""
echo "3. Prueba los workflows localmente:"
echo "   ./scripts/test-workflows.sh"
echo ""
echo "4. Haz push a main para activar CI/CD:"
echo "   git add ."
echo "   git commit -m 'feat: add GitHub Actions workflows'"
echo "   git push origin main"
echo ""
echo "📚 Documentación completa en .github/README.md"
