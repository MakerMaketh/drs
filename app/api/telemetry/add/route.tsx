import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { decryptAES } from '@/components/encrypter';
import * as bip39 from 'bip39';


function generate4WordCombo(): string {
    const wordlist: string[] = bip39.wordlists.english;
    const randomWords: string[] = Array.from({ length: 4 }, () => {
        const randomIndex = Math.floor(Math.random() * wordlist.length);
        return wordlist[randomIndex];
    });
    return randomWords.join('-');
}

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
            return addBetEntry(body, network);
        }
        const encryptedBody = await request.text()
        const body = JSON.parse(decryptAES(encryptedBody));
        return addBetEntry(body, network);
    }
    catch (error) {
        console.error('Error processing POST request');
        return NextResponse.error();
    }
}

export async function DELETE(request: Request) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

async function addBetEntry(body: any, network: string) {
    const { depositTxn, payoutTxn, walletId, amount, outcome, choice, result } = body
    const createdAt = new Date().toISOString()

    if (!depositTxn || !walletId || !amount || !choice || !result) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
        // Fetch the last bet entry for the user (walletId)
        const { data: lastBets, error: fetchError } = await supabase
            .from('statistics')
            .select('winStreak, loseStreak, result')
            .eq('walletId', walletId)
            .eq('network', network)
            .order('createdAt', { ascending: false })
            .limit(1)

        if (fetchError) {
            throw new Error(fetchError.message)
        }

        let winStreak = 0
        let loseStreak = 0

        if (lastBets && lastBets.length > 0) {
            const { winStreak: lastWinStreak, loseStreak: lastLoseStreak } = lastBets[0]

            if (result === "WIN") {
                winStreak = lastWinStreak + 1
                loseStreak = 0
            } else {
                winStreak = 0
                loseStreak = lastLoseStreak + 1
            }
        }

        let identifier = generate4WordCombo();

        const { data, error } = await supabase
            .from('statistics')
            .insert([
                { identifier, createdAt, network, depositTxn, payoutTxn, walletId, amount, choice, outcome, result, winStreak, loseStreak }
            ])

        if (error) {
            throw new Error(error.message)
        }

        return NextResponse.json({ message: 'Bet entry added successfully' }, { status: 201 })
    } catch (error: unknown) {
        console.error('Error in addBetEntry:', error)
        if (error instanceof Error) {
            return NextResponse.json({ error: `Error adding bet entry: ${error.message}` }, { status: 500 })
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
        }
    }
}