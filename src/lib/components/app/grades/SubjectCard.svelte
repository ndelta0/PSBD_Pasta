<script lang="ts">
	import { utils } from '$lib';
	import type { Grade } from '../../../../routes/(app)/grades/+page.server.ts';
	import SubjectGradeEntry from '$lib/components/app/grades/SubjectGradeEntry.svelte';

	interface Props {
		name: string;
		grades: Grade[];
	}

	const {
		name,
		grades
	}: Props = $props();

	const average = $derived(utils.weightedAverage(grades.map((grade) => grade.value), grades.map((grade) => grade.weight)));
</script>

<article class="panel grade-subject-card">
	<h2>{name}</h2>
	<p>Średnia ważona: {average.toFixed(2)}</p>
	<div class="stack">
		{#each grades as grade (grade.id)}
			<SubjectGradeEntry {...grade} />
		{/each}
	</div>
</article>