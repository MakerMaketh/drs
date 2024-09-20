import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { decryptAES } from '@/components/encrypter';


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_KEY || ''
)

export async function GET(request: Request) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}


export async function POST(request: Request) {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const network = searchParams.get('network') || 'mainnet'

    try {
        if (action === "prettyplease") {
            const body = await request.json()
            return updateLeaderboard(body, network);
        }
        const encryptedBody = await request.text()
        const body = JSON.parse(decryptAES(encryptedBody));
        return updateLeaderboard(body, network);
    }
    catch (error) {
        console.error('Error processing POST request');
        return NextResponse.error();
    }
}

export async function DELETE(request: Request) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}


async function updateLeaderboard(body: any, network: string) {
    const { walletId, amount, result } = body
    const leaderboardTable = network === 'mainnet' ? 'leaderboard' : 'devnetleaderboard';

    if (!walletId || !amount || !result) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch existing leaderboard entry for the wallet
    const { data: leaderboardData, error: leaderboardError } = await supabase
        .from(leaderboardTable)
        .select('*')
        .eq('walletId', walletId)
        .single();

    if (leaderboardError && leaderboardError.code !== 'PGRST116') {
        throw new Error(leaderboardError.message);
    }

    const newWageredAmount = (leaderboardData?.WageredAmount || 0) + amount;
    let newWins = leaderboardData?.wins || 0;
    let newLoses = leaderboardData?.loses || 0;
    let newWinAmount = leaderboardData?.WinAmount || 0;
    let newLossAmount = leaderboardData?.LossAmount || 0;

    if (result === "WIN") {
        newWins += 1;
        newWinAmount += amount;
    } else {
        newLoses += 1;
        newLossAmount += amount;
    }

    // Upsert leaderboard entry
    const { data: upsertData, error: upsertError } = await supabase
        .from(leaderboardTable)
        .upsert({
            walletId,
            wagers: (leaderboardData?.wagers || 0) + 1,
            wins: newWins,
            loses: newLoses,
            WageredAmount: newWageredAmount,
            WinAmount: newWinAmount,
            LossAmount: newLossAmount
        });

    if (upsertError) {
        throw new Error(upsertError.message);
    }

    return NextResponse.json({ message: 'Leaderboard entry updated successfully' }, { status: 200 })
}
