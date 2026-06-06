<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { registerAccount, type RegisterPayload } from '$lib/auth';

	let form = $state<RegisterPayload & { confirmPassword: string }>({
		name: '',
		email: '',
		group: '',
		password: '',
		confirmPassword: ''
	});

	let error = $state('');
	let isSubmitting = $state(false);

	const submit = () => {
		error = '';

		if (form.password !== form.confirmPassword) {
			error = 'Hasła muszą być takie same.';
			return;
		}

		isSubmitting = true;

		try {
			registerAccount(form);
			goto(resolve('/profile'));
		} catch (problem) {
			error = problem instanceof Error ? problem.message : 'Nie udało się utworzyć konta.';
		} finally {
			isSubmitting = false;
		}
	};
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

	<form class="auth-form" onsubmit={(event) => {
		event.preventDefault();
		submit();
	}}>
		<label class="auth-field">
			<span>Imię i nazwisko</span>
			<input bind:value={form.name} autocomplete="name" required />
		</label>

		<label class="auth-field">
			<span>E-mail</span>
			<input bind:value={form.email} type="email" autocomplete="email" required />
		</label>

		<label class="auth-field">
			<span>Grupa</span>
			<input bind:value={form.group} placeholder="np. ARiIP - 111" required />
		</label>

		<label class="auth-field">
			<span>Hasło</span>
			<input bind:value={form.password} type="password" minlength="6" autocomplete="new-password" required />
		</label>

		<label class="auth-field">
			<span>Powtórz hasło</span>
			<input bind:value={form.confirmPassword} type="password" minlength="6" autocomplete="new-password" required />
		</label>

		{#if error}
			<p class="auth-error" role="alert">{error}</p>
		{/if}

		<button class="action-button auth-submit" type="submit" disabled={isSubmitting}>
			{isSubmitting ? 'Tworzenie konta...' : 'Utwórz konto'}
		</button>

		<div class="auth-links">
			<a href={resolve('/login')}>Masz już konto? Zaloguj się</a>
		</div>
	</form>
</section>



