import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import type { User } from '$lib/types';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface GeneralStats {
	numPresent: number;
	numAbsent: number;
}

export interface RecentSubjects {
	name: string;
	details: string;
	wasPresent: boolean;
}

export interface SubjectStats {
	name: string;
	numPresent: number;
	numAbsent: number;
}

export interface ScheduleOption {
	id: number;
	subject: string;
	label: string;
}

export interface AttendanceSummary {
	stats: GeneralStats;
	recent: RecentSubjects[];
	subjects: SubjectStats[];
	subjectOptions: string[];
	scheduleOptions: ScheduleOption[];
}

type AttendanceSummaryRow = RowDataPacket & {
	userId: number;
	subjectName: string;
	attendanceCount: number;
	numPresent: number;
	numAbsent: number;
};

type AttendanceLatestRow = RowDataPacket & {
	userId: number;
	classDate: string;
	subjectName: string;
	wasPresent: number | boolean;
	classType: string | null;
};

type SubjectOptionRow = RowDataPacket & {
	name: string;
};

type ScheduleOptionRow = RowDataPacket & {
	id: number;
	subjectName: string;
	classType: string | null;
	dayOfWeek: string;
	startsAt: string;
	endsAt: string;
};

type SubjectIdRow = RowDataPacket & {
	id: number;
};

type SemesterIdRow = RowDataPacket & {
	id: number;
};

type ScheduleSubjectRow = RowDataPacket & {
	subjectId: number;
};

const dayLabels: Record<string, string> = {
	Monday: 'Poniedziałek',
	Tuesday: 'Wtorek',
	Wednesday: 'Środa',
	Thursday: 'Czwartek',
	Friday: 'Piątek',
	Saturday: 'Sobota',
	Sunday: 'Niedziela'
};

const scheduleOptionLabel = (row: ScheduleOptionRow): string => {
	const day = dayLabels[row.dayOfWeek] ?? row.dayOfWeek;
	return `${row.classType ?? 'Zajęcia'} · ${day} ${row.startsAt.slice(0, 5)}-${row.endsAt.slice(0, 5)}`;
};

const loadFormOptions = async (userId: number) => {
	const [subjectRows] = await db.execute<SubjectOptionRow[]>(
		`
		SELECT name
		FROM subjects
		WHERE userId = ? AND archived = 0
		ORDER BY name
		`,
		[userId]
	);

	const [scheduleRows] = await db.execute<ScheduleOptionRow[]>(
		`
		SELECT se.id, s.name AS subjectName, ct.label AS classType, se.dayOfWeek, se.startsAt, se.endsAt
		FROM schedule_entries se
		INNER JOIN subjects s ON s.id = se.subjectId
		LEFT JOIN class_types ct ON ct.id = se.classTypeId
		WHERE se.userId = ? AND s.userId = ? AND s.archived = 0
		ORDER BY s.name, se.dayOfWeek, se.startsAt
		`,
		[userId, userId]
	);

	return {
		subjectOptions: subjectRows.map((row) => row.name),
		scheduleOptions: scheduleRows.map((row) => ({
			id: row.id,
			subject: row.subjectName,
			label: scheduleOptionLabel(row)
		}))
	};
};

const loadAttendance = async (user: User | null): Promise<AttendanceSummary> => {
	if (!user) throw new Error('User not authenticated');

	const formOptions = await loadFormOptions(user.id);

	let [rSummary] = await db.execute<AttendanceSummaryRow[]>(
		`
			SELECT *
			FROM v_attendance_summary
			WHERE userId = ?
		`,
		[user.id]
	);
	rSummary = rSummary.map((r) => ({
		...r,
		numPresent: Number(r.numPresent),
		numAbsent: Number(r.numAbsent)
	}));

	if (rSummary.length == 0) {
		return {
			stats: {
				numPresent: 0,
				numAbsent: 0
			},
			recent: [],
			subjects: [],
			...formOptions
		};
	}
	const totalPresent = rSummary.reduce((acc, row) => acc + row.numPresent, 0);
	const totalAbsent = rSummary.reduce((acc, row) => acc + row.numAbsent, 0);

	const [rLatest] = await db.execute<AttendanceLatestRow[]>(
		`
		SELECT *
		FROM v_attendance_latest
		WHERE userId = ?
		LIMIT 3
		`,
		[user.id]
	);

	return {
		stats: {
			numPresent: totalPresent,
			numAbsent: totalAbsent
		},
		recent: rLatest.map((row) => ({
			name: row.subjectName,
			details: `${row.classType ?? 'Zajęcia'} · ${row.classDate.slice(0, 10)}`,
			wasPresent: Boolean(row.wasPresent)
		})),
		subjects: rSummary.map((row) => ({
			name: row.subjectName,
			numPresent: row.numPresent,
			numAbsent: row.numAbsent
		})),
		...formOptions
	};
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

export const load: PageServerLoad = async ({ locals }) => await loadAttendance(locals.user);

export const actions: Actions = {
	addAttendance: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const subject = String(formData.get('subject') ?? '').trim();
		const date = String(formData.get('date') ?? '').trim();
		const wasPresent = String(formData.get('wasPresent') ?? '').trim();
		const scheduleEntryIdRaw = String(formData.get('scheduleEntryId') ?? '').trim();
		const values = { subject, date, wasPresent, scheduleEntryId: scheduleEntryIdRaw };

		if (!subject || !date || !wasPresent) {
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

		if (wasPresent !== '1' && wasPresent !== '0') {
			return fail(400, {
				...values,
				message: 'Wybierz poprawny status obecności'
			});
		}

		const subjectId = await getOrCreateSubjectId(user.id, subject);
		let scheduleEntryId: number | null = null;

		if (scheduleEntryIdRaw) {
			const parsedScheduleEntryId = Number.parseInt(scheduleEntryIdRaw, 10);

			if (Number.isNaN(parsedScheduleEntryId)) {
				return fail(400, {
					...values,
					message: 'Wybierz poprawną pozycję planu'
				});
			}

			const [scheduleRows] = await db.execute<ScheduleSubjectRow[]>(
				`
				SELECT subjectId
				FROM schedule_entries
				WHERE id = ? AND userId = ?
				LIMIT 1
				`,
				[parsedScheduleEntryId, user.id]
			);

			if (!scheduleRows[0] || scheduleRows[0].subjectId !== subjectId) {
				return fail(400, {
					...values,
					message: 'Wybrana pozycja planu nie pasuje do przedmiotu'
				});
			}

			scheduleEntryId = parsedScheduleEntryId;
		}

		await db.execute(
			`
			INSERT INTO attendance_record (userId, subjectId, scheduleEntryId, classDate, wasPresent)
			VALUES (?, ?, ?, ?, ?)
			`,
			[user.id, subjectId, scheduleEntryId, date, Number(wasPresent)]
		);

		throw redirect(303, '/attendance');
	}
};
