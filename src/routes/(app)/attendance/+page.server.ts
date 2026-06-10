import type { PageServerLoad } from './$types';

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

const loadAttendance = (): AttendanceSummary => {
	// TODO: Replace this mock attendance data with database-backed attendance records.

	return {
		stats: {
			numPresent: 42,
			numAbsent: 3
		},
		recent: [
			{
				name: 'Programowanie obiektowe',
				details: 'Laboratorium · 2026-05-21',
				wasPresent: true
			},
			{
				name: 'Matematyka',
				details: 'Wykład · 2026-05-21',
				wasPresent: true
			},
			{
				name: 'Algorytmy i struktury danych',
				details: 'Ćwiczenia · 2026-05-21',
				wasPresent: false
			}
		],
		subjects: [
			{
				name: 'Programowanie obiektowe',
				numPresent: 15,
				numAbsent: 0
			},
			{
				name: 'Matematyka',
				numPresent: 14,
				numAbsent: 1
			},
			{
				name: 'Fizyka',
				numPresent: 13,
				numAbsent: 2
			}
		]
	};
};

export const load: PageServerLoad = async () => loadAttendance();