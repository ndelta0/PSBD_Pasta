import type { PageServerLoad } from './$types';

export interface Event {
	id: number;
	title: string;
	date: string;
	time: string;
	subject: string;
	description: string;
	type: string;
	tone: 'red' | 'amber' | 'green' | 'purple';
}

export interface EventsData {
	events: Event[];
}

const loadEvents = (): EventsData => {
	// TODO: Replace this mock event list with database-backed events for the logged-in user.

	return {
		events: [
			{
				id: 1,
				title: 'Egzamin z programowania',
				date: '2026-05-27',
				time: '10:15',
				subject: 'Programowanie obiektowe',
				description: 'Egzamin końcowy obejmujący materiał z całego semestru',
				type: 'Egzamin',
				tone: 'red'
			},
			{
				id: 2,
				title: 'Oddanie projektu',
				date: '2026-05-28',
				time: '23:59',
				subject: 'Bazy danych',
				description: 'Projekt końcowy - system zarządzania bazą danych',
				type: 'Projekt',
				tone: 'amber'
			},
			{
				id: 3,
				title: 'Kolokwium - Matematyka',
				date: '2026-05-29',
				time: '12:15',
				subject: 'Matematyka',
				description: 'Kolokwium z kombinatoryki',
				type: 'Kolokwium',
				tone: 'green'
			},
			{
				id: 4,
				title: 'Prezentacja projektu',
				date: '2026-05-29',
				time: '14:15',
				subject: 'Algorytmy i struktury danych',
				description: 'Prezentowanie implementacji algorytmów sortowania',
				type: 'Prezentacja',
				tone: 'purple'
			}
		]
	};
};

export const load: PageServerLoad = async () => loadEvents();