<script lang="ts">
	const subjects = [
		{
			name: 'Programowanie obiektowe',
			code: 'PROG-01',
			description: 'Podstawy programowania obiektowego w c++',
			ects: '6',
			coordinator: 'dr hab. Jan Kowalski',
			email: 'j.kowalski@uniwersytet.edu.pl',
			teachers: ['dr hab. Jan Kowalski', 'mgr Anna Nowak'],
			types: [
				{ label: 'Wykład', tone: 'purple' },
				{ label: 'Laboratorium', tone: 'amber' }
			],
			required: 'Obowiązkowy'
		},
		{
			name: 'Matematyka',
			code: 'MAT-01',
			description: 'Całki, kombinatoryka, logika matematyczna',
			ects: '15',
			coordinator: 'prof. dr hab. Katarzyna Zielińska',
			email: 'k.zielinska@uniwersytet.edu.pl',
			teachers: ['prof. dr hab. Katarzyna Zielińska', 'mgr Anna Nowak'],
			types: [
				{ label: 'Wykład', tone: 'purple' },
				{ label: 'Ćwiczenia', tone: 'green' }
			],
			required: 'Obowiązkowy'
		},
		{
			name: 'Systemy operacyjne',
			code: 'SO-01',
			description: 'Architektura systemów operacyjnych, zarządzanie procesami i pamięcią',
			ects: '2',
			coordinator: 'mgr Michał Dąbrowski',
			email: 'm.dabrowski@uniwersytet.edu.pl',
			teachers: ['mgr Michał Dąbrowski'],
			types: [
				{ label: 'Wykład', tone: 'purple' },
				{ label: 'Laboratorium', tone: 'amber' }
			],
			required: 'Obieralny'
		}
	];
</script>

<svelte:head>
	<title>Przedmioty - PASTA</title>
</svelte:head>

<section class="page-heading" aria-labelledby="subjects-title">
	<h1 id="subjects-title">Przedmioty</h1>
	<p>Semestr letni 2025/2026 · 3 przedmioty</p>
</section>

<section class="subject-grid" aria-label="Lista przedmiotów">
	{#each subjects as subject (subject.code)}
		<article class="panel subject-card">
			<header>
				<div>
					<h2>{subject.name}</h2>
					<p>{subject.code}</p>
				</div>
				<span class:elective={subject.required === 'Obieralny'}>{subject.required}</span>
			</header>

			<p class="subject-description">{subject.description}</p>
			<ul class="meta-list" aria-label="Informacje o przedmiocie">
				<li><span class="section-icon award" aria-hidden="true"></span>ECTS: {subject.ects}</li>
				<li><span class="mini-icon user" aria-hidden="true"></span>Koordynator: <strong>{subject.coordinator}</strong></li>
				<li><span class="mini-icon mail" aria-hidden="true"></span><strong>{subject.email}</strong></li>
			</ul>

			<div class="tag-block">
				<p>Prowadzący:</p>
				<div>
					{#each subject.teachers as teacher (teacher)}
						<span class="pill neutral">{teacher}</span>
					{/each}
				</div>
			</div>

			<div class="tag-block">
				<p>Typy zajęć:</p>
				<div>
					{#each subject.types as type (type.label)}
						<span class={`pill ${type.tone}`}>{type.label}</span>
					{/each}
				</div>
			</div>
		</article>
	{/each}
</section>
