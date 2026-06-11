<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import SummaryCard from '$lib/components/app/attendance/SummaryCard.svelte';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();

	const stats = $derived(data.stats);
	const recent = $derived(data.recent);
	const subjects = $derived(data.subjects);
	const totalAttendance = $derived(stats.numPresent + stats.numAbsent);
	const attendancePct = $derived(
		totalAttendance > 0 ? (stats.numPresent / totalAttendance) * 100 : 0
	);

	let addAttendanceOpen = $state(false);
	let isSubmitting = $state(false);
	let subjectOptions = $state<string[]>([]);

	const createAttendanceForm = () => ({
		subject: subjectOptions[0] ?? data.subjectOptions[0] ?? '',
		date: new Date().toISOString().slice(0, 10),
		wasPresent: '1',
		scheduleEntryId: ''
	});

	let attendanceForm = $state(createAttendanceForm());
	let newSubjectOption = $state('');

	$effect(() => {
		subjectOptions = [...data.subjectOptions];
	});

	$effect(() => {
		if (!form?.message) {
			return;
		}

		attendanceForm = {
			subject: form.subject ?? subjectOptions[0] ?? '',
			date: form.date ?? new Date().toISOString().slice(0, 10),
			wasPresent: form.wasPresent ?? '1',
			scheduleEntryId: form.scheduleEntryId ?? ''
		};
		addAttendanceOpen = true;
	});

	const scheduleOptionsForSubject = $derived(
		data.scheduleOptions.filter((option) => option.subject === attendanceForm.subject)
	);

	const resetAttendanceForm = () => {
		attendanceForm = createAttendanceForm();
		newSubjectOption = '';
	};

	const openAddAttendance = () => {
		resetAttendanceForm();
		addAttendanceOpen = true;
	};

	const closeAddAttendance = () => {
		addAttendanceOpen = false;
	};

	const addSubjectOption = () => {
		const value = newSubjectOption.trim();

		if (!value || subjectOptions.some((option) => option.toLowerCase() === value.toLowerCase())) {
			return;
		}

		subjectOptions = [...subjectOptions, value].sort((left, right) =>
			left.localeCompare(right, 'pl')
		);
		attendanceForm.subject = value;
		attendanceForm.scheduleEntryId = '';
		newSubjectOption = '';
	};

	const toneForPresence = (present: boolean) => (present ? 'green' : 'red');
	const statusForPresence = (present: boolean) => (present ? 'Obecny' : 'Nieobecny');

	const colorForSubject = (numAbsent: number): string => {
		if (numAbsent == 0) return '#5fc4a0';
		if (numAbsent == 1) return '#ffbd50';
		return '#ff6b86';
	};

	const pctPresentForSubject = (numPresent: number, numAbsent: number): number => {
		const total = numPresent + numAbsent;
		if (total == 0) return 0;
		return (numPresent / total) * 100;
	};

	const scoreForSubject = (numPresent: number, numAbsent: number): string => {
		const pct = pctPresentForSubject(numPresent, numAbsent);
		return `${numPresent}/${numPresent + numAbsent} (${pct.toFixed(1)}%)`;
	};
</script>

<svelte:head>
	<title>Frekwencja - PASTA</title>
</svelte:head>

<div class="page-head-row">
	<section aria-labelledby="attendance-title" class="page-heading">
		<h1 id="attendance-title">Frekwencja</h1>
		<p>Zarządzaj obecnościami i śledź postępy</p>
	</section>
	<button class="action-button" onclick={openAddAttendance} type="button">
		<span aria-hidden="true">+</span>Dodaj obecność
	</button>
</div>

{#if addAttendanceOpen}
	<section class="panel add-panel" aria-labelledby="add-attendance-title">
		<header>
			<div>
				<h2 id="add-attendance-title">Dodaj obecność</h2>
				<p>Dodaj nowy wpis do historii frekwencji.</p>
			</div>
		</header>
		<form
			action="?/addAttendance"
			aria-busy={isSubmitting}
			class="add-form"
			method="POST"
			use:enhance={() => {
				isSubmitting = true;

				return async ({ result, update }) => {
					try {
						await update();

						if (result.type === 'redirect') {
							closeAddAttendance();
						}
					} finally {
						isSubmitting = false;
					}
				};
			}}
		>
			<div class="form-grid">
				<label class="field-group full">
					<span>Przedmiot</span>
					<select
						bind:value={attendanceForm.subject}
						name="subject"
						required
						onchange={() => (attendanceForm.scheduleEntryId = '')}
					>
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
					<span>Data</span>
					<input bind:value={attendanceForm.date} type="date" name="date" required />
				</label>
				<label class="field-group">
					<span>Status</span>
					<select bind:value={attendanceForm.wasPresent} name="wasPresent" required>
						<option value="1">Obecny</option>
						<option value="0">Nieobecny</option>
					</select>
				</label>
				<label class="field-group full">
					<span>Pozycja planu</span>
					<select bind:value={attendanceForm.scheduleEntryId} name="scheduleEntryId">
						<option value="">Bez pozycji planu</option>
						{#each scheduleOptionsForSubject as scheduleOption (scheduleOption.id)}
							<option value={String(scheduleOption.id)}>{scheduleOption.label}</option>
						{/each}
					</select>
				</label>
			</div>

			{#if form?.message}
				<p class="auth-error" role="alert">{form.message}</p>
			{/if}

			<div class="form-actions">
				<button
					class="ghost-button"
					type="button"
					onclick={closeAddAttendance}
					disabled={isSubmitting}
				>
					Anuluj
				</button>
				<button class="action-button" type="submit" disabled={isSubmitting}>
					<span aria-hidden="true">+</span>{isSubmitting ? 'Zapisywanie...' : 'Dodaj obecność'}
				</button>
			</div>
		</form>
	</section>
{/if}

<section class="attendance-stats" aria-label="Podsumowanie frekwencji">
	<SummaryCard
		icon="trend"
		label="Ogólna obeność"
		tone="green"
		value={`${attendancePct.toFixed(1)}%`}
	/>
	<SummaryCard icon="check" label="Obecności" tone="green" value={stats.numPresent} />
	<SummaryCard icon="x-circle" label="Nieobecności" tone="red" value={stats.numAbsent} />
	<SummaryCard
		icon="clock-large"
		label="Łączna liczba zajęć"
		tone="gray"
		value={stats.numPresent + stats.numAbsent}
	/>
</section>

<div class="dashboard-grid">
	<section class="panel attendance-summary" aria-labelledby="attendance-summary-title">
		<h2 id="attendance-summary-title">Podsumowanie frekwencji</h2>
		<div class="pie-layout">
			<div
				aria-label={`Obecności ${stats.numPresent}, nieobecności ${stats.numAbsent}`}
				class="pie-chart"
				style:--present-percent={`${attendancePct.toFixed(2)}%`}
			></div>
			<div class="legend">
				<p><span class="legend-swatch green"></span>Obecności: {stats.numPresent}</p>
				<p><span class="legend-swatch red"></span>Nieobecności: {stats.numAbsent}</p>
			</div>
		</div>
	</section>

	<section class="panel recent-attendance" aria-labelledby="recent-attendance-title">
		<h2 id="recent-attendance-title">Ostatnie zajęcia</h2>
		<div class="stack">
			{#each recent as item (item.name)}
				<article class="attendance-row">
					<span class={`status-ring ${toneForPresence(item.wasPresent)}`} aria-hidden="true"></span>
					<div>
						<h3>{item.name}</h3>
						<p>{item.details}</p>
					</div>
					<strong class={toneForPresence(item.wasPresent)}
						>{statusForPresence(item.wasPresent)}</strong
					>
				</article>
			{/each}
		</div>
	</section>
</div>

<section class="panel subject-attendance" aria-labelledby="subject-attendance-title">
	<h2 id="subject-attendance-title">Frekwencja według przedmiotów</h2>
	<div class="progress-list">
		{#each subjects as subject (subject.name)}
			<div
				class="progress-item"
				style:--bar-color={colorForSubject(subject.numAbsent)}
				style:--bar-width={`${pctPresentForSubject(subject.numPresent, subject.numAbsent).toFixed(1)}%`}
			>
				<div>
					<span>{subject.name}</span>
					<strong>{scoreForSubject(subject.numPresent, subject.numAbsent)}</strong>
				</div>
				<div class="progress-track"><span></span></div>
			</div>
		{/each}
	</div>
</section>