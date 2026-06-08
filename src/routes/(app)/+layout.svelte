<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	let { children, data } = $props();
	let sidebarCollapsed = $state(false);
</script>


<main class="app-shell" class:sidebar-collapsed={sidebarCollapsed}>
	<Sidebar bind:sidebarCollapsed user={data.user} />

	<section class="workspace">
		<header class="topbar">
			<div class="year">
				<strong>Rok akademicki 2025/2026</strong>
				<span>Semestr letni</span>
			</div>
		</header>

		<div class="content">
			{@render children()}
		</div>
	</section>
</main>