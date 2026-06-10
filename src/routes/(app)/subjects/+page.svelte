<script lang="ts">
	import SubjectCard from '$lib/components/app/subjects/SubjectCard.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const subjects = $derived(data.subjects);
</script>

<svelte:head>
	<title>Przedmioty - PASTA</title>
</svelte:head>

<section aria-labelledby="subjects-title" class="page-heading">
	<h1 id="subjects-title">Przedmioty</h1>
	<p>Semestr letni 2025/2026 · 3 przedmioty</p>
</section>

<section aria-label="Lista przedmiotów" class="subject-grid">
	{#each subjects as subject (subject.code)}
		<SubjectCard {...subject} />
	{/each}
</section>