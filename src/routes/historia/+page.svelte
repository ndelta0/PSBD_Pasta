<script lang="ts">
	const semesters = [
		{
			name: 'Semestr zimowy 2024/2025',
			status: 'Zakończony',
			average: '4.35',
			attendance: '94%',
			ects: '30',
			subjects: [
				{ name: 'Algorytmy i struktury danych', grade: '4.5', attendance: '96%' },
				{ name: 'Fizyka', grade: '4.0', attendance: '90%' },
				{ name: 'Analiza matematyczna', grade: '4.5', attendance: '95%' }
			]
		},
		{
			name: 'Semestr letni 2024/2025',
			status: 'Zakończony',
			average: '4.10',
			attendance: '91%',
			ects: '28',
			subjects: [
				{ name: 'Podstawy programowania', grade: '5.0', attendance: '100%' },
				{ name: 'Algebra liniowa', grade: '4.0', attendance: '89%' },
				{ name: 'Architektura komputerów', grade: '3.5', attendance: '86%' }
			]
		},
		{
			name: 'Semestr zimowy 2023/2024',
			status: 'Zakończony',
			average: '4.00',
			attendance: '88%',
			ects: '30',
			subjects: [
				{ name: 'Wstęp do informatyki', grade: '4.5', attendance: '92%' },
				{ name: 'Matematyka dyskretna', grade: '3.5', attendance: '84%' },
				{ name: 'Technologie internetowe', grade: '4.0', attendance: '89%' }
			]
		}
	];
</script>

<svelte:head>
	<title>Historia - PASTA</title>
</svelte:head>

<section class="page-heading" aria-labelledby="history-title">
	<h1 id="history-title">Historia</h1>
	<p>Przegląd poprzednich semestrów, ocen i frekwencji</p>
</section>

<section class="history-grid" aria-label="Historia poprzednich semestrów">
	{#each semesters as semester (semester.name)}
		<article class="panel history-card">
			<header>
				<div>
					<h2>{semester.name}</h2>
					<p>ECTS: {semester.ects} · Średnia: {semester.average} · Frekwencja: {semester.attendance}</p>
				</div>
				<span>{semester.status}</span>
			</header>

			<div class="history-stats">
				<div>
					<strong>{semester.average}</strong>
					<span>Średnia</span>
				</div>
				<div>
					<strong>{semester.attendance}</strong>
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
							<p>Frekwencja: {subject.attendance}</p>
						</div>
						<strong>{subject.grade}</strong>
					</div>
				{/each}
			</div>
		</article>
	{/each}
</section>
