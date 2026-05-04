param([int]$Port = 8000, [string]$Root = (Get-Location).Path)

$mime = @{
  ".html"  = "text/html; charset=utf-8"
  ".css"   = "text/css; charset=utf-8"
  ".js"    = "application/javascript; charset=utf-8"
  ".mjs"   = "application/javascript; charset=utf-8"
  ".json"  = "application/json; charset=utf-8"
  ".svg"   = "image/svg+xml"
  ".png"   = "image/png"
  ".jpg"   = "image/jpeg"
  ".jpeg"  = "image/jpeg"
  ".ico"   = "image/x-icon"
  ".woff"  = "font/woff"
  ".woff2" = "font/woff2"
  ".ttf"   = "font/ttf"
  ".txt"   = "text/plain; charset=utf-8"
}

$Root = (Resolve-Path $Root).Path
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()
Write-Host "Space Intel by EVONA - dev server"
Write-Host "Serving $Root on http://localhost:$Port/"

while ($true) {
  $client = $listener.AcceptTcpClient()
  $stream = $client.GetStream()
  try {
    $stream.ReadTimeout = 3000
    $buf = New-Object byte[] 8192
    $n = $stream.Read($buf, 0, $buf.Length)
    $req = [System.Text.Encoding]::ASCII.GetString($buf, 0, $n)
    if ($req -match '^GET\s+(\S+)') {
      $path = [uri]::UnescapeDataString($matches[1].Split('?')[0])
      if ($path -eq "/") { $path = "/index.html" }
      $file = Join-Path $Root $path.TrimStart("/")
      if (Test-Path $file -PathType Leaf) {
        $bytes = [IO.File]::ReadAllBytes($file)
        $ext = [IO.Path]::GetExtension($file).ToLower()
        $ct = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
        $hdr = "HTTP/1.1 200 OK`r`nContent-Type: $ct`r`nCache-Control: no-cache`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
        $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
        $stream.Write($hdrBytes, 0, $hdrBytes.Length)
        $stream.Write($bytes, 0, $bytes.Length)
      } else {
        $body = "Not Found"
        $bb = [System.Text.Encoding]::ASCII.GetBytes($body)
        $hdr = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($bb.Length)`r`nConnection: close`r`n`r`n"
        $hb = [System.Text.Encoding]::ASCII.GetBytes($hdr)
        $stream.Write($hb, 0, $hb.Length)
        $stream.Write($bb, 0, $bb.Length)
      }
    }
  } catch {} finally { $client.Close() }
}
