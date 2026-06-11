import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { User } from '$lib/types';
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
	subjectOptions: string[];
}

type EventsUpcomingRow = RowDataPacket & {
	userId: number;
	eventId: number;
	summary: string;
	eventDate: string;
	eventTime: string | null;
	description: string | null;
	type: string;
	tone: EventTone;
	subjectName: string | null;
};

type SubjectOptionRow = RowDataPacket & {
	name: string;
};

type SubjectIdRow = RowDataPacket & {
	id: number;
};

type SemesterIdRow = RowDataPacket & {
	id: number;
};

const toneForType = (type: string): EventTone => {
	const normalized = type.trim().toLowerCase();

	if (normalized.includes('egzamin')) return 'red';
	if (normalized.includes('projekt')) return 'amber';
	if (normalized.includes('kolokwium')) return 'green';
	return 'purple';
};

const loadSubjectOptions = async (userId: number) => {
	const [subjectRows] = await db.execute<SubjectOptionRow[]>(
		`
		SELECT name
		FROM subjects
		WHERE userId = ? AND archived = 0
		ORDER BY name
		`,
		[userId]
	);

	return subjectRows.map((row) => row.name);
};

const getOrCreateSubjectId = async (userId: number, subjectName: string): Promise<number> => {
	const [existingRows] = await db.execute<SubjectIdRow[]>(
		`
		SELECT id
		FROM subjects
		WHERE userId = ? AND LOWER(name) = LOWER(?)
		LIMIT 1
		`,
		[userId, subjectName]
	);

	const existing = existingRows[0];
	if (existing) {
		return existing.id;
	}

	const [semesterRows] = await db.execute<SemesterIdRow[]>(
		`
		SELECT id
		FROM semesters
		WHERE userId = ? AND isCurrent = TRUE
		LIMIT 1
		`,
		[userId]
	);

	const [result] = await db.execute<ResultSetHeader>(
		`
		INSERT INTO subjects (userId, semesterId, name)
		VALUES (?, ?, ?)
		`,
		[userId, semesterRows[0]?.id ?? null, subjectName]
	);

	return result.insertId;
};

const loadEvents = async (user: User | null): Promise<EventsData> => {
	if (!user) throw new Error('User not authenticated');

	const [rows] = await db.execute<EventsUpcomingRow[]>(
		`SELECT *
		 FROM v_events_upcoming
		 WHERE userId = ?`,
		[user.id]
	);

	return {
		events: rows.map((row) => ({
			id: row.eventId,
			title: row.summary,
			date: row.eventDate.slice(0, 10),
			time: row.eventTime?.slice(0, 5) ?? null,
			subject: row.subjectName ?? '',
			description: row.description ?? null,
			type: row.type,
			tone: row.tone
		})),
		subjectOptions: await loadSubjectOptions(user.id)
	};
};

export const load: PageServerLoad = async ({ locals }) => await loadEvents(locals.user);

export const actions: Actions = {
	addEvent: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const title = String(formData.get('title') ?? '').trim();
		const subject = String(formData.get('subject') ?? '').trim();
		const type = String(formData.get('type') ?? '').trim();
		const date = String(formData.get('date') ?? '').trim();
		const timeHour = String(formData.get('timeHour') ?? '').trim();
		const timeMinute = String(formData.get('timeMinute') ?? '').trim();
		const description = String(formData.get('description') ?? '').trim();
		const values = { title, subject, type, date, timeHour, timeMinute, description };

		if (!title || !subject || !type || !date || !timeHour || !timeMinute || !description) {
			return fail(400, {
				...values,
				message: 'Wypełnij wszystkie pola'
			});
		}

		if (Number.isNaN(Date.parse(date))) {
			return fail(400, {
				...values,
				message: 'Podaj poprawną datę'
			});
		}

		const hour = Number.parseInt(timeHour, 10);
		const minute = Number.parseInt(timeMinute, 10);

		if (
			Number.isNaN(hour) ||
			Number.isNaN(minute) ||
			hour < 0 ||
			hour > 23 ||
			minute < 0 ||
			minute > 59
		) {
			return fail(400, {
				...values,
				message: 'Podaj poprawną godzinę'
			});
		}

		const subjectId = await getOrCreateSubjectId(user.id, subject);
		const eventTime = `${timeHour.padStart(2, '0')}:${timeMinute.padStart(2, '0')}:00`;
		const tone = toneForType(type);

		await db.execute(
			`
			INSERT INTO events (userId, subjectId, summary, description, type, eventDate, eventTime, tone)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
			`,
			[user.id, subjectId, title, description, type, date, eventTime, tone]
		);

		throw redirect(303, '/events');
	}
};
