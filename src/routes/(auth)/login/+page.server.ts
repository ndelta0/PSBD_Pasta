import { type Actions, fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { createSession, SESSION_COOKIE_NAME, verifyUserCredentials } from '$lib/server/auth';

function daysToSeconds(days: number) {
	return days * 24 * 60 * 60;
}

function addDays(date: number, days: number) {
	return new Date(date + daysToSeconds(days) * 1000);
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();

		const email = String(formData.get('email') ?? '')
			.trim()
			.toLowerCase();
		const password = String(formData.get('password') ?? '');

		if (!email || !password) {
			return fail(400, {
				email,
				message: 'Podaj email i hasło'
			});
		}

		const user = await verifyUserCredentials(email, password);

		if (!user) {
			return fail(400, {
				email,
				message: 'Niepoprawny email lub hasło'
			});
		}

		const VALID_DAYS = 7;
		const session = await createSession(user.id, addDays(Date.now(), VALID_DAYS));

		cookies.set(SESSION_COOKIE_NAME, session, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: daysToSeconds(VALID_DAYS)
		});

		throw redirect(303, '/');
	}
};