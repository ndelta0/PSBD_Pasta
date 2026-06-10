import type { PageServerLoad } from './$types';

export interface SemesterSummary {
	name: string;
	gradeAvg: number;
	attendancePct: number;
	ects: number;
	subjects: {
		name: string;
		grade: number;
		attendancePct: number;
	}[];
}

export interface HistoryData {
	semesters: SemesterSummary[];
}

const loadHistory = (): HistoryData => {
	// TODO: Replace this mock semester history with database-backed historical student records.
	return {
		semesters: [
			{
				name: 'Semestr zimowy 2024/2025',
				gradeAvg: 4.35,
				attendancePct: 94,
				ects: 30,
				subjects: [
					{ name: 'Algorytmy i struktury danych', grade: 4.5, attendancePct: 96 },
					{ name: 'Fizyka', grade: 4, attendancePct: 90 },
					{ name: 'Analiza matematyczna', grade: 4.5, attendancePct: 95 }
				]
			},
			{
				name: 'Semestr letni 2024/2025',
				gradeAvg: 4.1,
				attendancePct: 91,
				ects: 28,
				subjects: [
					{ name: 'Podstawy programowania', grade: 5, attendancePct: 100 },
					{ name: 'Algebra liniowa', grade: 4, attendancePct: 89 },
					{ name: 'Architektura komputerów', grade: 3.5, attendancePct: 86 }
				]
			},
			{
				name: 'Semestr zimowy 2023/2024',
				gradeAvg: 4,
				attendancePct: 88,
				ects: 30,
				subjects: [
					{ name: 'Wstęp do informatyki', grade: 4.5, attendancePct: 92 },
					{ name: 'Matematyka dyskretna', grade: 3.5, attendancePct: 84 },
					{ name: 'Technologie internetowe', grade: 4, attendancePct: 89 }
				]
			}
		]
	};
};

export const load: PageServerLoad = async () => loadHistory();