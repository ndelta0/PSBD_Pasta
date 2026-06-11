import type { PageServerLoad } from './$types';
import type { RowDataPacket } from 'mysql2';
import type { User } from '$lib/types';
import db from '$lib/server/db';

export interface DashboardStats {
	overview: {
		nextClass: string;
		gradeAverage: number;
		attendancePct: number;
		eventsPending: number;
	};
	classes: {
		name: string;
		time: string;
		room: string;
		teacher: string;
		type: string;
		accent?: string;
	}[];
	grades: {
		id: number;
		subject: string;
		date: string;
		weight: string;
		value: string;
		tone: 'good' | 'acceptable' | 'bad';
	}[];
	events: {
		title: string;
		date: string;
		time: string;
		type: string;
	}[];
}

type ScheduleDisplayRow = RowDataPacket & {
	name: string;
	startsAt: string;
	endsAt: string;
	location: string | null;
	teacherName: string | null;
	classType: string | null;
};

type GradeDetailRow = RowDataPacket & {
	gradeId: number;
	subjectName: string;
	value: number | string;
	weight: number | string;
	gradedOn: string;
};

type GradeAverageRow = RowDataPacket & {
	average: number | string | null;
};

type AttendanceSummaryRow = RowDataPacket & {
	numPresent: number | string | null;
	numAbsent: number | string | null;
};

type EventsUpcomingRow = RowDataPacket & {
	summary: string;
	eventDate: string;
	eventTime: string | null;
	type: string;
};

type EventsCountRow = RowDataPacket & {
	eventsPending: number;
};

const cleanTime = (time: string): string => time.slice(0, 5);
const formatDate = (date: string): string => date.slice(0, 10);

const toneForGrade = (value: number): 'good' | 'acceptable' | 'bad' => {
	if (value < 3) return 'bad';
	if (value < 4) return 'acceptable';
	return 'good';
};

const loadDashboard = async (user: User | null): Promise<DashboardStats> => {
	if (!user) throw new Error('User not authenticated');

	const [classesRows] = await db.execute<ScheduleDisplayRow[]>(
		`
		SELECT *
		FROM v_schedule_display
		WHERE userId = ?
			AND dayOfWeek = DAYNAME(CURDATE())
			AND endsAt >= CURTIME()
		ORDER BY startsAt
		LIMIT 3
		`,
		[user.id]
	);

	const [latestGradesRows] = await db.execute<GradeDetailRow[]>(
		`
		SELECT *
		FROM v_grade_details
		WHERE userId = ?
		ORDER BY gradedOn DESC, gradeId DESC
		LIMIT 3
		`,
		[user.id]
	);

	const [gradeAverageRows] = await db.execute<GradeAverageRow[]>(
		`
		SELECT SUM(value * weight) / NULLIF(SUM(weight), 0) AS average
		FROM grades
		WHERE userId = ?
		`,
		[user.id]
	);

	const [attendanceRows] = await db.execute<AttendanceSummaryRow[]>(
		`
		SELECT numPresent, numAbsent
		FROM v_attendance_summary
		WHERE userId = ?
		`,
		[user.id]
	);

	const [eventsRows] = await db.execute<EventsUpcomingRow[]>(
		`
		SELECT *
		FROM v_events_upcoming
		WHERE userId = ?
			AND eventDate >= CURDATE()
		ORDER BY eventDate, eventTime
		LIMIT 3
		`,
		[user.id]
	);

	const [eventsCountRows] = await db.execute<EventsCountRow[]>(
		`
		SELECT COUNT(*) AS eventsPending
		FROM events
		WHERE userId = ?
			AND eventDate >= CURDATE()
		`,
		[user.id]
	);

	const totalPresent = attendanceRows.reduce((sum, row) => sum + Number(row.numPresent ?? 0), 0);
	const totalAbsent = attendanceRows.reduce((sum, row) => sum + Number(row.numAbsent ?? 0), 0);
	const totalAttendance = totalPresent + totalAbsent;

	const gradeAverage = Number(gradeAverageRows[0]?.average ?? 0);
	const attendancePct = totalAttendance > 0 ? (totalPresent / totalAttendance) * 100 : 0;

	return {
		overview: {
			nextClass: classesRows[0]?.name ?? 'Brak zajęć',
			gradeAverage: Number(gradeAverage.toFixed(2)),
			attendancePct: Number(attendancePct.toFixed(1)),
			eventsPending: eventsCountRows[0]?.eventsPending ?? 0
		},
		classes: classesRows.map((row) => ({
			name: row.name,
			time: `${cleanTime(row.startsAt)} - ${cleanTime(row.endsAt)}`,
			room: row.location ?? '',
			teacher: row.teacherName ?? '',
			type: row.classType ?? ''
		})),
		grades: latestGradesRows.map((row) => {
			const value = Number(row.value);
			return {
				id: row.gradeId,
				subject: row.subjectName,
				date: formatDate(row.gradedOn),
				weight: Number(row.weight).toString(),
				value: value.toString(),
				tone: toneForGrade(value)
			};
		}),
		events: eventsRows.map((row) => ({
			title: row.summary,
			date: formatDate(row.eventDate),
			time: row.eventTime?.slice(0, 5) ?? '',
			type: row.type
		}))
	};
};

export const load: PageServerLoad = async ({ locals }): Promise<DashboardStats> =>
	loadDashboard(locals.user);