import wol from 'wake_on_lan';

export const wake = (mac: string, address?: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		wol.wake(mac, { address, port: 9 }, (error: NodeJS.ErrnoException) => {
			if (error) reject('Unable to send magic packet.');
			resolve('Magic packet has been sent.');
		});
	});
};
