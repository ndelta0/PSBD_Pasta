<script lang="ts">
	type ClassItem = {
		name: string;
		time: string;
		room: string;
		teacher: string;
		type: string;
		accent: string;
	};

	const days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'] as const;
	type Day = (typeof days)[number];

	let selectedDay = $state<Day>('Poniedziałek');

	const schedule: Record<Day, ClassItem[]> = {
		Poniedziałek: [
			{
				name: 'Programowanie obiektowe',
				time: '8:15 - 10:00',
				room: 's. 308',
				teacher: 'dr hab. Jan Kowalski',
				type: 'Wykład',
				accent: '#9a7cff'
			},
			{
				name: 'Matematyka',
				time: '10:15 - 12:00',
				room: 's. 011',
				teacher: 'mgr Anna Nowak',
				type: 'Ćwiczenia',
				accent: '#54c69a'
			},
			{
				name: 'Bazy danych',
				time: '14:15 - 16:00',
				room: 's. 720',
				teacher: 'dr Piotr Wiśniewski',
				type: 'Laboratorium',
				accent: '#d8a12d'
			}
		],
		Wtorek: [
			{
				name: 'Systemy operacyjne',
				time: '8:15 - 10:00',
				room: 's. 402',
				teacher: 'mgr Michał Dąbrowski',
				type: 'Wykład',
				accent: '#9a7cff'
			},
			{
				name: 'Fizyka',
				time: '12:15 - 14:00',
				room: 's. 118',
				teacher: 'dr Ewa Mazur',
				type: 'Ćwiczenia',
				accent: '#54c69a'
			}
		],
		Środa: [
			{
				name: 'Bazy danych',
				time: '9:15 - 11:00',
				room: 's. 720',
				teacher: 'dr Piotr Wiśniewski',
				type: 'Laboratorium',
				accent: '#d8a12d'
			},
			{
				name: 'Matematyka',
				time: '13:15 - 15:00',
				room: 's. 011',
				teacher: 'prof. dr hab. Katarzyna Zielińska',
				type: 'Wykład',
				accent: '#9a7cff'
			}
		],
		Czwartek: [
			{
				name: 'Programowanie obiektowe',
				time: '10:15 - 12:00',
				room: 's. 316',
				teacher: 'mgr Anna Nowak',
				type: 'Laboratorium',
				accent: '#d8a12d'
			},
			{
				name: 'Algorytmy i struktury danych',
				time: '14:15 - 16:00',
				room: 's. 205',
				teacher: 'dr Tomasz Wójcik',
				type: 'Ćwiczenia',
				accent: '#54c69a'
			}
		],
		Piątek: [
			{
				name: 'Systemy operacyjne',
				time: '8:15 - 10:00',
				room: 's. 410',
				teacher: 'mgr Michał Dąbrowski',
				type: 'Laboratorium',
				accent: '#d8a12d'
			},
			{
				name: 'Fizyka',
				time: '10:15 - 12:00',
				room: 's. 118',
				teacher: 'dr Ewa Mazur',
				type: 'Wykład',
				accent: '#9a7cff'
			},
			{
				name: 'Konsultacje projektowe',
				time: '13:15 - 14:00',
				room: 's. 720',
				teacher: 'dr Piotr Wiśniewski',
				type: 'Projekt',
				accent: '#ff697a'
			}
		]
	};

	const classes = $derived(schedule[selectedDay]);
</script>

<svelte:head>
	<title>Plan Zajęć - PASTA</title>
</svelte:head>

<section class="page-heading narrow" aria-labelledby="schedule-title">
	<h1 id="schedule-title">Plan Zajęć</h1>
	<p>Semestr letni 2025/2026</p>
</section>

<section class="panel schedule-panel" aria-label="Plan tygodnia">
	<div class="tabs" role="tablist" aria-label="Dni tygodnia">
		{#each days as day (day)}
			<button
				class:active={selectedDay === day}
				role="tab"
				aria-selected={selectedDay === day}
				type="button"
				onclick={() => (selectedDay = day)}
			>
				{day}
			</button>
		{/each}
	</div>

	<div class="stack">
		{#each classes as item (item.name)}
			<article class="lesson-row">
				<div>
					<h3>{item.name}</h3>
					<p>
						<span class="mini-icon clock" aria-hidden="true"></span>{item.time}
					</p>
					<p>
						<span class="mini-icon pin" aria-hidden="true"></span>{item.room}
						<span class="mini-icon user" aria-hidden="true"></span>{item.teacher}
					</p>
				</div>
				<strong style:color={item.accent}>{item.type}</strong>
			</article>
		{/each}
	</div>
</section>
