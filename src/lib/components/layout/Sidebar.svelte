<script lang="ts">
	import SidebarRouteElement from '$lib/components/layout/SidebarRouteElement.svelte';
	import type { NavItem, User } from '$lib/types';

	type Props = {
		sidebarCollapsed: boolean;
		user: User
	}
	let {
		sidebarCollapsed = $bindable(false),
		user
	}: Props = $props();

	const navItems: NavItem[] = [
		{ label: 'Dashboard', icon: 'grid', href: '/' },
		{ label: 'Plan Zajęć', icon: 'calendar', href: '/schedule' },
		{ label: 'Przedmioty', icon: 'book', href: '/subjects' },
		{ label: 'Oceny', icon: 'award', href: '/grades' },
		{ label: 'Wydarzenia', icon: 'briefcase', href: '/events' },
		{ label: 'Frekwencja', icon: 'check', href: '/attendance' },
		{ label: 'Historia', icon: 'history', href: '/history' }
	];
</script>


<aside aria-label="Nawigacja główna" class="sidebar" id="main-sidebar">
	<button
		aria-controls="main-sidebar"
		aria-expanded={!sidebarCollapsed}
		aria-label={sidebarCollapsed ? 'Rozwiń panel boczny' : 'Zwiń panel boczny'}
		class="sidebar-toggle"
		onclick={() => (sidebarCollapsed = !sidebarCollapsed)}
	>
		{#if sidebarCollapsed}
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M4 7h16M4 12h16M4 17h16" />
			</svg>
		{:else}
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M6 6l12 12M18 6 6 18" />
			</svg>
		{/if}
	</button>

	<div class="sidebar-content">
		<a aria-label="PASTA Dashboard" class="brand" href="/">
			<div aria-hidden="true" class="brand-mark">
				<svg viewBox="0 0 24 24">
					<path d="m3 7.5 9-4 9 4-9 4-9-4Z" />
					<path d="M7 10v4.3c0 1.3 2.2 2.7 5 2.7s5-1.4 5-2.7V10" />
					<path d="M21 8v6" />
				</svg>
			</div>
			<div>
				<p>PASTA</p>
				<span>Planer Studenta</span>
			</div>
		</a>

		<a aria-label="Otwórz profil konta" class="profile profile-link" href="/profile">
			<div class="avatar">{user.name[0] + user.surname[0]}</div>
			<div>
				<strong>{user.name + ' ' + user.surname}</strong>
				<span>{user.groupName ?? 'Brak Grupy'}</span>
			</div>
		</a>

		<nav class="nav-list">
			{#each navItems as item}
				<SidebarRouteElement {...item} />
			{/each}
		</nav>
	</div>
</aside>