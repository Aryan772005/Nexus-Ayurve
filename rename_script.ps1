$files = @(
  'index.html',
  'server.ts',
  'metadata.json',
  'README.md',
  'src\components\Navbar.tsx',
  'src\components\Footer.tsx',
  'src\components\AuthModal.tsx',
  'src\components\FloatingChatButton.tsx',
  'src\components\FloatingWhatsAppButton.tsx',
  'src\pages\HomePage.tsx',
  'src\pages\DashboardPage.tsx',
  'src\pages\ChatPage.tsx',
  'src\pages\ShopPage.tsx',
  'src\pages\ToolsPage.tsx',
  'src\pages\DashboardPreview.tsx',
  'src\services\aiService.ts',
  'src\utils\generateInvoice.ts',
  'api\chat.ts'
)

foreach ($f in $files) {
  if (Test-Path $f) {
    $content = Get-Content $f -Raw -Encoding UTF8
    $new = $content `
      -replace 'AyurCare\+', 'Nexus Ayurve' `
      -replace 'Ayurcare\+', 'Nexus Ayurve' `
      -replace 'AyurCare', 'Nexus Ayurve' `
      -replace 'Ayurcare Chat', 'Nexus Ayurve Chat' `
      -replace '(?<!\+)Ayurcare(?!\+)', 'Nexus Ayurve'
    Set-Content $f $new -Encoding UTF8 -NoNewline
    Write-Host "Updated: $f"
  } else {
    Write-Host "NOT FOUND: $f"
  }
}
Write-Host "Done!"
