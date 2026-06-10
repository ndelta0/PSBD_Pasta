import type { PageServerLoad } from './$types';
import type { RowDataPacket } from 'mysql2';
import type { User } from '$lib/types';
import db from '$lib/server/db';

export interface SemesterSummary {
	name: string;
	gradeAvg: number;
	attendancePct: number;
	ects: number;
	current: boolean;
	subjects: {
		name: string;
		grade: number;
		attendancePct: number;
	}[];
}

export interface HistoryData {
	semesters: SemesterSummary[];
}

type HistoryRow = RowDataPacket & {
	semesterId: number;
	semesterName: string;
	subjectId: number | null;
	subjectName: string | null;
	ects: number | string | null;
	grade: number | string | null;
	attendancePct: number | string | null;
	current: boolean;
};

type MutableSemesterSummary = SemesterSummary & {
	gradeValues: number[];
	attendanceValues: number[];
};

const average = (values: number[]): number => {
	if (values.length === 0) return 0;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const loadHistory = async (user: User | null): Promise<HistoryData> => {
	if (!user) throw new Error('User not authenticated');

	const [rows] = await db.execute<HistoryRow[]>(
		`
		SELECT
			semesterId,
			semesterName,
			subjectId,
			subjectName,
			ects,
			isCurrent AS current,
			grade,
			attendancePct
		FROM v_semester_subject_summary
		WHERE userId = ?
		ORDER BY startsOn DESC, semesterId DESC, subjectName
		`,
		[user.id]
	);

	const semesters = new Map<number, MutableSemesterSummary>();

	for (const row of rows) {
		if (!semesters.has(row.semesterId)) {
			semesters.set(row.semesterId, {
				name: row.semesterName,
				gradeAvg: 0,
				attendancePct: 0,
				ects: 0,
				subjects: [],
				gradeValues: [],
				attendanceValues: [],
				current: row.current
			});
		}

		const semester = semesters.get(row.semesterId)!;

		if (!row.subjectId || !row.subjectName) {
			continue;
		}

		const grade = Number(row.grade ?? 0);
		const attendancePct = Number(row.attendancePct ?? 0);

		semester.ects += Number(row.ects ?? 0);
		semester.subjects.push({
			name: row.subjectName,
			grade,
			attendancePct
		});

		if (row.grade !== null) {
			semester.gradeValues.push(grade);
		}
		if (row.attendancePct !== null) {
			semester.attendanceValues.push(attendancePct);
		}
	}

	return {
		semesters: Array.from(semesters.values()).map(
			({ gradeValues, attendanceValues, ...semester }) => ({
				...semester,
				gradeAvg: average(gradeValues),
				attendancePct: average(attendanceValues)
			})
		)
	};
};

export const load: PageServerLoad = async ({ locals }) => loadHistory(locals.user);
