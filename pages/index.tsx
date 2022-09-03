import type { NextPage } from 'next';
import Head from 'next/head';
import Devices from '../components/devices';
import Footer from '../components/footer';
import styles from '../styles/Home.module.css';

export const getServerSideProps = async () => {
	return { props: {} };
};

const Home: NextPage = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Wake on Lan</title>
				<meta name="description" content="Simple app to wake devices up" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>Wake on Lan</h1>
				<Devices />
			</main>

			<Footer />
		</div>
	);
};

export default Home;
