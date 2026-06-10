import { dev } from '$app/environment';
import { type Actions, redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$lib/server/auth';

export const actions: Actions = {
	default: async ({ cookies }) => {
		cookies.delete(SESSION_COOKIE_NAME, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev
		});

		throw redirect(303, '/login');
	}
};
