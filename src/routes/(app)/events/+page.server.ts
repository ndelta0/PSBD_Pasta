import type { PageServerLoad } from './$types';
import type { User } from '$lib/types';
import type { RowDataPacket } from 'mysql2';
import db from '$lib/server/db';

export type EventTone = 'red' | 'amber' | 'green' | 'purple';

export interface Event {
	id: number;
	title: string;
	date: string;
	time: string | null;
	subject: string | null;
	description: string | null;
	type: string;
	tone: EventTone;
}

export interface EventsData {
	events: Event[];
}

type EventsUpcomingRow = RowDataPacket & {
	userId: number;
	eventId: number;
	summary: string;
	eventDate: Date;
	eventTime: string | null; // transmitted as "HH:mm:ss"
	description: string | null;
	type: string;
	tone: EventTone;
	subjectName: string | null;
};

const loadEvents = async (user: User | null): Promise<EventsData> => {
	if (!user) throw new Error('User not authenticated');

	const [rows] = await db.execute<EventsUpcomingRow[]>(
		`SELECT *
		 FROM v_events_upcoming
		 WHERE userId = ?`,
		[user.id]
	);

	console.log(rows);

	return {
		events: rows.map((row) => ({
			id: row.eventId,
			title: row.summary,
			date: row.eventDate.toISOString().split('T')[0],
			time: row.eventTime?.slice(0, 5) ?? null,
			subject: row.subjectName ?? '',
			description: row.description ?? null,
			type: row.type,
			tone: row.tone
		}))
	};
};

export const load: PageServerLoad = async ({ locals }) => await loadEvents(locals.user);
