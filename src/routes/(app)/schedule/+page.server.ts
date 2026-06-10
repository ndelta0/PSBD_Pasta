import type { PageServerLoad } from './$types';
import { type DayOfWeek, DayOfWeekValues } from '$lib/types';
import type { RowDataPacket } from 'mysql2';
import db from '$lib/server/db';

export interface ClassItem {
	name: string;
	time: string;
	room: string;
	teacher: string;
	type: string;
	accent?: string;
}

export interface ScheduleData {
	schedule: Record<DayOfWeek, ClassItem[]>;
}

type ScheduleDisplayRow = RowDataPacket & {
	scheduleEntryId: number;
	userId: number;
	subjectId: number;
	name: string;
	dayOfWeek: DayOfWeek;
	startsAt: string;
	endsAt: string;
	location: string;
	teacherName: string;
	classType: string;
};

export const load: PageServerLoad = async ({ locals }): Promise<ScheduleData> => {
	if (!locals.user) throw new Error('User not authenticated');

	const [rows] = await db.execute<ScheduleDisplayRow[]>(
		`
		SELECT *
		FROM v_schedule_display
		WHERE userId = ?`,
		[locals.user.id]
	);

	const cleanTime = (time: string): string => time.slice(0, 5);

	const rowToClassItem = (row: ScheduleDisplayRow): ClassItem => ({
		name: row.name,
		time: `${cleanTime(row.startsAt)} - ${cleanTime(row.endsAt)}`,
		room: row.location,
		teacher: row.teacherName,
		type: row.classType
	});

	const groupClassItemsByDay = (rows: ScheduleDisplayRow[]): Record<DayOfWeek, ClassItem[]> => {
		const map = new Map<DayOfWeek, ClassItem[]>();

		for (const day of DayOfWeekValues) {
			map.set(day, []);
		}

		for (const row of rows) {
			const day = row.dayOfWeek;
			const classItem = rowToClassItem(row);
			if (!map.has(day)) map.set(day, []);
			map.get(day)!.push(classItem);
		}

		// @ts-expect-error Map has all values
		return Object.fromEntries(map.entries());
	};

	return {
		schedule: groupClassItemsByDay(rows)
	};
};
