<script lang="ts">
	interface Props {
		title: string;
		date: string;
		time: string | null;
		subject: string | null;
		description: string | null;
		type: string;
		tone: 'red' | 'amber' | 'green' | 'purple';
	}

	const { title, date, time, subject, description, type, tone }: Props = $props();
</script>

<article class={`panel event-card ${tone}`}>
	<header>
		<span aria-hidden="true" class="nav-icon" data-icon="calendar"></span>
		<h2>{title}</h2>
		<strong>{type}</strong>
	</header>
	<p class="event-date">
		<span aria-hidden="true" class="mini-icon calendar-small"></span>{date}
		{#if time}
			<span aria-hidden="true" class="mini-icon clock"></span>{time}
		{/if}
	</p>
	{#if subject}
		<h3>{subject}</h3>
	{/if}
	{#if description}
		<p class="event-description">
			<span aria-hidden="true" class="mini-icon file"></span>{description}
		</p>
	{/if}
</article>
