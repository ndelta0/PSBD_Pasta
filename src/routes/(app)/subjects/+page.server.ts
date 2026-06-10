import type { PageServerLoad } from './$types';

export interface Subject {
	name: string;
	code: string;
	description?: string;
	ects: number;
	coordinator: string;
	coordinatorEmail: string;
	teachers: string[];
	types: ({ label: string; tone?: string } | string)[];
	presenceMandatory: boolean;
}

export interface SubjectData {
	subjects: Subject[];
}

const loadSubjects = (): SubjectData => {
	// TODO: Replace this mock subject catalog with database-backed subject enrollment data.
	return {
		subjects: [
			{
				name: 'Programowanie obiektowe',
				code: 'PROG',
				description: 'Podstawy programowania obiektowego w c++',
				ects: 6,
				coordinator: 'dr hab. Jan Kowalski',
				coordinatorEmail: 'j.kowalski@uniwersytet.edu.pl',
				teachers: ['dr hab. Jan Kowalski', 'mgr Anna Nowak'],
				types: ['Wykład', 'Laboratorium', 'Projekt'],
				presenceMandatory: true
			},
			{
				name: 'Matematyka',
				code: 'MAT',
				ects: 15,
				coordinator: 'prof. dr hab. Katarzyna Zielińska',
				coordinatorEmail: 'k.zielinska@uniwersytet.edu.pl',
				teachers: ['prof. dr hab. Katarzyna Zielińska', 'mgr Anna Nowak'],
				types: ['Wykład', 'Ćwiczenia'],
				presenceMandatory: true
			},
			{
				name: 'Systemy operacyjne',
				code: 'SOP',
				description: 'Architektura systemów operacyjnych, zarządzanie procesami i pamięcią',
				ects: 2,
				coordinator: 'mgr Michał Dąbrowski',
				coordinatorEmail: 'm.dabrowski@uniwersytet.edu.pl',
				teachers: ['mgr Michał Dąbrowski'],
				types: ['Wykład', 'Laboratorium', 'Seminarium'],
				presenceMandatory: false
			}
		]
	};
};

export const load: PageServerLoad = async () => loadSubjects();