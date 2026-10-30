Add-Type -AssemblyName System.Drawing

$srcDir = "d:\Bevibe\assets\images\smib"
$pubDir = "d:\Bevibe\public\assets\images\smib"

if (!(Test-Path $pubDir)) {
    New-Item -ItemType Directory -Path $pubDir -Force | Out-Null
}

1..9 | ForEach-Object {
    $idx = $_
    $srcPath = Join-Path $srcDir "page_$idx.jpg"
    $outPath1 = Join-Path $srcDir "prod_$idx.jpg"
    $outPath2 = Join-Path $pubDir "prod_$idx.jpg"
    
    if (Test-Path $srcPath) {
        $img = [System.Drawing.Image]::FromFile($srcPath)
        $w = $img.Width
        $h = $img.Height
        Write-Host "Page $idx : $w x $h"
        
        # Product box: X=64, Y=280, W=624, H=624
        $rect = New-Object System.Drawing.Rectangle(64, 280, 624, 624)
        $bmp = New-Object System.Drawing.Bitmap(624, 624)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        
        $destRect = New-Object System.Drawing.Rectangle(0, 0, 624, 624)
        $g.DrawImage($img, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
        
        $g.Dispose()
        $img.Dispose()
        
        $bmp.Save($outPath1, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $bmp.Save($outPath2, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $bmp.Dispose()
        Write-Host "Saved prod_$idx.jpg"
    }
}
Write-Host "Done all 9 products!"
