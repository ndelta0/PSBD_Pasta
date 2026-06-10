<script lang="ts">
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children: () => any;
	}

	let { children, data }: Props = $props();
	let sidebarCollapsed = $state(false);

	const getYear = (semName: string) => {
		// 'Semestr letni 2025/2026' -> '2025/2026'
		return semName.split(' ')[2];
	};

	const getSemester = (semName: string) => {
		// 'Semestr letni 2025/2026' -> 'Semestr letni'
		return semName.split(' ')[0] + ' ' + semName.split(' ')[1];
	};
</script>

<main class="app-shell" class:sidebar-collapsed={sidebarCollapsed}>
	<Sidebar bind:sidebarCollapsed user={data.user} />

	<section class="workspace">
		<header class="topbar">
			<div class="year">
				<strong>Rok akademicki {getYear(data.semester)}</strong>
				<span>{getSemester(data.semester)}</span>
			</div>
		</header>

		<div class="content">
			{@render children()}
		</div>
	</section>
</main>
