<script lang="ts">
	import DashboardStatCard from '$lib/components/app/DashboardStatCard.svelte';
	import DashboardClassCard from '$lib/components/app/DashboardClassCard.svelte';
	import type { PageData } from './$types';
	import DashboardGradeCard from '$lib/components/app/DashboardGradeCard.svelte';
	import DashboardEventCard from '$lib/components/app/DashboardEventCard.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const overview = $derived(data.overview);
	const classes = $derived(data.classes);
	const grades = $derived(data.grades);
	const events = $derived(data.events);
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
	<p>Witaj <strong>{data.user?.name}</strong>! Oto podsumowanie Twojego semestru:</p>
</section>

<section class="stats-grid" aria-label="Podsumowanie semestru">
	<DashboardStatCard accent="#9a7cff" icon="book" title="Najbliższe zajęcia" value={overview.nextClass} />
	<DashboardStatCard accent="#54c69a" icon="trend" title="Średnia ocen" value={overview.gradeAverage} />
	<DashboardStatCard accent="#f0ad34" icon="check" title="Frekwencja" value={overview.attendancePct} />
	<DashboardStatCard accent="#ff697a" icon="calendar" title="Wydarzenia" value={overview.eventsPending} />
</section>

<div class="dashboard-grid">
	<section class="panel" aria-labelledby="today-title">
		<h2 id="today-title">Dzisiejsze zajęcia</h2>
		<div class="stack">
			{#each classes as item}
				<DashboardClassCard {...item} />
			{/each}
		</div>
	</section>

	<section class="panel" aria-labelledby="grades-title">
		<h2 id="grades-title" class="with-icon">
			<span class="section-icon award" aria-hidden="true"></span>
			Ostatnie oceny
		</h2>
		<div class="stack">
			{#each grades as grade (`${grade.subject}-${grade.date}-${grade.value}`)}
				<DashboardGradeCard {...grade} />
			{/each}
		</div>
	</section>
</div>

<section class="panel events-panel" aria-labelledby="events-title">
	<h2 id="events-title">Nadchodzące wydarzenia</h2>
	<div class="events-grid compact">
		{#each events as event (`${event.title}-${event.date}-${event.time}`)}
			<DashboardEventCard {...event} />
		{/each}
	</div>
</section>