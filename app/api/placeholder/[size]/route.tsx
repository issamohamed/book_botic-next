import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { size: string } }
) {
    const [width, height] = params.size.split('x').map(Number);
    
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
        <svg width="${width}" height="${height}" version="1.1" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${width}" height="${height}" fill="#6d2e2e"/>
            <text 
                x="50%" 
                y="50%" 
                dominant-baseline="middle" 
                text-anchor="middle" 
                fill="#f2e1e1" 
                font-family="system-ui, -apple-system, sans-serif" 
                font-size="16px"
            >
                No Cover
            </text>
        </svg>`;

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000, immutable'
        }
    });
}