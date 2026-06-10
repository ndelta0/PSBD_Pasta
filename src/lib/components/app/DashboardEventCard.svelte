<script lang="ts">
	interface Props {
		title: string;
		date: string;
		time: string;
		type: string;
	}

	const { title, date, time, type }: Props = $props();
</script>

<article class="event-row">
	<div aria-hidden="true" class="event-icon">
		<span class="nav-icon" data-icon="calendar"></span>
	</div>
	<div>
		<h3>{title}</h3>
		<p>
			{date}
			<span aria-hidden="true" class="mini-icon clock"></span>{time}
		</p>
	</div>
	<strong>{type}</strong>
</article>