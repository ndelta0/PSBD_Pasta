<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { loginAccount, type LoginPayload } from '$lib/auth';

	let form = $state<LoginPayload>({
		email: 'jan.kowalski@example.com',
		password: 'test1234'
	});

	let error = $state('');
	let isSubmitting = $state(false);

	const submit = () => {
		error = '';
		isSubmitting = true;

		try {
			loginAccount(form);
			goto(resolve('/'));
		} catch (problem) {
			error = problem instanceof Error ? problem.message : 'Nie udało się zalogować.';
		} finally {
			isSubmitting = false;
		}
	};
</script>

<svelte:head>
	<title>Logowanie - PASTA</title>
	<meta name="description" content="Zaloguj się do aplikacji PASTA." />
</svelte:head>

<section class="auth-card panel" aria-labelledby="login-title">
	<div class="auth-brand" aria-hidden="true">
		<div class="auth-brand-mark">
			<svg viewBox="0 0 24 24">
				<path d="m3 7.5 9-4 9 4-9 4-9-4Z" />
				<path d="M7 10v4.3c0 1.3 2.2 2.7 5 2.7s5-1.4 5-2.7V10" />
			</svg>
		</div>
		<span>PASTA</span>
	</div>

	<header>
		<h1 id="login-title">Logowanie</h1>
		<p>Zaloguj się, aby przejść do swojego panelu.</p>
	</header>

	<form class="auth-form" onsubmit={(event) => {
		event.preventDefault();
		submit();
	}}>
		<label class="auth-field">
			<span>E-mail</span>
			<input bind:value={form.email} type="email" autocomplete="email" required />
		</label>

		<label class="auth-field">
			<span>Hasło</span>
			<input bind:value={form.password} type="password" autocomplete="current-password" required />
		</label>

		{#if error}
			<p class="auth-error" role="alert">{error}</p>
		{/if}

		<button class="action-button auth-submit" type="submit" disabled={isSubmitting}>
			{isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
		</button>

		<div class="auth-links">
			<a href={resolve('/register')}>Nie masz konta? Zarejestruj się</a>
			<span>Demo: jan.kowalski@example.com / test1234</span>
		</div>
	</form>
</section>



