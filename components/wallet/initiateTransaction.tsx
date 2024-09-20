import { PublicKey, Transaction, SystemProgram, Connection, SendOptions } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

export const initiateTransaction = async (
    wallet: WalletContextState,
    connection: Connection,
    toAddress: string,
    amount: number,
    fee: number
) => {
    try {
        if (!wallet.publicKey) throw new Error('Wallet not connected');
        if (!wallet.signTransaction) throw new Error('Wallet does not support transaction signing');

        const fromPubkey = wallet.publicKey;
        const toPubkey = new PublicKey(toAddress);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey,
                toPubkey,
                lamports: amount + fee
            })
        );

        const latestBlockhash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockhash.blockhash;
        transaction.feePayer = fromPubkey;

        const signedTransaction = await wallet.signTransaction(transaction);

        const sendOptions: SendOptions = {
            skipPreflight: false,
            preflightCommitment: 'confirmed'
        };

        const signature = await connection.sendRawTransaction(signedTransaction.serialize(), sendOptions);

        await connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
        });

        console.log(`Transaction successful with signature: ${signature}`);
        return signature;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Transaction failed:', error.message);
            throw new Error(error.message);
        } else {
            console.error('Transaction failed with unknown error:', error);
            throw new Error('Unknown error occurred');
        }
    }
};