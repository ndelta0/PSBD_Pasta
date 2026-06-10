<script lang="ts">
	interface Props {
		value: number;
		name: string;
		date: string;
		weight: number;
	}

	const {
		value,
		name,
		date,
		weight
	}: Props = $props();

	const tone = $derived(value < 3 ? 'bad' : value < 4 ? 'acceptable' : 'good');
</script>

<div class="grade-detail-row">
	<strong class={tone}>{value}</strong>
	<div>
		<h3>{name}</h3>
		<p>{date}</p>
	</div>
	<span>Waga: {weight}</span>
</div>