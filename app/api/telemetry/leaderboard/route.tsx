import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const network = searchParams.get('network') || 'mainnet'
    const limit = parseInt(searchParams.get('limit') || '100')
    const currentPage = parseInt(searchParams.get('page') || '1')
    const offset = (currentPage - 1) * limit
    let type = searchParams.get('type') || 'wagers'
    const sort = searchParams.get('sort') || 'desc'

    const getCol = (value: string) => {
        switch (value) {
            case 'wagers': return 'WageredAmount';
            case 'wins': return 'WinAmount';
            case 'loses': return 'LossAmount';
            default: return 'WageredAmount';
        }
    };

    // Ensure valid type and sort values
    const validTypes = ['wagers', 'wins', 'loses']
    const validSorts = ['asc', 'desc']

    if (!validTypes.includes(type)) {
        return NextResponse.json({ error: 'Invalid type query parameter' }, { status: 400 })
    }

    if (!validSorts.includes(sort)) {
        return NextResponse.json({ error: 'Invalid sort query parameter' }, { status: 400 })
    }

    type = getCol(type);

    const leaderboardTable = network === 'mainnet' ? 'leaderboard' : 'devnetleaderboard'

    try {
        const { data, error, count } = await supabase
            .from(leaderboardTable)
            .select('*', { count: 'exact' }) // 'exact' returns the total count of records
            .order(type, { ascending: sort === 'asc' }) // Sort based on 'type' and 'sort'
            .range(offset, offset + limit - 1) // Fetch records within the current page range

        if (error) {
            throw new Error(error.message)
        }

        // Calculate total pages based on the total count and items per page
        const totalPages = Math.ceil((count || 0) / limit)
        const totalItems = count || 0 // Use the count provided by Supabase

        return NextResponse.json({
            data,          // Data for the current page
            totalItems,    // Total number of records in the table
            totalPages,    // Total number of pages
            currentPage,   // Current page number
            offset,        // Offset used for pagination
            limit          // Limit per page
        })

    } catch (error: unknown) {
        console.error('Error in /leaderboard:', error)
        if (error instanceof Error) {
            return NextResponse.json({ error: `Error fetching leaderboard: ${error.message}` }, { status: 500 })
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
        }
    }
}

export async function POST(request: Request) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function DELETE(request: Request) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
