import { Button, Input } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { ChangeEvent, FormEvent, useState } from 'react';
import styles from '../styles/Home.module.css';

interface Props {
	handleRefresh: () => void;
	handleModal: (open: boolean) => void;
}

const Form = ({ handleRefresh, handleModal }: Props) => {
	const [formValues, setFormValues] = useState({ name: '', address: '' });
	const [formErrors, setFormErrors] = useState({ name: '', address: '' });

	const isFormValid = () => {
		const isValidName = /[A-Za-z0-9]{3}/g.test(formValues.name);
		const isValidMacAddress = /((?!00|FF|88|87)[0-9A-F]{2}([:-]|$)){6}/gm.test(formValues.address);
		if (isValidName && isValidMacAddress) return true;

		setFormErrors({
			name: isValidName ? formErrors.name : 'Invalid device name format',
			address: isValidMacAddress ? formErrors.address : 'Invalid MAC address format',
		});
		return false;
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormValues({ ...formValues, [name]: value });
		setFormErrors({ ...formErrors, [name]: '' });
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const isValid = isFormValid();
		if (!isValid) return;

		localStorage.setItem(`D-${formValues.name.trim()}`, formValues.address.replace(/-/g, ':'));

		showNotification({ color: 'green', message: `${formValues.name} registered successfully.` });

		handleModal(false);
		handleRefresh();
	};

	return (
		<form onSubmit={handleSubmit}>
			<Input.Wrapper id="name" withAsterisk label="Device name" styles={{ label: { color: 'white' } }}>
				<Input
					onChange={handleChange}
					id="name"
					name="name"
					value={formValues.name}
					placeholder="e.g. Home Desktop"
					required
				/>
			</Input.Wrapper>
			{formErrors.name && <span className="error">{formErrors.name}</span>}
			<br />
			<Input.Wrapper id="address" withAsterisk label="MAC address" styles={{ label: { color: 'white' } }}>
				<Input
					onChange={handleChange}
					id="address"
					name="address"
					value={formValues.address}
					placeholder="01:23:45:67:89:AB"
					required
				/>
			</Input.Wrapper>
			{formErrors.address && <span className="error">{formErrors.address}</span>}
			<br />
			<Button
				type="submit"
				className={styles.register}
				style={{ width: '100%' }}
				color="green"
				disabled={Boolean(formErrors.name || formErrors.address)}
			>
				Register
			</Button>
		</form>
	);
};

export default Form;
