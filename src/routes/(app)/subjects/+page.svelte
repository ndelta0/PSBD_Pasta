<script lang="ts">
	import SubjectCard from '$lib/components/app/subjects/SubjectCard.svelte';
	import type { PageData } from './$types';
	import type { Subject } from './+page.server.ts';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const subjects = $derived(data.subjects);

	const getNumberOfSubjectsLine = (subjects: Subject[]) => {
		const n = subjects.length;
		if (n == 1) return '1 przedmiot';
		if (n < 5) return `${n} przedmioty`;
		return `${n} przedmiotów`;
	};
</script>

<svelte:head>
	<title>Przedmioty - PASTA</title>
</svelte:head>

<section aria-labelledby="subjects-title" class="page-heading">
	<h1 id="subjects-title">Przedmioty</h1>
	<p>{getNumberOfSubjectsLine(subjects)}</p>
</section>

<section aria-label="Lista przedmiotów" class="subject-grid">
	{#each subjects as subject (subject.code)}
		<SubjectCard {...subject} />
	{/each}
</section>
