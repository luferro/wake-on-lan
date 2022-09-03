import { Table, Button, Modal, ActionIcon } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import Form from './form';

interface Device {
	name: string;
	mac: string;
	address: string;
}

const Devices = () => {
	const [opened, setOpened] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [list, setList] = useState<Device[]>([]);

	const handleRefresh = () => setRefresh(!refresh);

	const handleModal = (open: boolean) => setOpened(open);

	const handleDelete = (name: string) => {
		localStorage.removeItem(name);

		showNotification({ color: 'green', message: `${name.replace('D-', '')} deleted successfully.` });
		handleRefresh();
	};

	const wakeOnLan = async (mac: string, address: string) => {
		const res = await window.fetch(`${window.location.origin}/api/wol`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ mac, address }),
		});
		const data = (await res.json()) as { message: string };

		showNotification({ color: res.ok ? 'green' : 'red', message: data.message });
	};

	const fetchDevices = () => {
		const devices = Object.keys(localStorage)
			.map((name) => {
				const item = localStorage.getItem(name);
				if (!item || !name.startsWith('D-')) return;

				const { mac, address } = JSON.parse(item) as Omit<Device, 'name'>;

				return { name, mac, address };
			})
			.filter((device): device is NonNullable<typeof device> => !!device);
		setList(devices);
	};

	useEffect(() => {
		fetchDevices();
	}, [refresh]);

	return (
		<>
			<Modal
				opened={opened}
				onClose={() => handleModal(false)}
				title="Register device"
				styles={{ modal: { background: '#0d1117' } }}
			>
				<Form handleRefresh={handleRefresh} handleModal={handleModal} />
			</Modal>
			<Button onClick={() => handleModal(true)} className={styles.register} color="green">
				Register device
			</Button>
			<div className={styles.table}>
				<Table striped highlightOnHover>
					<thead>
						<tr>
							<th>Name</th>
							<th>MAC Address</th>
							<th>Public IP Address or DDNS</th>
							<th>Wake on Lan</th>
							<th>Forget device</th>
						</tr>
					</thead>
					<tbody>
						{list.map(({ name, mac, address }) => (
							<tr key={mac}>
								<td>{name.replace('D-', '')}</td>
								<td>{mac}</td>
								<td>{address}</td>
								<td>
									<Button onClick={() => wakeOnLan(mac, address)}>Wake up</Button>
								</td>
								<td>
									<ActionIcon onClick={() => handleDelete(name)}>
										<Image src="/svg/trash.svg" alt="Trash Icon" width={28} height={28} />
									</ActionIcon>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>

			<span className={styles.empty}>{list.length === 0 ? 'No devices registered.' : ''}</span>
		</>
	);
};

export default Devices;
