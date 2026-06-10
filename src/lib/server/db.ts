import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

const { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USER } = env;

export default mysql.createPool({
	host: DATABASE_HOST,
	port: Number(DATABASE_PORT),
	user: DATABASE_USER,
	password: DATABASE_PASSWORD,
	database: DATABASE_NAME,
	dateStrings: true,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});