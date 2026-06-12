<script lang="ts">
	import type { PageData } from './$types';
	import templateSemesterSummary from '$lib/templates/semester_summary.html?raw';

	interface Props {
		data: PageData;
	}

	type SemesterSummary = PageData['semesters'][number];

	let { data }: Props = $props();

	const semesters = $derived(data.semesters);

	const toneForGrade = (grade: number) => (grade < 3 ? 'bad' : grade < 4 ? 'acceptable' : 'good');

	const escapeHtml = (value: string | number) =>
		String(value)
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll('\'', '&#39;');

	const filenameForSemester = (semesterName: string) =>
		`podsumowanie-${semesterName
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '')}.html`;

	const buildSemesterSummaryHtml = (semester: SemesterSummary) => {
		const generatedAt = new Intl.DateTimeFormat('pl-PL', {
			dateStyle: 'long',
			timeStyle: 'short'
		}).format(new Date());

		const subjectRows =
			semester.subjects.length > 0
				? semester.subjects
					.map(
						(subject) => `
								<tr>
									<td>${escapeHtml(subject.name)}</td>
									<td>${subject.grade.toFixed(2)}</td>
									<td>${subject.attendancePct.toFixed(1)}%</td>
								</tr>
							`
					)
					.join('')
				: '<tr><td colspan="3">Brak przedmiotów w tym semestrze.</td></tr>';

		return templateSemesterSummary
			.replaceAll('{{SEMESTER_NAME}}', escapeHtml(semester.name))
			.replaceAll('{{GENERATED_AT}}', generatedAt)
			.replaceAll('{{SEMESTER_STATUS}}', semester.current ? 'Trwa' : 'Zakończony')
			.replaceAll('{{GRADE_AVG}}', semester.gradeAvg.toFixed(2))
			.replaceAll('{{ATTENDANCE_PCT}}', semester.attendancePct.toFixed(1))
			.replaceAll('{{ECTS}}', semester.ects.toString())
			.replaceAll('{{SUBJECT_ROWS}}', subjectRows);
	};

	const downloadSemesterSummary = (semester: SemesterSummary) => {
		const blob = new Blob([buildSemesterSummaryHtml(semester)], {
			type: 'text/html;charset=utf-8'
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.href = url;
		link.download = filenameForSemester(semester.name);
		document.body.append(link);
		link.click();
		link.remove();
		setTimeout(() => URL.revokeObjectURL(url), 0);
	};
</script>

<svelte:head>
	<title>Historia - PASTA</title>
</svelte:head>

<section aria-labelledby="history-title" class="page-heading">
	<h1 id="history-title">Historia</h1>
	<p>Przegląd poprzednich semestrów, ocen i frekwencji</p>
</section>

<section aria-label="Historia poprzednich semestrów" class="history-grid">
	{#each semesters as semester (semester.name)}
		<article class="panel history-card">
			<header>
				<div>
					<h2>{semester.name}</h2>
				</div>
				<div class="history-card-actions">
					<button
						aria-label={`Pobierz podsumowanie semestru ${semester.name} jako HTML`}
						class="ghost-button history-download-button"
						onclick={() => downloadSemesterSummary(semester)}
						type="button"
					>
						Pobierz HTML
					</button>
					<span
						class="semester-status {semester.current ? 'ongoing' : 'finished'}">{semester.current ? 'Trwa' : 'Zakończony'}</span>
				</div>
			</header>

			<div class="history-stats">
				<div>
					<strong>{semester.gradeAvg.toFixed(2)}</strong>
					<span>Średnia</span>
				</div>
				<div>
					<strong>{semester.attendancePct.toFixed(1)}%</strong>
					<span>Frekwencja</span>
				</div>
				<div>
					<strong>{semester.ects}</strong>
					<span>ECTS</span>
				</div>
			</div>

			<div class="history-subjects">
				{#each semester.subjects as subject (subject.name)}
					<div>
						<div>
							<h3>{subject.name}</h3>
							<p>Frekwencja: {subject.attendancePct}%</p>
						</div>
						<strong class={toneForGrade(subject.grade)}>{subject.grade.toFixed(2)}</strong>
					</div>
				{/each}
			</div>
		</article>
	{/each}
</section>