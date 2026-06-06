import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type UserAccount = {
	id: string;
	name: string;
	email: string;
	group: string;
	avatar: string;
	createdAt: string;
	password: string;
};

export type AuthSummary = Omit<UserAccount, 'password'>;

export type RegisterPayload = {
	name: string;
	email: string;
	group: string;
	password: string;
};

export type LoginPayload = {
	email: string;
	password: string;
};

const USERS_KEY = 'pasta-users';
const CURRENT_USER_KEY = 'pasta-current-user';

const seedUsers: UserAccount[] = [
	{
		id: 'demo-jan-kowalski',
		name: 'Jan Kowalski',
		email: 'jan.kowalski@example.com',
		group: 'ARiIP - 111',
		avatar: 'JK',
		createdAt: '2025-10-01T08:00:00.000Z',
		password: 'test1234'
	}
];

export const currentUserStore = writable<AuthSummary | null>(null);

const toSummary = (account: UserAccount): AuthSummary => {
	const { password, ...summary } = account;
	return summary;
};

const makeAvatar = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('');

const readJSON = <T>(key: string, fallback: T): T => {
	if (!browser) {
		return fallback;
	}

	const raw = localStorage.getItem(key);
	if (!raw) {
		return fallback;
	}

	try {
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
};

const writeJSON = <T>(key: string, value: T) => {
	if (!browser) {
		return;
	}

	localStorage.setItem(key, JSON.stringify(value));
};

const ensureUsers = () => {
	if (!browser) {
		return seedUsers;
	}

	const users = readJSON<UserAccount[]>(USERS_KEY, []);
	if (users.length === 0) {
		writeJSON(USERS_KEY, seedUsers);
		return seedUsers;
	}

	return users;
};

const persistCurrentUser = (user: AuthSummary | null) => {
	currentUserStore.set(user);

	if (!browser) {
		return;
	}

	if (user) {
		localStorage.setItem(CURRENT_USER_KEY, user.id);
	} else {
		localStorage.removeItem(CURRENT_USER_KEY);
	}
};

export const hydrateAuth = () => {
	if (!browser) {
		return null;
	}

	const users = ensureUsers();
	const currentId = localStorage.getItem(CURRENT_USER_KEY);
	const currentUser = users.find((user) => user.id === currentId) ?? null;
	persistCurrentUser(currentUser ? toSummary(currentUser) : null);
	return currentUser ? toSummary(currentUser) : null;
};

export const getCurrentUser = () => currentUserStore;

export const loginAccount = ({ email, password }: LoginPayload) => {
	const users = ensureUsers();
	const normalizedEmail = email.trim().toLowerCase();
	const foundUser = users.find(
		(user) => user.email.toLowerCase() === normalizedEmail && user.password === password
	);

	if (!foundUser) {
		throw new Error('Nieprawidłowy adres e-mail lub hasło.');
	}

	const summary = toSummary(foundUser);
	persistCurrentUser(summary);
	return summary;
};

export const registerAccount = ({ name, email, group, password }: RegisterPayload) => {
	const users = ensureUsers();
	const normalizedEmail = email.trim().toLowerCase();
	const trimmedName = name.trim();
	const trimmedGroup = group.trim();
	const trimmedPassword = password.trim();

	if (!trimmedName || !normalizedEmail || !trimmedGroup || trimmedPassword.length < 6) {
		throw new Error('Wypełnij wszystkie pola i ustaw hasło z co najmniej 6 znaków.');
	}

	if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
		throw new Error('Konto z tym adresem e-mail już istnieje.');
	}

	const newUser: UserAccount = {
		id: `user-${Date.now()}`,
		name: trimmedName,
		email: normalizedEmail,
		group: trimmedGroup,
		avatar: makeAvatar(trimmedName),
		createdAt: new Date().toISOString(),
		password: trimmedPassword
	};

	const nextUsers = [newUser, ...users];
	writeJSON(USERS_KEY, nextUsers);
	const summary = toSummary(newUser);
	persistCurrentUser(summary);
	return summary;
};

export const logoutAccount = () => {
	persistCurrentUser(null);
};

export const getAccountById = (id: string) => ensureUsers().find((user) => user.id === id) ?? null;
export const getStoredUsers = () => ensureUsers().map(toSummary);


