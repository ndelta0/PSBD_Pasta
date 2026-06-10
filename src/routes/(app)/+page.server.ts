import type { PageServerLoad } from './$types';

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

const loadDashboard = (): DashboardStats => {
	// TODO: Replace this mock dashboard snapshot with data loaded from the database.
	return {
		overview: {
			nextClass: 'Bazy danych',
			gradeAverage: 4.2,
			attendancePct: 92,
			eventsPending: 5
		},
		classes: [
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
		grades: [
			{
				subject: 'Programowanie obiektowe',
				date: '2026-05-20',
				weight: '3',
				value: '5',
				tone: 'good'
			},
			{ subject: 'Fizyka', date: '2026-05-18', weight: '2', value: '2', tone: 'bad' },
			{ subject: 'Matematyka', date: '2026-05-15', weight: '1', value: '3', tone: 'acceptable' }
		],
		events: [
			{ title: 'Egzamin z Fizyki', date: '2026-05-25', time: '10:15', type: 'Egzamin' },
			{ title: 'Kolokwium z Matematyki', date: '2026-05-28', time: '14:15', type: 'Kolokwium' },
			{ title: 'Projekt z Programowania', date: '2026-05-27', time: '23:59', type: 'Projekt' }
		]
	};
};

export const load: PageServerLoad = async () => loadDashboard();