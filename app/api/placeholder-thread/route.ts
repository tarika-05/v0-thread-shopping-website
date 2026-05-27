import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const color = request.nextUrl.searchParams.get('color') || '#000000'
  const name = request.nextUrl.searchParams.get('name') || 'Thread'

  // Create a simple colored thread spool image using SVG
  const decodedColor = decodeURIComponent(color)
  const decodedName = decodeURIComponent(name)

  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="threadGradient">
          <stop offset="0%" style="stop-color:${decodedColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${decodedColor}cc;stop-opacity:0.7" />
        </radialGradient>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="400" fill="#faf8f3"/>
      
      <!-- Spool bottom -->
      <ellipse cx="200" cy="300" rx="80" ry="20" fill="#8B7355"/>
      
      <!-- Thread wrapped around spool -->
      <circle cx="200" cy="200" r="70" fill="url(#threadGradient)" stroke="#666" stroke-width="2"/>
      
      <!-- Spool top -->
      <ellipse cx="200" cy="100" rx="80" ry="20" fill="#A0826D"/>
      
      <!-- Thread shine -->
      <ellipse cx="170" cy="160" rx="30" ry="40" fill="white" opacity="0.3"/>
      
      <!-- Text -->
      <text x="200" y="350" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#1a1a1a">
        Premium Thread
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
