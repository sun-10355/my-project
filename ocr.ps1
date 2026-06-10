Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]

Function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}

[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.Streams.FileRandomAccessStream, Windows.Foundation, ContentType = WindowsRuntime] | Out-Null

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()

if ($null -eq $engine) {
    # Try with Chinese language
    $availableLangs = [Windows.Media.Ocr.OcrEngine]::AvailableRecognizerLanguages
    if ($availableLangs.Count -gt 0) {
        $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($availableLangs[0])
    }
}

if ($null -eq $engine) {
    Write-Output "ERROR: No OCR engine available"
    exit 1
}

Write-Output "OCR Engine: $($engine.RecognizerLanguage.DisplayName)"

$path = "c:\Users\10355\Desktop\my-project\1.jpg"

$fileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($path)
$file = Await $fileTask ([Windows.Storage.StorageFile])

$streamTask = [Windows.Storage.Streams.FileRandomAccessStream]::OpenAsync($path, [Windows.Storage.FileAccessMode]::Read)
$stream = Await $streamTask ([Windows.Storage.Streams.FileRandomAccessStream])

$decoderTask = [Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)
$decoder = Await $decoderTask ([Windows.Graphics.Imaging.BitmapDecoder])

$bitmapTask = $decoder.GetSoftwareBitmapAsync()
$bitmap = Await $bitmapTask ([Windows.Graphics.Imaging.SoftwareBitmap])

$convertedBitmap = [Windows.Graphics.Imaging.SoftwareBitmap]::Convert($bitmap, [Windows.Graphics.Imaging.BitmapPixelFormat]::Bgra8, [Windows.Graphics.Imaging.BitmapAlphaMode]::Premultiplied)

$resultTask = $engine.RecognizeAsync($convertedBitmap)
$result = Await $resultTask ([Windows.Media.Ocr.OcrResult])

foreach ($line in $result.Lines) {
    $lineText = ""
    foreach ($word in $line.Words) {
        $lineText += $word.Text
    }
    Write-Output "LINE: $lineText"
}
