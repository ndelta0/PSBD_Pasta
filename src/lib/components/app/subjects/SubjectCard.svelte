<script lang="ts">
	import { utils } from '$lib';

	interface Props {
		name: string;
		code: string;
		description?: string;
		ects: number;
		coordinator: string;
		coordinatorEmail: string;
		teachers: string[];
		types: ({ label: string, tone?: string } | string)[];
		presenceMandatory: boolean;
	}

	const {
		name,
		code,
		description,
		ects,
		coordinator,
		coordinatorEmail,
		teachers,
		types,
		presenceMandatory
	}: Props = $props();
</script>

<article class="panel subject-card">
	<header>
		<div>
			<h2>{name}</h2>
			<p>{code}</p>
		</div>
		<span class:elective={presenceMandatory}>{presenceMandatory ? 'Obowiązkowy' : 'Obieralny'}</span>
	</header>

	<p class="subject-description">{description}</p>
	<ul aria-label="Informacje o przedmiocie" class="meta-list">
		<li><span aria-hidden="true" class="section-icon award"></span>ECTS: {ects}</li>
		<li>
			<span aria-hidden="true" class="mini-icon user"></span>Koordynator:
			<strong>{coordinator}</strong>
		</li>
		<li>
			<span aria-hidden="true" class="mini-icon mail"></span><span class="font-mono underline">
			<a href="mailto:{coordinatorEmail}">{coordinatorEmail}</a></span>
		</li>
	</ul>

	<div class="tag-block">
		<p>Prowadzący:</p>
		<div>
			{#each teachers as teacher (teacher)}
				<span class="pill neutral">{teacher}</span>
			{/each}
		</div>
	</div>

	<div class="tag-block">
		<p>Typy zajęć:</p>
		<div>
			{#each types as type}
				{#if typeof type === 'string'}
					<span class={`pill ${utils.getToneForClassType(type)}`}>{type}</span>
				{:else}
					<span class={`pill ${utils.getToneForClassType(type.label, type.tone)}`}>{type.label}</span>
				{/if}
			{/each}
		</div>
	</div>
</article>