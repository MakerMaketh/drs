import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    try {
        return getEntries(searchParams)
    } catch (error) {
        console.error('Error processing GET request:', error);
        return NextResponse.error();
    }
}

export async function POST(request: Request) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function DELETE(request: Request) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

async function getEntries(searchParams: URLSearchParams) {
    const startTime = searchParams.get('startTime')
    const walletId = searchParams.get('walletId')
    const limit = parseInt(searchParams.get('limit') || '100')
    const currentPage = parseInt(searchParams.get('page') || '1')
    const offset = (currentPage - 1) * limit
    const network = searchParams.get('network') || 'mainnet'

    try {
        let query = supabase
            .from('statistics')
            .select('*', { count: 'exact' })
            .eq('network', network)
            .order('createdAt', { ascending: false })
            .range(offset, offset + limit - 1);

        if (startTime) {
            query = query.gt('createdAt', startTime)
        }

        if (walletId) {
            query = query.eq('walletId', walletId)
        }

        const { data, error, count } = await query

        if (error) {
            throw new Error(error.message)
        }

        const totalPages = Math.ceil((count || 0) / limit)
        const totalItems = count || 0

        return NextResponse.json({
            data,
            totalItems,
            totalPages,
            currentPage,
            offset,
            limit
        })
    } catch (error: unknown) {
        console.error('Error in getEntries:', error)
        if (error instanceof Error) {
            return NextResponse.json({ error: `Error fetching entries: ${error.message}` }, { status: 500 })
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
        }
    }
}
