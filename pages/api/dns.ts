import type { NextApiRequest, NextApiResponse } from 'next';
import { getIpv4Address } from '../../utils/dns';

interface ExtendedNextApiRequest extends NextApiRequest {
	query: {
		query: string;
	};
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end(`Method ${req.method} not allowed`);
	}

	const { query } = req.query;

	const ipv4 = await getIpv4Address(query);
	if (!ipv4) return res.status(404).json({ message: 'Address not found.' });

	res.status(200).json({ message: ipv4 });
};
