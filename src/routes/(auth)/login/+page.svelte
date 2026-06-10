<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData | undefined } = $props();
	let isSubmitting = $state(false);
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

	<form
		aria-busy={isSubmitting}
		class="auth-form"
		method="POST"
		use:enhance={() => {
			isSubmitting = true;
			form = undefined;

			return async ({ update }) => {
				try {
					await update();
				} finally {
					isSubmitting = false;
				}
			};
		}}
	>
		<label class="auth-field">
			<span>E-mail</span>
			<input
				aria-describedby={form?.message ? 'login-error' : undefined}
				aria-invalid={form?.message ? 'true' : undefined}
				autocomplete="email"
				name="email"
				required
				type="email"
				value={form?.email ?? ''}
			/>
		</label>

		<label class="auth-field">
			<span>Hasło</span>
			<input
				aria-describedby={form?.message ? 'login-error' : undefined}
				aria-invalid={form?.message ? 'true' : undefined}
				autocomplete="current-password"
				name="password"
				required
				type="password"
			/>
		</label>

		{#if form?.message}
			<p id="login-error" class="auth-error" role="alert">{form.message}</p>
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
