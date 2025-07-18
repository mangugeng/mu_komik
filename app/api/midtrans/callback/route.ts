import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import crypto from 'crypto';

// Inisialisasi Firebase Admin jika belum
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID as string,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY as string)?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

// Verifikasi signature Midtrans
function verifyMidtransSignature(signature: string, orderId: string, statusCode: string, grossAmount: string, serverKey: string): boolean {
  const stringToHash = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const hash = crypto.createHash('sha512').update(stringToHash).digest('hex');
  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const signature = req.headers.get('x-signature');
    const body = await req.json();

    // Verifikasi signature
    if (!signature || !verifyMidtransSignature(
      signature,
      body.order_id,
      body.transaction_status,
      body.gross_amount,
      serverKey
    )) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Hanya proses jika status settlement atau capture
    if (body.transaction_status !== 'settlement' && body.transaction_status !== 'capture') {
      return NextResponse.json({ status: 'ok' });
    }

    // Parse order_id untuk mendapatkan userId
    const [userId] = body.order_id.split('_');
    if (!userId) {
      return NextResponse.json({ error: 'Invalid order_id format' }, { status: 400 });
    }

    // Hitung jumlah coin (1 coin = Rp 100)
    const amount = parseInt(body.gross_amount);
    const coinAmount = Math.floor(amount / 100);

    // Update coin user
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.exists ? userDoc.data() : undefined;
    const userCoins = userData && userData.coins && typeof userData.coins.reader === 'number' ? userData.coins.reader : 0;
    const newCoins = userCoins + coinAmount;

    // Update coin di Firestore
    await userRef.set({ 
      coins: { 
        ...(userData && userData.coins ? userData.coins : {}), 
        reader: newCoins 
      } 
    }, { merge: true });

    // Tambahkan ke history topup
    await userRef.collection('topupHistory').add({
      amount: coinAmount,
      date: Timestamp.now(),
      paymentMethod: 'Midtrans',
      transactionId: body.transaction_id,
      orderId: body.order_id,
    });

    // Catat transaksi
    await db.collection('coin_transactions').add({
      userId,
      type: 'topup',
      amount: coinAmount,
      paymentMethod: 'Midtrans',
      transactionId: body.transaction_id,
      orderId: body.order_id,
      status: 'success',
      createdAt: Timestamp.now().toDate().toISOString(),
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Midtrans callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 