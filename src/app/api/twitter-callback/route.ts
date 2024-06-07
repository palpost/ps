import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { oauth_token, oauth_verifier } = req.query;

  // هنا يمكنك التعامل مع الرمز المؤقت (oauth_token) والمحقق (oauth_verifier)
  // لاستخراج رمز الوصول وتخزينه إذا لزم الأمر.

  res
    .status(200)
    .json({ message: 'Callback received', oauth_token, oauth_verifier });
}
