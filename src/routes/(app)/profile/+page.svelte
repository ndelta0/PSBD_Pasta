<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { type AuthSummary, currentUserStore, logoutAccount } from '$lib/auth';

	let currentUser = $state<AuthSummary | null>(null);
	let isReady = $state(false);

	onMount(() => {
		return currentUserStore.subscribe((value) => {
			currentUser = value;
			isReady = true;
		});
	});

	const handleLogout = () => {
		logoutAccount();
		goto(resolve('/login'));
	};
</script>

<svelte:head>
	<title>Profil - PASTA</title>
	<meta name="description" content="Informacje o koncie i wylogowanie." />
</svelte:head>

<section class="profile-page" aria-labelledby="profile-title">
	<section class="page-heading">
		<h1 id="profile-title">Profil konta</h1>
		<p>Tu możesz sprawdzić informacje o swoim koncie i się wylogować.</p>
	</section>

	<article class="panel profile-card">
		{#if isReady && currentUser}
			<div class="profile-header">
				<div class="profile-avatar">{currentUser.avatar}</div>
				<div>
					<strong>{currentUser.name}</strong>
					<span>{currentUser.group}</span>
				</div>
			</div>

			<div class="profile-details">
				<div class="profile-detail">
					<span>E-mail</span>
					<span>{currentUser.email}</span>
				</div>
				<div class="profile-detail">
					<span>Grupa</span>
					<span>{currentUser.group}</span>
				</div>
				<div class="profile-detail">
					<span>Avatar</span>
					<span>{currentUser.avatar}</span>
				</div>
				<div class="profile-detail">
					<span>Konto utworzone</span>
					<span>{new Date(currentUser.createdAt).toLocaleDateString('pl-PL')}</span>
				</div>
			</div>

			<div class="profile-actions">
				<button class="action-button" type="button" onclick={handleLogout}>Wyloguj się</button>
				<a class="ghost-button" href={resolve('/')}>Wróć do dashboardu</a>
			</div>
		{:else}
			<p class="auth-hint">Ładowanie profilu...</p>
		{/if}
	</article>
</section>