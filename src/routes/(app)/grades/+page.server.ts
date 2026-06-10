import type { PageServerLoad } from './$types';
import type { RowDataPacket } from 'mysql2';
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

	return {
		subjects: groupGradesBySubject(rows as GradeDetailRow[])
	};
};

export const load: PageServerLoad = async ({ locals }) => loadGrades(locals.user);
