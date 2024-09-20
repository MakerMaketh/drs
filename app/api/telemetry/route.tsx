import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function POST(request: Request) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function DELETE(request: Request) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
