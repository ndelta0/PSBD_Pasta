<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { currentUserStore, hydrateAuth, type AuthSummary } from '$lib/auth';

	type NavItem = {
		label: string;
		icon: string;
		href: string;
	};

	let { children } = $props();
	let sidebarCollapsed = $state(false);
	let currentUser = $state<AuthSummary | null>(null);
	let authReady = $state(false);
	const authRoutes = new Set(['/login', '/register']);

	const navItems: NavItem[] = [
		{ label: 'Dashboard', icon: 'grid', href: '/' },
		{ label: 'Plan Zajęć', icon: 'calendar', href: '/plan-zajec' },
		{ label: 'Przedmioty', icon: 'book', href: '/przedmioty' },
		{ label: 'Oceny', icon: 'award', href: '/oceny' },
		{ label: 'Wydarzenia', icon: 'briefcase', href: '/wydarzenia' },
		{ label: 'Frekwencja', icon: 'check', href: '/frekwencja' },
		{ label: 'Historia', icon: 'history', href: '/historia' }
	];

	const isActive = (href: string) => page.url.pathname === href;
	const isAuthRoute = () => authRoutes.has(page.url.pathname);

	onMount(() => {
		hydrateAuth();
		const unsubscribe = currentUserStore.subscribe((value) => {
			currentUser = value;
			authReady = true;
		});

		return unsubscribe;
	});

	$effect(() => {
		if (!authReady) {
			return;
		}

		if (isAuthRoute() && currentUser) {
			goto('/');
			return;
		}

		if (!isAuthRoute() && !currentUser) {
			goto('/login');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>


{#if isAuthRoute()}
	<main class="auth-shell">
		<div class="auth-shell-inner">
			{@render children()}
		</div>
	</main>
{:else}
	<main class="app-shell" class:sidebar-collapsed={sidebarCollapsed}>
		<aside class="sidebar" aria-label="Nawigacja główna" id="main-sidebar">
			<button
				class="sidebar-toggle"
				aria-label={sidebarCollapsed ? 'Rozwiń panel boczny' : 'Zwiń panel boczny'}
				aria-expanded={!sidebarCollapsed}
				aria-controls="main-sidebar"
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
				<a class="brand" href="/" aria-label="PASTA Dashboard">
					<div class="brand-mark" aria-hidden="true">
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

				<a class="profile profile-link" href="/profile" aria-label="Otwórz profil konta">
					<div class="avatar">{currentUser?.avatar ?? 'JK'}</div>
					<div>
						<strong>{currentUser?.name ?? 'Jan Kowalski'}</strong>
						<span>{currentUser?.group ?? 'Grupa ARiIP - 111'}</span>
					</div>
				</a>

				<nav class="nav-list">
					{#each navItems as item}
						<a class:active={isActive(item.href)} href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>
							<span class="nav-icon" data-icon={item.icon} aria-hidden="true"></span>
							<span>{item.label}</span>
						</a>
					{/each}
				</nav>
			</div>
		</aside>

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
{/if}
