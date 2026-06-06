<script lang="ts">
	const stats = [
		{ label: 'Ogólna frekwencja', value: '90.5 %', icon: 'trend', tone: 'green' },
		{ label: 'Obecności', value: '42', icon: 'check', tone: 'green' },
		{ label: 'Nieobecności', value: '3', icon: 'x-circle', tone: 'red' },
		{ label: 'Łączna liczba zajęć', value: '45', icon: 'clock-large', tone: 'gray' }
	];

	const recent = [
		{ name: 'Programowanie obiektowe', details: 'Laboratorium · 2026-05-21', status: 'Obecny', tone: 'green' },
		{ name: 'Matematyka', details: 'Wykład · 2026-05-21', status: 'Obecny', tone: 'green' },
		{ name: 'Algorytmy i struktury danych', details: 'Ćwiczenia · 2026-05-21', status: 'Nieobecny', tone: 'red' }
	];

	const subjects = [
		{ name: 'Programowanie obiektowe', score: '15/15 (100%)', width: '100%', color: '#5fc4a0' },
		{ name: 'Matematyka', score: '14/15 (93.3%)', width: '93.3%', color: '#ffbd50' },
		{ name: 'Fizyka', score: '13/15 (86.7%)', width: '86.7%', color: '#ff6b86' }
	];
</script>

<svelte:head>
	<title>Frekwencja - PASTA</title>
</svelte:head>

<section class="page-heading" aria-labelledby="attendance-title">
	<h1 id="attendance-title">Frekwencja</h1>
	<p>Zarządzaj obecnościami i śledź postępy</p>
</section>

<section class="attendance-stats" aria-label="Podsumowanie frekwencji">
	{#each stats as stat (stat.label)}
		<article class="panel attendance-stat">
			<span class={`attendance-icon ${stat.tone}`} data-icon={stat.icon} aria-hidden="true"></span>
			<div>
				<h2>{stat.label}</h2>
				<p>{stat.value}</p>
			</div>
		</article>
	{/each}
</section>

<div class="dashboard-grid">
	<section class="panel attendance-summary" aria-labelledby="attendance-summary-title">
		<h2 id="attendance-summary-title">Podsumowanie frekwencji</h2>
		<div class="pie-layout">
			<div class="pie-chart" aria-label="Obecności 92, nieobecności 8"></div>
			<div class="legend">
				<p><span class="legend-swatch green"></span>Obecności: 92</p>
				<p><span class="legend-swatch red"></span>nieobecności: 8</p>
			</div>
		</div>
	</section>

	<section class="panel recent-attendance" aria-labelledby="recent-attendance-title">
		<h2 id="recent-attendance-title">Ostatnie zajęcia</h2>
		<div class="stack">
			{#each recent as item (item.name)}
				<article class="attendance-row">
					<span class={`status-ring ${item.tone}`} aria-hidden="true"></span>
					<div>
						<h3>{item.name}</h3>
						<p>{item.details}</p>
					</div>
					<strong class={item.tone}>{item.status}</strong>
				</article>
			{/each}
		</div>
	</section>
</div>

<section class="panel subject-attendance" aria-labelledby="subject-attendance-title">
	<h2 id="subject-attendance-title">Frekwencja według przedmiotów</h2>
	<div class="progress-list">
		{#each subjects as subject (subject.name)}
			<div class="progress-item" style:--bar-color={subject.color} style:--bar-width={subject.width}>
				<div>
					<span>{subject.name}</span>
					<strong>{subject.score}</strong>
				</div>
				<div class="progress-track"><span></span></div>
			</div>
		{/each}
	</div>
</section>
