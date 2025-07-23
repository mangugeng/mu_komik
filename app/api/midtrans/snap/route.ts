import { NextRequest } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { amount, userId, email } = await req.json();

  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const base64ServerKey = Buffer.from(serverKey + ':').toString('base64');

  const payload = {
    transaction_details: {
      order_id: `${userId}_${Date.now()}`,
      gross_amount: amount,
    },
    customer_details: {
      email: email || 'user@email.com',
    },
    credit_card: {
      secure: true
    }
  };

  const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

  // Debug log for key and headers - removed for production

  try {
    const response = await axios.post(
      API_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${base64ServerKey}`,
        }
      }
    );
    return Response.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return Response.json({ error: 'Gagal membuat pembayaran', detail: error.response.data }, { status: error.response.status || 500 });
    }
    return Response.json({ error: 'Gagal membuat pembayaran', detail: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 