<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import EventCard from '$lib/components/app/events/EventCard.svelte';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();

	const events = $derived(data.events);

	let addEventOpen = $state(false);
	let isSubmitting = $state(false);
	let subjectOptions = $state<string[]>([]);

	const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
	const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

	const createEventForm = () => ({
		title: '',
		date: new Date().toISOString().slice(0, 10),
		timeHour: '12',
		timeMinute: '00',
		subject: subjectOptions[0] ?? data.subjectOptions[0] ?? '',
		description: '',
		type: 'Egzamin'
	});

	let eventForm = $state(createEventForm());
	let newSubjectOption = $state('');

	$effect(() => {
		subjectOptions = [...data.subjectOptions];
	});

	$effect(() => {
		if (!form?.message) {
			return;
		}

		eventForm = {
			title: form.title ?? '',
			subject: form.subject ?? subjectOptions[0] ?? '',
			type: form.type ?? 'Egzamin',
			date: form.date ?? new Date().toISOString().slice(0, 10),
			timeHour: form.timeHour ?? '12',
			timeMinute: form.timeMinute ?? '00',
			description: form.description ?? ''
		};
	});

	const resetEventForm = () => {
		eventForm = createEventForm();
		newSubjectOption = '';
	};

	const openAddEvent = () => {
		resetEventForm();
		addEventOpen = true;
	};

	const closeAddEvent = () => {
		addEventOpen = false;
	};

	const addSubjectOption = () => {
		const value = newSubjectOption.trim();

		if (!value || subjectOptions.some((option) => option.toLowerCase() === value.toLowerCase())) {
			return;
		}

		subjectOptions = [...subjectOptions, value].sort((left, right) =>
			left.localeCompare(right, 'pl')
		);
		eventForm.subject = value;
		newSubjectOption = '';
	};
</script>

<svelte:head>
	<title>Wydarzenia - PASTA</title>
</svelte:head>

<div class="page-head-row">
	<section class="page-heading" aria-labelledby="events-page-title">
		<h1 id="events-page-title">Wydarzenia</h1>
		<p>Zarządzaj nadchodzącymi wydarzeniami</p>
	</section>
	<button class="action-button" onclick={openAddEvent} type="button">
		<span aria-hidden="true">+</span>Dodaj wydarzenie
	</button>
</div>

{#if addEventOpen}
	<section class="panel add-panel" aria-labelledby="add-event-title">
		<header>
			<div>
				<h2 id="add-event-title">Dodaj wydarzenie</h2>
				<p>Dodaj nowe wydarzenie w tym samym układzie kart.</p>
			</div>
		</header>
		<form
			action="?/addEvent"
			aria-busy={isSubmitting}
			class="add-form"
			method="POST"
			use:enhance={() => {
				isSubmitting = true;

				return async ({ result, update }) => {
					try {
						await update();

						if (result.type === 'redirect') {
							closeAddEvent();
						}
					} finally {
						isSubmitting = false;
					}
				};
			}}
		>
			<div class="form-grid">
				<label class="field-group full">
					<span>Tytuł</span>
					<input
						bind:value={eventForm.title}
						name="title"
						placeholder="np. Egzamin z fizyki"
						required
					/>
				</label>
				<label class="field-group full">
					<span>Przedmiot</span>
					<select bind:value={eventForm.subject} name="subject" required>
						{#each subjectOptions as subjectOption (subjectOption)}
							<option value={subjectOption}>{subjectOption}</option>
						{/each}
					</select>
					<div class="inline-add-row">
						<input bind:value={newSubjectOption} placeholder="Dodaj nowy przedmiot" />
						<button class="ghost-button" type="button" onclick={addSubjectOption}>Dodaj</button>
					</div>
				</label>
				<label class="field-group">
					<span>Typ</span>
					<select bind:value={eventForm.type} name="type" required>
						<option>Egzamin</option>
						<option>Kolokwium</option>
						<option>Projekt</option>
						<option>Prezentacja</option>
						<option>Inne</option>
					</select>
				</label>
				<label class="field-group">
					<span>Data</span>
					<input bind:value={eventForm.date} type="date" name="date" required />
				</label>
				<label class="field-group full">
					<span>Godzina</span>
					<div class="time-picker-row">
						<select bind:value={eventForm.timeHour} name="timeHour" required>
							{#each hours as hour (hour)}
								<option value={hour}>{hour}</option>
							{/each}
						</select>
						<span aria-hidden="true">:</span>
						<select bind:value={eventForm.timeMinute} name="timeMinute" required>
							{#each minutes as minute (minute)}
								<option value={minute}>{minute}</option>
							{/each}
						</select>
					</div>
				</label>
				<label class="field-group full">
					<span>Opis</span>
					<textarea
						bind:value={eventForm.description}
						name="description"
						placeholder="Krótki opis wydarzenia"
						required
					></textarea>
				</label>
			</div>

			{#if form?.message}
				<p class="auth-error" role="alert">{form.message}</p>
			{/if}

			<div class="form-actions">
				<button class="ghost-button" type="button" onclick={closeAddEvent} disabled={isSubmitting}>
					Anuluj
				</button>
				<button class="action-button" type="submit" disabled={isSubmitting}>
					<span aria-hidden="true">+</span>{isSubmitting ? 'Zapisywanie...' : 'Dodaj wydarzenie'}
				</button>
			</div>
		</form>
	</section>
{/if}

<section class="event-card-grid" aria-label="Lista wydarzeń">
	{#each events as event (event.id)}
		<EventCard {...event} />
	{/each}
</section>