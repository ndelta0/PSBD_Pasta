import type { PageServerLoad } from './$types';
import { type DayOfWeek } from '$lib/types';

export interface ClassItem {
	name: string;
	time: string;
	room: string;
	teacher: string;
	type: string;
	accent?: string;
}

export type ScheduleData = {
	schedule: Record<DayOfWeek, ClassItem[]>;
};

const loadSchedule = (): ScheduleData => {
	// TODO: Replace this mock weekly schedule with a database query filtered by selectedDay.

	return {
		schedule: {
			Monday: [
				{
					name: 'Programowanie obiektowe',
					time: '8:15 - 10:00',
					room: 's. 308',
					teacher: 'dr hab. Jan Kowalski',
					type: 'Wykład'
				},
				{
					name: 'Matematyka',
					time: '10:15 - 12:00',
					room: 's. 011',
					teacher: 'mgr Anna Nowak',
					type: 'Ćwiczenia'
				},
				{
					name: 'Bazy danych',
					time: '14:15 - 16:00',
					room: 's. 720',
					teacher: 'dr Piotr Wiśniewski',
					type: 'Laboratorium'
				}
			],

			Tuesday: [
				{
					name: 'Systemy operacyjne',
					time: '8:15 - 10:00',
					room: 's. 402',
					teacher: 'mgr Michał Dąbrowski',
					type: 'Wykład'
				},
				{
					name: 'Fizyka',
					time: '12:15 - 14:00',
					room: 's. 118',
					teacher: 'dr Ewa Mazur',
					type: 'Ćwiczenia'
				}
			],

			Wednesday: [
				{
					name: 'Bazy danych',
					time: '9:15 - 11:00',
					room: 's. 720',
					teacher: 'dr Piotr Wiśniewski',
					type: 'Laboratorium'
				},
				{
					name: 'Matematyka',
					time: '13:15 - 15:00',
					room: 's. 011',
					teacher: 'prof. dr hab. Katarzyna Zielińska',
					type: 'Wykład'
				}
			],

			Thursday: [
				{
					name: 'Programowanie obiektowe',
					time: '10:15 - 12:00',
					room: 's. 316',
					teacher: 'mgr Anna Nowak',
					type: 'Laboratorium'
				},
				{
					name: 'Algorytmy i struktury danych',
					time: '14:15 - 16:00',
					room: 's. 205',
					teacher: 'dr Tomasz Wójcik',
					type: 'Ćwiczenia'
				}
			],

			Friday: [
				{
					name: 'Systemy operacyjne',
					time: '8:15 - 10:00',
					room: 's. 410',
					teacher: 'mgr Michał Dąbrowski',
					type: 'Laboratorium'
				},
				{
					name: 'Fizyka',
					time: '10:15 - 12:00',
					room: 's. 118',
					teacher: 'dr Ewa Mazur',
					type: 'Wykład'
				},
				{
					name: 'Konsultacje projektowe',
					time: '13:15 - 14:00',
					room: 's. 720',
					teacher: 'dr Piotr Wiśniewski',
					type: 'Projekt'
				}
			],

			Saturday: [],
			Sunday: []
		}
	};
};

export const load: PageServerLoad = async () => loadSchedule();