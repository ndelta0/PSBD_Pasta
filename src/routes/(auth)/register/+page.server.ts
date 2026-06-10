import { dev } from '$app/environment';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import {
	createSession,
	createUserAccount,
	emailTaken,
	SESSION_COOKIE_NAME
} from '$lib/server/auth';

function daysToSeconds(days: number) {
	return days * 24 * 60 * 60;
}

function addDays(date: number, days: number) {
	return new Date(date + daysToSeconds(days) * 1000);
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const name = String(formData.get('name') ?? '').trim();
		const surname = String(formData.get('surname') ?? '').trim();
		const email = String(formData.get('email') ?? '')
			.trim()
			.toLowerCase();
		const group = String(formData.get('group') ?? '').trim();
		const password = String(formData.get('password') ?? '');
		const confirmPassword = String(formData.get('confirmPassword') ?? '');
		const values = { name: name, surname: surname, email, group };

		if (!name || !surname || !email || !group || !password || !confirmPassword) {
			return fail(400, {
				...values,
				message: 'Wypełnij wszystkie pola'
			});
		}

		if (password.length < 6) {
			return fail(400, {
				...values,
				message: 'Hasło musi mieć co najmniej 6 znaków'
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				...values,
				message: 'Hasła muszą być takie same'
			});
		}

		if (await emailTaken(email)) {
			return fail(400, {
				...values,
				message: 'Konto z tym adresem e-mail już istnieje'
			});
		}

		const user = await createUserAccount({
			email,
			password,
			name,
			surname,
			groupName: group
		});

		const VALID_DAYS = 7;
		const session = await createSession(user.id, addDays(Date.now(), VALID_DAYS));

		cookies.set(SESSION_COOKIE_NAME, session, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: daysToSeconds(VALID_DAYS)
		});

		throw redirect(303, '/profile');
	}
};
