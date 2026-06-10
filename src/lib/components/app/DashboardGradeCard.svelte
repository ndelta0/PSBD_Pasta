<script lang="ts">
	interface Props {
		subject: string;
		date: string;
		weight: string;
		value: string;
		tone: string;
	}

	const { subject, date, weight, value, tone }: Props = $props();
</script>

<article class="grade-row">
	<div>
		<h3>{subject}</h3>
		<p>
			<span aria-hidden="true" class="mini-icon clock"></span>{date}
		</p>
		<p>
			<span aria-hidden="true" class="mini-icon scale"></span>Waga: {weight}
		</p>
	</div>
	<strong class={tone}>{value}</strong>
</article>
