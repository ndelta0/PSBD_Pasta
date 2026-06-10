<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData | undefined } = $props();
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Rejestracja - PASTA</title>
	<meta name="description" content="Utwórz konto w aplikacji PASTA." />
</svelte:head>

<section class="auth-card panel" aria-labelledby="register-title">
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
		<h1 id="register-title">Rejestracja</h1>
		<p>Załóż konto, aby korzystać z panelu studenta.</p>
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
			<span>Imię</span>
			<input
				aria-describedby={form?.message ? 'register-error' : undefined}
				aria-invalid={form?.message ? 'true' : undefined}
				autocomplete="name"
				name="name"
				required
				value={form?.name ?? ''}
			/>
		</label>

		<label class="auth-field">
			<span>Nazwisko</span>
			<input
				aria-describedby={form?.message ? 'register-error' : undefined}
				aria-invalid={form?.message ? 'true' : undefined}
				autocomplete="family-name"
				name="surname"
				required
				value={form?.surname ?? ''}
			/>
		</label>

		<label class="auth-field">
			<span>E-mail</span>
			<input
				aria-describedby={form?.message ? 'register-error' : undefined}
				aria-invalid={form?.message ? 'true' : undefined}
				autocomplete="email"
				name="email"
				required
				type="email"
				value={form?.email ?? ''}
			/>
		</label>

		<label class="auth-field">
			<span>Grupa</span>
			<input
				aria-describedby={form?.message ? 'register-error' : undefined}
				aria-invalid={form?.message ? 'true' : undefined}
				name="group"
				placeholder="np. ARiIP - 111"
				required
				value={form?.group ?? ''}
			/>
		</label>

		<label class="auth-field">
			<span>Hasło</span>
			<input
				aria-describedby={form?.message ? 'register-error' : undefined}
				aria-invalid={form?.message ? 'true' : undefined}
				autocomplete="new-password"
				minlength="6"
				name="password"
				required
				type="password"
			/>
		</label>

		<label class="auth-field">
			<span>Powtórz hasło</span>
			<input
				aria-describedby={form?.message ? 'register-error' : undefined}
				aria-invalid={form?.message ? 'true' : undefined}
				autocomplete="new-password"
				minlength="6"
				name="confirmPassword"
				required
				type="password"
			/>
		</label>

		{#if form?.message}
			<p id="register-error" class="auth-error" role="alert">{form.message}</p>
		{/if}

		<button class="action-button auth-submit" type="submit" disabled={isSubmitting}>
			{isSubmitting ? 'Tworzenie konta...' : 'Utwórz konto'}
		</button>

		<div class="auth-links">
			<a href={resolve('/login')}>Masz już konto? Zaloguj się</a>
		</div>
	</form>
</section>
