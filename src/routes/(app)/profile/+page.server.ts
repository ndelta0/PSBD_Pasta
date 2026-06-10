import { dev } from '$app/environment';
import { type Actions, redirect } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Temporary database placeholder requested for this route.
const loadProfile = ({ user }: App.Locals): any => {
	// TODO: Extend this with database-backed profile details when the profile page needs more than locals.user.
	return {
		profile: user
	};
};

export const load: PageServerLoad = async ({ locals }) => loadProfile(locals);

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