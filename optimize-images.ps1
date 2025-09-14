# Script para optimizar imágenes mayores a 500KB
# Usa .NET System.Drawing para redimensionar y comprimir imágenes

Add-Type -AssemblyName System.Drawing

# Función para optimizar una imagen
function Optimize-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$MaxWidth = 1200,
        [int]$Quality = 85
    )
    
    try {
        # Cargar la imagen original
        $originalImage = [System.Drawing.Image]::FromFile($InputPath)
        
        # Calcular nuevas dimensiones manteniendo la proporción
        $ratio = [Math]::Min($MaxWidth / $originalImage.Width, $MaxWidth / $originalImage.Height)
        $newWidth = [Math]::Round($originalImage.Width * $ratio)
        $newHeight = [Math]::Round($originalImage.Height * $ratio)
        
        # Crear nueva imagen redimensionada
        $newImage = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($newImage)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        
        # Dibujar la imagen redimensionada
        $graphics.DrawImage($originalImage, 0, 0, $newWidth, $newHeight)
        
        # Configurar parámetros de compresión
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        
        # Obtener el codec JPEG
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageDecoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
        
        # Guardar la imagen optimizada
        if ($InputPath.ToLower().EndsWith('.png')) {
            # Para PNG, usar calidad 90%
            $pngCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageDecoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Png.Guid }
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90)
            $newImage.Save($OutputPath, $pngCodec, $encoderParams)
        } else {
            # Para JPG, usar calidad especificada
            $newImage.Save($OutputPath, $jpegCodec, $encoderParams)
        }
        
        # Limpiar recursos
        $graphics.Dispose()
        $newImage.Dispose()
        $originalImage.Dispose()
        
        return $true
    }
    catch {
        Write-Host "Error optimizando $InputPath : $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Crear carpeta de backup
$backupDir = "image-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Carpeta de backup creada: $backupDir" -ForegroundColor Green

# Buscar todas las imágenes mayores a 500KB
$images = Get-ChildItem "." -Recurse -File -Include "*.jpg","*.jpeg","*.png","*.webp","*.gif","*.bmp" | Where-Object { $_.Length -gt 500KB }

Write-Host "`nEncontradas $($images.Count) imágenes para optimizar:" -ForegroundColor Yellow

$totalOriginalSize = 0
$totalOptimizedSize = 0
$optimizedCount = 0

foreach ($image in $images) {
    $originalSizeKB = [Math]::Round($image.Length / 1KB, 2)
    $originalSizeMB = [Math]::Round($image.Length / 1MB, 2)
    $totalOriginalSize += $image.Length
    
    Write-Host "`nProcesando: $($image.Name) ($originalSizeKB KB / $originalSizeMB MB)" -ForegroundColor Cyan
    
    # Crear backup
    $backupPath = Join-Path $backupDir $image.Name
    Copy-Item $image.FullName $backupPath -Force
    
    # Optimizar imagen
    $tempPath = $image.FullName + ".tmp"
    $success = Optimize-Image -InputPath $image.FullName -OutputPath $tempPath
    
    if ($success) {
        # Reemplazar original con optimizada
        Move-Item $tempPath $image.FullName -Force
        
        $optimizedSizeKB = [Math]::Round($image.Length / 1KB, 2)
        $optimizedSizeMB = [Math]::Round($image.Length / 1MB, 2)
        $savings = [Math]::Round((($originalSizeKB - $optimizedSizeKB) / $originalSizeKB) * 100, 1)
        
        $totalOptimizedSize += $image.Length
        $optimizedCount++
        
        Write-Host "  [OK] Optimizada: $optimizedSizeKB KB ($optimizedSizeMB MB) - Ahorro: $savings%" -ForegroundColor Green
    } else {
        Write-Host "  [ERROR] Error en la optimizacion" -ForegroundColor Red
    }
}

# Resumen final
$totalOriginalSizeMB = [Math]::Round($totalOriginalSize / 1MB, 2)
$totalOptimizedSizeMB = [Math]::Round($totalOptimizedSize / 1MB, 2)
$totalSavings = [Math]::Round((($totalOriginalSize - $totalOptimizedSize) / $totalOriginalSize) * 100, 1)

Write-Host "`n" + "="*60 -ForegroundColor Yellow
Write-Host "RESUMEN DE OPTIMIZACIÓN" -ForegroundColor Yellow
Write-Host "="*60 -ForegroundColor Yellow
Write-Host "Imágenes procesadas: $optimizedCount de $($images.Count)" -ForegroundColor White
Write-Host "Tamaño original: $totalOriginalSizeMB MB" -ForegroundColor White
Write-Host "Tamaño optimizado: $totalOptimizedSizeMB MB" -ForegroundColor White
Write-Host "Ahorro total: $totalSavings% ($([Math]::Round(($totalOriginalSize - $totalOptimizedSize) / 1MB, 2)) MB)" -ForegroundColor Green
Write-Host "Backup guardado en: $backupDir" -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Yellow

Write-Host "`n[COMPLETADO] Optimizacion finalizada!" -ForegroundColor Green
