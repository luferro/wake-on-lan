import type { NextApiRequest, NextApiResponse } from 'next';
import { wake } from 'wol';

interface ExtendedNextApiRequest extends NextApiRequest {
	body: {
		address: string;
	};
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
	const { address } = req.body;
	const isSuccessful = await wake(address);
	if (!isSuccessful) return res.status(500).json({ message: 'Unable to send magic packet.' });

	res.status(200).json({ message: 'Magic packet has been sent.' });
};
