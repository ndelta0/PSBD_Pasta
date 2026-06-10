<script lang="ts">
	import ClassEntryCard from '$lib/components/app/schedule/ClassEntryCard.svelte';
	import { type DayOfWeek, DayOfWeekValues } from '$lib/types';
	import type { PageData } from './$types';
	import { utils } from '$lib';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const today = () => {
		let dayNum = new Date().getDay();
		if (dayNum === 0) dayNum = 7;
		return DayOfWeekValues[dayNum - 1];
	};

	let selectedDay = $state<DayOfWeek>(today());
	const schedule = $derived(data.schedule);

	const visibleDays = $derived(DayOfWeekValues.filter((day) => schedule[day]?.length));

	const classes = $derived(schedule[selectedDay] ?? []);
</script>

<svelte:head>
	<title>Plan Zajęć - PASTA</title>
</svelte:head>

<section aria-labelledby="schedule-title" class="page-heading narrow">
	<h1 id="schedule-title">Plan Zajęć</h1>
</section>

<section aria-label="Plan tygodnia" class="panel schedule-panel">
	<div aria-label="Dni tygodnia" class="tabs" role="tablist">
		{#each visibleDays as day (day)}
			<button
				class:active={selectedDay === day}
				role="tab"
				aria-selected={selectedDay === day}
				type="button"
				onclick={() => (selectedDay = day)}
			>
				{utils.dayOfWeekLocalized(day)}
			</button>
		{/each}
	</div>

	<div class="stack">
		{#each classes as item (item.name)}
			<ClassEntryCard {...item} />
		{/each}
	</div>
</section>
