import crypto from 'node:crypto';
import type { User } from '$lib/types/user';
import { db } from '$lib/server/db';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import argon2 from 'argon2';

export const SESSION_COOKIE_NAME = 'session';

export function genSessionId(): string {
	return crypto.randomUUID();
}

type SessionUserRow = RowDataPacket & User;
type UserCredentialsRow = SessionUserRow & {
	passwordHash: string;
};

type ExistingUserRow = RowDataPacket & {
	id: number;
};

type CreateUserInput = {
	email: string;
	password: string;
	name: string;
	surname: string;
	groupName: string | null;
};

export async function getUserFromSession(sessionId: string): Promise<User | null> {
	const [rows] = await db.execute<SessionUserRow[]>(
		`
		SELECT users.id, users.email, users.name, users.surname, users.groupName
		FROM sessions
		INNER JOIN users ON sessions.userId = users.id
		WHERE sessions.id = ?
			AND sessions.expiresAt > NOW()
		LIMIT 1
		`,
		[sessionId]
	);

	return rows[0] ?? null;
}

export async function createSession(userId: number, expiresAt: Date): Promise<string> {
	const sessionId = genSessionId();
	await db.execute<ResultSetHeader>(
		`
		INSERT INTO sessions (id, userId, expiresAt)
		VALUES (?, ?, ?)
		`,
		[sessionId, userId, expiresAt]
	);
	return sessionId;
}

export async function emailTaken(email: string): Promise<boolean> {
	const [rows] = await db.execute<ExistingUserRow[]>(
		`
		SELECT id
		FROM users
		WHERE email = ?
		LIMIT 1
		`,
		[email]
	);

	return rows.length > 0;
}

export async function createUserAccount({
	email,
	password,
	name,
	surname,
	groupName
}: CreateUserInput): Promise<User> {
	const passwordHash = await argon2.hash(password);

	const [result] = await db.execute<ResultSetHeader>(
		`
		INSERT INTO users (email, passwordHash, name, surname, groupName)
		VALUES (?, ?, ?, ?, ?)
		`,
		[email, passwordHash, name, surname, groupName]
	);

	return {
		id: result.insertId,
		email,
		name,
		surname,
		groupName
	};
}

export async function verifyUserCredentials(email: string, password: string): Promise<User | null> {
	const [rows] = await db.execute<UserCredentialsRow[]>(
		`
		SELECT id, email, name, surname, groupName, passwordHash
		FROM users
		WHERE users.email = ?
		LIMIT 1
		`,
		[email]
	);

	const user = rows[0];
	if (!user) {
		return null;
	}

	try {
		if (!(await argon2.verify(user.passwordHash, password))) {
			return null;
		}
	} catch {
		return null;
	}

	// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
	const { passwordHash: _passwordHash, ...safeUser } = user;
	return safeUser;
}
