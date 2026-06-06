<script lang="ts">
	type Stat = {
		label: string;
		value: string;
		icon: string;
		accent: string;
	};

	type ClassItem = {
		name: string;
		time: string;
		room: string;
		teacher: string;
		type: string;
		accent: string;
	};

	type Grade = {
		subject: string;
		date: string;
		weight: string;
		value: string;
		tone: 'good' | 'bad';
	};

	type EventItem = {
		title: string;
		date: string;
		time: string;
		type: string;
	};

	const stats: Stat[] = [
		{ label: 'Najbliższe zajęcia', value: 'Bazy danych', icon: 'book', accent: '#9a7cff' },
		{ label: 'Średnia ocen', value: '4.2', icon: 'trend', accent: '#54c69a' },
		{ label: 'Frekwencja', value: '92%', icon: 'check', accent: '#f0ad34' },
		{ label: 'Wydarzenia', value: '5', icon: 'calendar', accent: '#ff697a' }
	];

	const classes: ClassItem[] = [
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
	];

	const grades: Grade[] = [
		{ subject: 'Programowanie obiektowe', date: '2026-05-20', weight: 'Waga: 3', value: '5.0', tone: 'good' },
		{ subject: 'Fizyka', date: '2026-05-18', weight: 'Waga: 2', value: '2.0', tone: 'bad' },
		{ subject: 'Matematyka', date: '2026-05-15', weight: 'Waga: 1', value: '4.0', tone: 'good' }
	];

	const events: EventItem[] = [
		{ title: 'Egzamin z Fizyki', date: '2026-05-25', time: '10:15', type: 'Egzamin' },
		{ title: 'Kolokwium z Matematyki', date: '2026-05-28', time: '14:15', type: 'Kolokwium' },
		{ title: 'Projekt z Programowania', date: '2026-05-27', time: '23:59', type: 'Projekt' }
	];
</script>

<svelte:head>
	<title>Dashboard - PASTA</title>
	<meta
		name="description"
		content="Dashboard aplikacji PASTA z planem zajęć, ocenami i wydarzeniami."
	/>
</svelte:head>

<section class="page-heading" aria-labelledby="dashboard-title">
	<h1 id="dashboard-title">Dashboard</h1>
	<p>Witaj ponownie! Oto podsumowanie Twojego semestru</p>
</section>

<section class="stats-grid" aria-label="Podsumowanie semestru">
	{#each stats as stat}
		<article class="stat-card">
			<div>
				<h2>{stat.label}</h2>
				<p>{stat.value}</p>
			</div>
			<span class="stat-icon" data-icon={stat.icon} style:--accent={stat.accent} aria-hidden="true"></span>
		</article>
	{/each}
</section>

<div class="dashboard-grid">
	<section class="panel" aria-labelledby="today-title">
		<h2 id="today-title">Dzisiejsze zajęcia</h2>
		<div class="stack">
			{#each classes as item}
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

	<section class="panel" aria-labelledby="grades-title">
		<h2 id="grades-title" class="with-icon">
			<span class="section-icon award" aria-hidden="true"></span>
			Ostatnie oceny
		</h2>
		<div class="stack">
			{#each grades as grade}
				<article class="grade-row">
					<div>
						<h3>{grade.subject}</h3>
						<p>
							<span class="mini-icon clock" aria-hidden="true"></span>{grade.date}
						</p>
						<p>
							<span class="mini-icon scale" aria-hidden="true"></span>{grade.weight}
						</p>
					</div>
					<strong class={grade.tone}>{grade.value}</strong>
				</article>
			{/each}
		</div>
	</section>
</div>

<section class="panel events-panel" aria-labelledby="events-title">
	<h2 id="events-title">Nadchodzące wydarzenia</h2>
	<div class="events-grid compact">
		{#each events as event}
			<article class="event-row">
				<div class="event-icon" aria-hidden="true">
					<span class="nav-icon" data-icon="calendar"></span>
				</div>
				<div>
					<h3>{event.title}</h3>
					<p>
						{event.date}
						<span class="mini-icon clock" aria-hidden="true"></span>{event.time}
					</p>
				</div>
				<strong>{event.type}</strong>
			</article>
		{/each}
	</div>
</section>
