import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const token = req.cookies['auth-token'];
        const { id } = req.query;

        if (!token) {
            return res.status(401).json({ error: '인증되지 않은 사용자입니다.' });
        }

        // TODO: 실제 알림 읽음 처리 로직 구현
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({
            error: '알림 상태 변경 중 오류가 발생했습니다.'
        });
    }
} 