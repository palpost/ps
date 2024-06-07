import { NextResponse } from 'next/server';
import https from 'https';

export async function GET() {
  const options = {
    hostname: 'api.twitter.com',
    port: 443,
    path: '/2/tweets/sample/stream',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
    }
  };

  const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    res.on('data', (chunk) => {
      console.log(chunk.toString());
      // يمكنك إضافة معالجة للبيانات هنا، مثل تحويلها إلى كائن JSON وتحليلها
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.end();

  return NextResponse.json({ message: 'Bot is running' });
}
