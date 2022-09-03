import { lookup } from 'node:dns';

export const getIpv4Address = (ddns: string): Promise<string | undefined> => {
	return new Promise((resolve) => {
		lookup(ddns, { family: 4 }, (error, ipv4) => {
			resolve(ipv4);
		});
	});
};
