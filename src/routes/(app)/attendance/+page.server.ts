import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import type { User } from '$lib/types';
import type { RowDataPacket } from 'mysql2';

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

export interface AttendanceSummary {
	stats: GeneralStats;
	recent: RecentSubjects[];
	subjects: SubjectStats[];
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
	classDate: Date;
	subjectName: string;
	wasPresent: boolean;
	classType: string;
};

const loadAttendance = async (user: User | null): Promise<AttendanceSummary> => {
	if (!user) throw new Error('User not authenticated');

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
			subjects: []
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
			details: `${row.classType} · ${row.classDate.toISOString().split('T')[0]}`,
			wasPresent: row.wasPresent
		})),
		subjects: rSummary.map((row) => ({
			name: row.subjectName,
			numPresent: row.numPresent,
			numAbsent: row.numAbsent
		}))
	};
};

export const load: PageServerLoad = async ({ locals }) => await loadAttendance(locals.user);
