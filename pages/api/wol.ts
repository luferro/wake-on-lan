import type { NextApiRequest, NextApiResponse } from 'next';
import { getIpv4Address } from '../../utils/dns';
import { wake } from '../../utils/wol';

interface ExtendedNextApiRequest extends NextApiRequest {
	body: {
		mac: string;
		address: string;
	};
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
		return res.status(405).end(`Method ${req.method} not allowed`);
	}

	const { mac, address } = req.body;
	const ipv4Address = await getIpv4Address(address);

	try {
		const result = await wake(mac, ipv4Address);
		res.status(200).json({ message: result });
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};
