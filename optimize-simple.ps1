# Script simple para optimizar imagenes
Add-Type -AssemblyName System.Drawing

# Crear backup
$backupDir = "image-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "Backup creado en: $backupDir"

# Buscar imagenes grandes
$images = Get-ChildItem "." -Recurse -File -Include "*.jpg","*.jpeg","*.png" | Where-Object { $_.Length -gt 500KB }

Write-Host "Encontradas $($images.Count) imagenes para optimizar"

$totalOriginal = 0
$totalOptimized = 0
$count = 0

foreach ($image in $images) {
    $originalSize = [Math]::Round($image.Length / 1KB, 2)
    $totalOriginal += $image.Length
    
    Write-Host "Procesando: $($image.Name) ($originalSize KB)"
    
    # Backup
    $backupPath = Join-Path $backupDir $image.Name
    Copy-Item $image.FullName $backupPath -Force
    
    try {
        # Cargar imagen
        $originalImage = [System.Drawing.Image]::FromFile($image.FullName)
        
        # Calcular nuevas dimensiones
        $maxWidth = 1200
        $ratio = [Math]::Min($maxWidth / $originalImage.Width, $maxWidth / $originalImage.Height)
        $newWidth = [Math]::Round($originalImage.Width * $ratio)
        $newHeight = [Math]::Round($originalImage.Height * $ratio)
        
        # Crear nueva imagen
        $newImage = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($newImage)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        
        # Dibujar redimensionada
        $graphics.DrawImage($originalImage, 0, 0, $newWidth, $newHeight)
        
        # Configurar compresion
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $quality = if ($image.Extension -eq '.png') { 90 } else { 85 }
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)
        
        # Obtener codec
        $codec = if ($image.Extension -eq '.png') {
            [System.Drawing.Imaging.ImageCodecInfo]::GetImageDecoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Png.Guid }
        } else {
            [System.Drawing.Imaging.ImageCodecInfo]::GetImageDecoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
        }
        
        # Guardar optimizada
        $newImage.Save($image.FullName, $codec, $encoderParams)
        
        # Limpiar
        $graphics.Dispose()
        $newImage.Dispose()
        $originalImage.Dispose()
        
        $optimizedSize = [Math]::Round($image.Length / 1KB, 2)
        $savings = [Math]::Round((($originalSize - $optimizedSize) / $originalSize) * 100, 1)
        
        $totalOptimized += $image.Length
        $count++
        
        Write-Host "  OK: $optimizedSize KB - Ahorro: $savings%"
    }
    catch {
        Write-Host "  ERROR: $($_.Exception.Message)"
    }
}

# Resumen
$originalMB = [Math]::Round($totalOriginal / 1MB, 2)
$optimizedMB = [Math]::Round($totalOptimized / 1MB, 2)
$savingsTotal = [Math]::Round((($totalOriginal - $totalOptimized) / $totalOriginal) * 100, 1)

Write-Host "`nRESUMEN:"
Write-Host "Imagenes procesadas: $count de $($images.Count)"
Write-Host "Tamaño original: $originalMB MB"
Write-Host "Tamaño optimizado: $optimizedMB MB"
Write-Host "Ahorro total: $savingsTotal%"
Write-Host "Backup en: $backupDir"
Write-Host "Optimizacion completada!"
