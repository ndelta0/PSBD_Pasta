<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const semesters = $derived(data.semesters);

	const toneForGrade = (grade: number) => (grade < 3 ? 'bad' : grade < 4 ? 'acceptable' : 'good');
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
				<span>{semester.current ? 'Trwa' : 'Zakończony'}</span>
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
