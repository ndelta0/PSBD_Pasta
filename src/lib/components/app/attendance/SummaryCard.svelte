<script lang="ts">
	interface Props {
		label: string;
		value: any;
		icon: string;
		tone: string;
	}

	const { label, value, icon, tone }: Props = $props();
</script>

<article class="panel attendance-stat">
	<span aria-hidden="true" class={`attendance-icon ${tone}`} data-icon={icon}></span>
	<div>
		<h2>{label}</h2>
		<p>{value}</p>
	</div>
</article>
