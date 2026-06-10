<script lang="ts">
	import { resolve } from '$app/paths';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const currentUser = $derived(data.user);

	const initials = $derived(
		currentUser ? `${currentUser.name[0] ?? ''}${currentUser.surname[0] ?? ''}` : ''
	);
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
		{#if currentUser}
			<div class="profile-header">
				<div class="profile-avatar">{initials}</div>
				<div>
					<strong>{currentUser.name} {currentUser.surname}</strong>
					<span>{currentUser.groupName ?? 'Brak grupy'}</span>
				</div>
			</div>

			<div class="profile-details">
				<div class="profile-detail">
					<span>E-mail</span>
					<span>{currentUser.email}</span>
				</div>
				<div class="profile-detail">
					<span>Grupa</span>
					<span>{currentUser.groupName ?? 'Brak grupy'}</span>
				</div>
				<div class="profile-detail">
					<span>Avatar</span>
					<span>{initials}</span>
				</div>
				<div class="profile-detail">
					<span>Id konta</span>
					<span>{currentUser.id}</span>
				</div>
			</div>

			<div class="profile-actions">
				<form method="POST">
					<button class="action-button" type="submit">Wyloguj się</button>
				</form>
				<a class="ghost-button" href={resolve('/')}>Wróć do dashboardu</a>
			</div>
		{:else}
			<p class="auth-hint">Ładowanie profilu...</p>
		{/if}
	</article>
</section>
