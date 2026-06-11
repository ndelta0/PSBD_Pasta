<script lang="ts">
	import type { PageData } from './$types';

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

		return `<!doctype html>
<html lang="pl">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Podsumowanie semestru - ${escapeHtml(semester.name)}</title>
		<style>
			:root {
				color: #202020;
				background: #f4f4f1;
				font-family:
					Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
			}

			body {
				margin: 0;
				padding: 32px;
			}

			main {
				max-width: 920px;
				margin: 0 auto;
				background: #ffffff;
				border: 1px solid #dddddd;
				border-radius: 8px;
				padding: 32px;
			}

			header {
				display: flex;
				justify-content: space-between;
				gap: 24px;
				border-bottom: 1px solid #e2e2e2;
				padding-bottom: 20px;
			}

			h1 {
				margin: 0;
				font-size: 30px;
			}

			p {
				margin: 8px 0 0;
				color: #676767;
			}

			.status {
				display: inline-flex;
				align-items: center;
				height: 28px;
				border-radius: 999px;
				background: #e6f6ee;
				padding: 0 12px;
				color: #2a7a46;
				font-weight: 800;
			}

			.stats {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: 12px;
				margin: 28px 0;
			}

			.stat {
				border: 1px solid #e0e0e0;
				border-radius: 8px;
				padding: 16px;
			}

			.stat strong,
			.stat span {
				display: block;
			}

			.stat strong {
				font-size: 26px;
			}

			.stat span {
				margin-top: 6px;
				color: #676767;
				font-size: 12px;
				font-weight: 800;
				text-transform: uppercase;
			}

			table {
				width: 100%;
				border-collapse: collapse;
			}

			th,
			td {
				border-bottom: 1px solid #e6e6e6;
				padding: 12px 10px;
				text-align: left;
			}

			th {
				color: #555555;
				font-size: 12px;
				text-transform: uppercase;
			}

			.actions {
				margin-top: 28px;
			}

			button {
				border: 0;
				border-radius: 6px;
				background: #2458ff;
				padding: 11px 16px;
				color: #ffffff;
				font: inherit;
				font-weight: 800;
				cursor: pointer;
			}

			@media print {
				body {
					background: #ffffff;
					padding: 0;
				}

				main {
					border: 0;
					padding: 0;
				}

				.actions {
					display: none;
				}
			}

			@media (max-width: 720px) {
				body {
					padding: 16px;
				}

				main {
					padding: 20px;
				}

				header,
				.stats {
					grid-template-columns: 1fr;
				}

				header {
					display: grid;
				}
			}
		</style>
	</head>
	<body>
		<main>
			<header>
				<div>
					<h1>${escapeHtml(semester.name)}</h1>
					<p>Podsumowanie semestru wygenerowane ${escapeHtml(generatedAt)} przez PASTA.</p>
				</div>
				<span class="status">${semester.current ? 'Trwa' : 'Zakończony'}</span>
			</header>

			<section class="stats" aria-label="Statystyki semestru">
				<div class="stat">
					<strong>${semester.gradeAvg.toFixed(2)}</strong>
					<span>Średnia</span>
				</div>
				<div class="stat">
					<strong>${semester.attendancePct.toFixed(1)}%</strong>
					<span>Frekwencja</span>
				</div>
				<div class="stat">
					<strong>${semester.ects}</strong>
					<span>ECTS</span>
				</div>
			</section>

			<section aria-labelledby="subjects-title">
				<h2 id="subjects-title">Przedmioty</h2>
				<table>
					<thead>
						<tr>
							<th>Przedmiot</th>
							<th>Ocena</th>
							<th>Frekwencja</th>
						</tr>
					</thead>
					<tbody>${subjectRows}</tbody>
				</table>
			</section>

			<div class="actions">
				<button type="button" onclick="window.print()">Drukuj / zapisz PDF</button>
			</div>
		</main>
	</body>
</html>`;
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