import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { User } from '$lib/types';
import db from '$lib/server/db';

export interface Grade {
	id: number;
	value: number;
	name: string;
	date: string;
	weight: number;
}

export interface SubjectGrades {
	subjects: Record<string, Grade[]>;
	subjectOptions: string[];
	gradeNameOptions: string[];
}

type GradeDetailRow = RowDataPacket & {
	gradeId: number;
	userId: number;
	subjectId: number;
	subjectName: string;
	value: number;
	weight: number;
	gradedOn: string;
	name: string;
};

type SubjectOptionRow = RowDataPacket & {
	name: string;
};

type GradeNameOptionRow = RowDataPacket & {
	name: string;
};

type SubjectIdRow = RowDataPacket & {
	id: number;
};

type SemesterIdRow = RowDataPacket & {
	id: number;
};

const loadFormOptions = async (userId: number) => {
	const [subjectRows] = await db.execute<SubjectOptionRow[]>(
		`
			SELECT name
			FROM subjects
			WHERE userId = ?
				AND archived = 0
			ORDER BY name
		`,
		[userId]
	);

	const [gradeNameRows] = await db.execute<GradeNameOptionRow[]>(
		`
		SELECT DISTINCT name
		FROM grades
		WHERE userId = ?
		ORDER BY name
		`,
		[userId]
	);

	return {
		subjectOptions: subjectRows.map((row) => row.name),
		gradeNameOptions: gradeNameRows.map((row) => row.name)
	};
};

const loadGrades = async (user: User | null): Promise<SubjectGrades> => {
	if (!user) throw new Error('User not authenticated');

	const [rows] = await db.execute(
		`
		SELECT *
		FROM v_grade_details
		WHERE userId = ?
		ORDER BY gradedOn DESC`,
		[user.id]
	);

	const rowToGrade = (row: GradeDetailRow): Grade => ({
		id: row.gradeId,
		value: Number(row.value),
		name: row.name,
		date: row.gradedOn.slice(0, 10),
		weight: Number(row.weight)
	});

	const groupGradesBySubject = (rows: GradeDetailRow[]): Record<string, Grade[]> => {
		const map = new Map<string, Grade[]>();
		for (const row of rows) {
			const subject = row.subjectName;
			const grade = rowToGrade(row);
			if (!map.has(subject)) map.set(subject, []);
			map.get(subject)!.push(grade);
		}
		return Object.fromEntries(map.entries());
	};

	const formOptions = await loadFormOptions(user.id);

	return {
		subjects: groupGradesBySubject(rows as GradeDetailRow[]),
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

export const load: PageServerLoad = async ({ locals }) => loadGrades(locals.user);

export const actions: Actions = {
	addGrade: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const subject = String(formData.get('subject') ?? '').trim();
		const name = String(formData.get('name') ?? '').trim();
		const valueRaw = String(formData.get('value') ?? '').trim();
		const date = String(formData.get('date') ?? '').trim();
		const weightRaw = String(formData.get('weight') ?? '').trim();
		const values = { subject, name, value: valueRaw, date, weight: weightRaw };

		if (!subject || !name || !valueRaw || !date || !weightRaw) {
			return fail(400, {
				...values,
				message: 'Wypełnij wszystkie pola'
			});
		}

		const value = Number.parseFloat(valueRaw);
		const weight = Number.parseFloat(weightRaw);

		if (Number.isNaN(value) || value < 1 || value > 5) {
			return fail(400, {
				...values,
				message: 'Ocena musi być liczbą od 1 do 5'
			});
		}

		if (Number.isNaN(weight) || weight < 1 || weight > 10) {
			return fail(400, {
				...values,
				message: 'Waga musi być liczbą od 1 do 10'
			});
		}

		if (Number.isNaN(Date.parse(date))) {
			return fail(400, {
				...values,
				message: 'Podaj poprawną datę'
			});
		}

		const subjectId = await getOrCreateSubjectId(user.id, subject);

		await db.execute(
			`
			INSERT INTO grades (userId, subjectId, name, value, weight, gradedOn)
			VALUES (?, ?, ?, ?, ?, ?)
			`,
			[user.id, subjectId, name, value, weight, date]
		);

		throw redirect(303, '/grades');
	}
};