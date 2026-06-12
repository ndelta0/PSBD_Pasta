import type { PageServerLoad } from './$types';
import type { RowDataPacket } from 'mysql2';
import type { User } from '$lib/types';
import db from '$lib/server/db';

export interface Subject {
	name: string;
	code: string;
	semesterName: string;
	description?: string;
	ects: number;
	coordinator: string;
	coordinatorEmail: string;
	teachers: string[];
	types: ({ label: string; tone?: string } | string)[];
	presenceMandatory: boolean;
}

export interface SubjectData {
	subjects: Subject[];
}

type SubjectDetailsRow = RowDataPacket & {
	subjectId: number;
	userId: number;
	name: string;
	code: string | null;
	description: string | null;
	ects: number | null;
	coordinatorName: string | null;
	coordinatorEmail: string | null;
	presenceMandatory: boolean;
	semesterName: string;
	teachers: string | null;
	classTypes: string | null;
};

const splitList = (value: string | null): string[] => {
	if (!value) return [];
	return value.split(';').filter(Boolean);
};

const loadSubjects = async (user: User | null): Promise<SubjectData> => {
	if (!user) throw new Error('User not authenticated');

	const [rows] = await db.execute<SubjectDetailsRow[]>(
		`
		SELECT *
		FROM v_subject_details
		WHERE userId = ?
		ORDER BY name
		`,
		[user.id]
	);

	return {
		subjects: rows.map((row) => ({
			name: row.name,
			code: row.code ?? '',
			semesterName: row.semesterName,
			description: row.description ?? undefined,
			ects: Number(row.ects ?? 0),
			coordinator: row.coordinatorName ?? '',
			coordinatorEmail: row.coordinatorEmail ?? '',
			teachers: splitList(row.teachers),
			types: splitList(row.classTypes),
			presenceMandatory: Boolean(row.presenceMandatory)
		}))
	};
};

export const load: PageServerLoad = async ({ locals }) => loadSubjects(locals.user);
