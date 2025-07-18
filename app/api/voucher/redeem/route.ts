import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

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

const ERROR_MESSAGES = {
  VOUCHER_NOT_FOUND: 'Kode voucher tidak ditemukan',
  VOUCHER_USED: 'Voucher sudah digunakan',
  VOUCHER_EXPIRED: 'Voucher sudah kadaluarsa',
  INVALID_CODE: 'Kode voucher tidak valid',
  SERVER_ERROR: 'Terjadi kesalahan, silakan coba lagi',
};

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code || typeof code !== 'string' || code.length !== 6) {
      return NextResponse.json({ success: false, coinAmount: 0, message: ERROR_MESSAGES.INVALID_CODE }, { status: 400 });
    }

    // Autentikasi user
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, coinAmount: 0, message: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = await getAuth().verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ success: false, coinAmount: 0, message: 'Unauthorized' }, { status: 401 });
    }
    const userId = decoded.uid;

    // Cari voucher
    const voucherSnap = await db.collection('vouchers').where('code', '==', code).limit(1).get();
    if (voucherSnap.empty) {
      return NextResponse.json({ success: false, coinAmount: 0, message: ERROR_MESSAGES.VOUCHER_NOT_FOUND }, { status: 404 });
    }
    const voucherDoc = voucherSnap.docs[0];
    const voucher = voucherDoc.data();
    if (voucher.status === 'used') {
      return NextResponse.json({ success: false, coinAmount: 0, message: ERROR_MESSAGES.VOUCHER_USED }, { status: 400 });
    }
    if (voucher.status === 'expired') {
      return NextResponse.json({ success: false, coinAmount: 0, message: ERROR_MESSAGES.VOUCHER_EXPIRED }, { status: 400 });
    }

    // Update voucher status
    await voucherDoc.ref.update({
      status: 'used',
      usedAt: Timestamp.now().toDate().toISOString(),
      usedBy: userId,
    });

    // Tambahkan coin ke user
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.exists ? userDoc.data() : undefined;
    const userCoins = userData && userData.coins && typeof userData.coins.reader === 'number' ? userData.coins.reader : 0;
    const newCoins = userCoins + voucher.coinAmount;
    await userRef.set({ coins: { ...(userData && userData.coins ? userData.coins : {}), reader: newCoins } }, { merge: true });

    // Tambahkan ke history topup
    await userRef.collection('topupHistory').add({
      amount: voucher.coinAmount,
      date: Timestamp.now(),
      paymentMethod: 'Voucher',
    });

    // Catat transaksi
    await db.collection('coin_transactions').add({
      userId,
      type: 'voucher',
      amount: voucher.coinAmount,
      voucherCode: code,
      status: 'success',
      createdAt: Timestamp.now().toDate().toISOString(),
    });

    return NextResponse.json({ success: true, coinAmount: voucher.coinAmount, message: 'Voucher berhasil digunakan!' });
  } catch {
    return NextResponse.json({ success: false, coinAmount: 0, message: ERROR_MESSAGES.SERVER_ERROR }, { status: 500 });
  }
} 