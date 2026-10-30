Add-Type -AssemblyName System.Drawing

$page0 = "d:\Bevibe\assets\images\smib\page_0.jpg"
$img = [System.Drawing.Image]::FromFile($page0)

# The 3 products triptych is roughly from X=95, Y=820, W=1000, H=325
$rect = New-Object System.Drawing.Rectangle(95, 820, 1000, 325)
$bmp = New-Object System.Drawing.Bitmap(1000, 325)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$destRect = New-Object System.Drawing.Rectangle(0, 0, 1000, 325)
$g.DrawImage($img, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)

$bmp.Save("d:\Bevibe\assets\images\smib-banner.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Save("d:\Bevibe\public\assets\images\smib-banner.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Host "smib-banner.jpg created!"
