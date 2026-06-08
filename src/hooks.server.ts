import type { Handle } from '@sveltejs/kit';
import { getUserFromSession, SESSION_COOKIE_NAME } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(SESSION_COOKIE_NAME);

	if (!sessionId) {
		// Unauthenticated
		event.locals.user = null;
		return resolve(event);
	}

	event.locals.user = await getUserFromSession(sessionId);
	return resolve(event);
};