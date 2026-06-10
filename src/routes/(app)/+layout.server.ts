import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import db from '$lib/server/db';
import type { RowDataPacket } from 'mysql2';

type SemesterRow = RowDataPacket & {
	name: string;
};

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const [rows] = await db.execute<SemesterRow[]>(
		`
		SELECT name
		FROM semesters
		WHERE isCurrent = TRUE
		LIMIT 1
	`
	);

	const row = rows[0];
	if (!row) {
		throw new Error('No current semester found');
	}

	return {
		user: locals.user,
		semester: row.name
	};
};
