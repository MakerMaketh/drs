// app/api/rpc/route.ts
import { NextResponse } from 'next/server';

const API_KEYS: string[] = process.env.NEXT_PUBLIC_HELIOS_API_KEYS?.split(',') || [];

const getRandomApiKey = () => {
    const randomIndex = Math.floor(Math.random() * API_KEYS.length);
    return API_KEYS[randomIndex];
};

export async function GET(request: Request) {
    const apiKey = getRandomApiKey();

    try {
        const response = await fetch(`https://soldevnet.amalgum.workers.dev/?api-key=${apiKey}`);
        const data = await response.text();
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.error();
    }
}

export async function POST(request: Request) {
    const apiKey = getRandomApiKey();

    try {
        const requestBody = await request.json();
        const response = await fetch(`https://soldevnet.amalgum.workers.dev/?api-key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/9.3.3',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error processing POST request:', error);
        return NextResponse.error();
    }
}
