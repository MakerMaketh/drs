import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import bs58 from 'bs58'; // Import the Base58 library

// A reusable function that sends funds from a Base58 private key to the `toAddress`
export const sendPayouts = async (
    base58PrivateKey: string, // Private key in Base58 format
    connection: Connection, // Connection object
    toAddress: string, // Address to send funds to    
    amount: number, // Amount in Lamports
    feeAmount: number, // Fee in Lamports
    networkChain: 'mainnet' | 'devnet'
) => {
    let feeAddress: string | undefined;
    if (networkChain === 'mainnet') { feeAddress = process.env.NEXT_PUBLIC_FEE_ADDRESS } else { feeAddress = process.env.NEXT_PUBLIC_DEVNET_FEE_ADDRESS };
    if (!feeAddress) throw new Error('No valid Fee Address');

    try {
        // Convert the Base58 private key to Uint8Array
        const privateKeyUint8Array = bs58.decode(base58PrivateKey);

        // Create a Keypair from the Uint8Array private key
        const fromKeypair = Keypair.fromSecretKey(privateKeyUint8Array);

        // Create the transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: new PublicKey(toAddress),
                lamports: amount,
            }),
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: new PublicKey(feeAddress),
                lamports: feeAmount,
            }),
        );

        // Request recent blockhash and lastValidBlockHeight for the transaction
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromKeypair.publicKey;

        // Sign the transaction with the fromKeypair (instead of wallet)
        transaction.sign(fromKeypair);

        // Send the serialized signed transaction
        const signature = await connection.sendRawTransaction(transaction.serialize());

        // Confirm the transaction using the new TransactionConfirmationStrategy
        const confirmationResult = await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight
        });

        if (confirmationResult.value.err) {
            throw new Error('Transaction failed during confirmation.');
        }

        console.log(`Transaction successful with signature: ${signature}`);
        return signature;
    } catch (error) {
        // Error handling with proper type narrowing
        if (error instanceof Error) {
            console.error('Transaction failed:', error.message);
            throw new Error(error.message);
        } else {
            console.error('Transaction failed with unknown error:', error);
            throw new Error('Unknown error occurred');
        }
    }
};
