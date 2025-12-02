import { getActiveBanner } from '@/lib/banner/banner-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const requestUrl = searchParams.get('url');

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (!requestUrl) {
        return NextResponse.json({ error: 'URL required' }, { status: 400, headers });
    }

    const activeBanner = await getActiveBanner(requestUrl);

    if (!activeBanner) {
        return NextResponse.json({ message: 'No banner found' }, { status: 404, headers });
    }

    return NextResponse.json(activeBanner, { headers });
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
    });
}
