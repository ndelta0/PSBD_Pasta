<script lang="ts">
	interface Props {
		title: string;
		value: any;
		icon: string;
		accent: string;
	}

	const { title, value, icon, accent }: Props = $props();
</script>

<article class="stat-card">
	<div>
		<h2>{title}</h2>
		<p>{value}</p>
	</div>
	<span aria-hidden="true" class="stat-icon" data-icon={icon} style:--accent={accent}></span>
</article>