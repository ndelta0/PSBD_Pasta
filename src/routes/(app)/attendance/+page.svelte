<script lang="ts">
	import type { PageData } from './$types';
	import SummaryCard from '$lib/components/app/attendance/SummaryCard.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const stats = $derived(data.stats);
	const recent = $derived(data.recent);
	const subjects = $derived(data.subjects);

	const attendancePct = $derived((stats.numPresent / (stats.numPresent + stats.numAbsent)) * 100);

	const toneForPresence = (present: boolean) => (present ? 'green' : 'red');
	const statusForPresence = (present: boolean) => (present ? 'Obecny' : 'Nieobecny');

	const colorForSubject = (numAbsent: number): string => {
		if (numAbsent == 0) return '#5fc4a0';
		if (numAbsent == 1) return '#ffbd50';
		return '#ff6b86';
	};

	const pctPresentForSubject = (numPresent: number, numAbsent: number): number => {
		const total = numPresent + numAbsent;
		if (total == 0) return 0;
		return (numPresent / total) * 100;
	};

	const scoreForSubject = (numPresent: number, numAbsent: number): string => {
		const pct = pctPresentForSubject(numPresent, numAbsent);
		return `${numPresent}/${numPresent + numAbsent} (${pct.toFixed(1)}%)`;
	};
</script>

<svelte:head>
	<title>Frekwencja - PASTA</title>
</svelte:head>

<section class="page-heading" aria-labelledby="attendance-title">
	<h1 id="attendance-title">Frekwencja</h1>
	<p>Zarządzaj obecnościami i śledź postępy</p>
</section>

<section class="attendance-stats" aria-label="Podsumowanie frekwencji">
	<SummaryCard
		icon="trend"
		label="Ogólna obeność"
		tone="green"
		value={`${attendancePct.toFixed(1)}%`}
	/>
	<SummaryCard icon="check" label="Obecności" tone="green" value={stats.numPresent} />
	<SummaryCard icon="x-circle" label="Nieobecności" tone="red" value={stats.numAbsent} />
	<SummaryCard
		icon="clock-large"
		label="Łączna liczba zajęć"
		tone="gray"
		value={stats.numPresent + stats.numAbsent}
	/>
</section>

<div class="dashboard-grid">
	<section class="panel attendance-summary" aria-labelledby="attendance-summary-title">
		<h2 id="attendance-summary-title">Podsumowanie frekwencji</h2>
		<div class="pie-layout">
			<div
				aria-label={`Obecności ${stats.numPresent}, nieobecności ${stats.numAbsent}`}
				class="pie-chart"
				style:--present-percent={`${attendancePct.toFixed(2)}%`}
			></div>
			<div class="legend">
				<p><span class="legend-swatch green"></span>Obecności: {stats.numPresent}</p>
				<p><span class="legend-swatch red"></span>Nieobecności: {stats.numAbsent}</p>
			</div>
		</div>
	</section>

	<section class="panel recent-attendance" aria-labelledby="recent-attendance-title">
		<h2 id="recent-attendance-title">Ostatnie zajęcia</h2>
		<div class="stack">
			{#each recent as item (item.name)}
				<article class="attendance-row">
					<span class={`status-ring ${toneForPresence(item.wasPresent)}`} aria-hidden="true"></span>
					<div>
						<h3>{item.name}</h3>
						<p>{item.details}</p>
					</div>
					<strong class={toneForPresence(item.wasPresent)}
						>{statusForPresence(item.wasPresent)}</strong
					>
				</article>
			{/each}
		</div>
	</section>
</div>

<section class="panel subject-attendance" aria-labelledby="subject-attendance-title">
	<h2 id="subject-attendance-title">Frekwencja według przedmiotów</h2>
	<div class="progress-list">
		{#each subjects as subject (subject.name)}
			<div
				class="progress-item"
				style:--bar-color={colorForSubject(subject.numAbsent)}
				style:--bar-width={`${pctPresentForSubject(subject.numPresent, subject.numAbsent).toFixed(1)}%`}
			>
				<div>
					<span>{subject.name}</span>
					<strong>{scoreForSubject(subject.numPresent, subject.numAbsent)}</strong>
				</div>
				<div class="progress-track"><span></span></div>
			</div>
		{/each}
	</div>
</section>
