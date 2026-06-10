import type { PageServerLoad } from './$types';

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

const loadGrades = (): SubjectGrades => {
	// TODO: Replace this mock gradebook with database-backed grades and grade labels.

	return {
		subjects: {
			Matematyka: [
				{ id: 1, value: 5, name: 'Egzamin', date: '2026-05-20', weight: 3 },
				{ id: 2, value: 4.5, name: 'Wejściówka', date: '2026-05-10', weight: 2 },
				{ id: 3, value: 5, name: 'Aktywność', date: '2026-05-15', weight: 1 }
			],
			'Programowanie obiektowe': [
				{ id: 4, value: 4, name: 'Egzamin', date: '2026-05-18', weight: 3 },
				{ id: 5, value: 2, name: 'Kolokwium', date: '2026-05-20', weight: 2 },
				{ id: 6, value: 3.5, name: 'Kartkówka', date: '2026-04-05', weight: 1 }
			],
			'Bazy danych': [
				{ id: 7, value: 5, name: 'Projekt', date: '2026-05-20', weight: 3 },
				{ id: 8, value: 5, name: 'Kolokwium', date: '2026-05-10', weight: 2 }
			]
		}
	};
};

export const load: PageServerLoad = async () => loadGrades();