<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import SubjectCard from '$lib/components/app/grades/SubjectCard.svelte';
	import type { Grade } from './+page.server.ts';
	import { utils } from '$lib';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();

	const subjects = $derived(data.subjects);

	let addGradeOpen = $state(false);
	let isSubmitting = $state(false);
	let subjectOptions = $state<string[]>([]);
	let gradeNameOptions = $state<string[]>([]);

	const createGradeForm = () => ({
		subject: subjectOptions[0] ?? data.subjectOptions[0] ?? '',
		name: gradeNameOptions[0] ?? data.gradeNameOptions[0] ?? '',
		value: '5.0',
		date: new Date().toISOString().slice(0, 10),
		weight: '1'
	});

	let gradeForm = $state(createGradeForm());
	let newSubjectOption = $state('');
	let newGradeNameOption = $state('');

	$effect(() => {
		subjectOptions = [...data.subjectOptions];
		gradeNameOptions = [...data.gradeNameOptions];
	});

	$effect(() => {
		if (!form?.subject) {
			return;
		}

		gradeForm = {
			subject: form.subject,
			name: form.name ?? '',
			value: form.value ?? '5.0',
			date: form.date ?? new Date().toISOString().slice(0, 10),
			weight: form.weight ?? '1'
		};
	});

	const resetGradeForm = () => {
		gradeForm = createGradeForm();
		newSubjectOption = '';
		newGradeNameOption = '';
	};

	const openAddGrade = () => {
		resetGradeForm();
		addGradeOpen = true;
	};

	const closeAddGrade = () => {
		addGradeOpen = false;
	};

	const addSubjectOption = () => {
		const value = newSubjectOption.trim();

		if (!value || subjectOptions.some((option) => option.toLowerCase() === value.toLowerCase())) {
			return;
		}

		subjectOptions = [...subjectOptions, value].sort((left, right) =>
			left.localeCompare(right, 'pl')
		);
		gradeForm.subject = value;
		newSubjectOption = '';
	};

	const addGradeNameOption = () => {
		const value = newGradeNameOption.trim();

		if (!value || gradeNameOptions.some((option) => option.toLowerCase() === value.toLowerCase())) {
			return;
		}

		gradeNameOptions = [...gradeNameOptions, value].sort((left, right) =>
			left.localeCompare(right, 'pl')
		);
		gradeForm.name = value;
		newGradeNameOption = '';
	};

	const weightedAverageForSubject = (grades: Grade[]) => {
		if (grades.length === 0) {
			return 0;
		}

		return utils.weightedAverage(
			grades.map((grade) => grade.value),
			grades.map((grade) => grade.weight)
		);
	};

	const averageSubjects = (subs: typeof subjects) => {
		return Object.entries(subs).map(([subject, grades]) => {
			return {
				name: subject,
				average: weightedAverageForSubject(grades)
			};
		});
	};

	const overallAverage = $derived(utils.average(averageSubjects(subjects).map((s) => s.average)));
</script>

<svelte:head>
	<title>Oceny - PASTA</title>
</svelte:head>

<div class="page-head-row">
	<section class="page-heading" aria-labelledby="grades-page-title">
		<h1 id="grades-page-title">Oceny</h1>
		<p>Zarządzaj swoimi ocenami i śledź postępy</p>
	</section>
	<button class="action-button" onclick={openAddGrade} type="button">
		<span aria-hidden="true">+</span>Dodaj ocenę
	</button>
</div>

{#if addGradeOpen}
	<section class="panel add-panel" aria-labelledby="add-grade-title">
		<header>
			<div>
				<h2 id="add-grade-title">Dodaj ocenę</h2>
				<p>Dodaj nowy wpis w stylu pozostałych kart ocen.</p>
			</div>
		</header>
		<form
			action="?/addGrade"
			aria-busy={isSubmitting}
			class="add-form"
			method="POST"
			use:enhance={() => {
				isSubmitting = true;

				return async ({ result, update }) => {
					try {
						await update();

						if (result.type === 'redirect') {
							closeAddGrade();
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
					<select bind:value={gradeForm.subject} name="subject" required>
						{#each subjectOptions as subjectOption (subjectOption)}
							<option value={subjectOption}>{subjectOption}</option>
						{/each}
					</select>
					<div class="inline-add-row">
						<input bind:value={newSubjectOption} placeholder="Dodaj nowy przedmiot" />
						<button class="ghost-button" type="button" onclick={addSubjectOption}>Dodaj</button>
					</div>
				</label>
				<label class="field-group full">
					<span>Nazwa oceny</span>
					<select bind:value={gradeForm.name} name="name" required>
						{#each gradeNameOptions as gradeNameOption (gradeNameOption)}
							<option value={gradeNameOption}>{gradeNameOption}</option>
						{/each}
					</select>
					<div class="inline-add-row">
						<input bind:value={newGradeNameOption} placeholder="Dodaj nową nazwę oceny" />
						<button class="ghost-button" type="button" onclick={addGradeNameOption}>Dodaj</button>
					</div>
				</label>
				<label class="field-group">
					<span>Wartość</span>
					<input
						bind:value={gradeForm.value}
						inputmode="decimal"
						step="0.5"
						type="number"
						min="2"
						max="5"
						name="value"
						required
					/>
				</label>
				<label class="field-group">
					<span>Data</span>
					<input bind:value={gradeForm.date} type="date" name="date" required />
				</label>
				<label class="field-group">
					<span>Waga</span>
					<input bind:value={gradeForm.weight} type="number" min="1" max="10" name="weight" required />
				</label>
			</div>

			{#if form?.message}
				<p class="auth-error" role="alert">{form.message}</p>
			{/if}

			<div class="form-actions">
				<button class="ghost-button" type="button" onclick={closeAddGrade} disabled={isSubmitting}>
					Anuluj
				</button>
				<button class="action-button" type="submit" disabled={isSubmitting}>
					<span aria-hidden="true">+</span>{isSubmitting ? 'Zapisywanie...' : 'Dodaj ocenę'}
				</button>
			</div>
		</form>
	</section>
{/if}

<section class="stats-grid single" aria-label="Średnia ocen">
	<article class="stat-card">
		<div>
			<h2>Średnia ocen</h2>
			<p>{overallAverage.toFixed(2)}</p>
		</div>
		<span class="stat-icon" data-icon="trend" style:--accent="#54c69a" aria-hidden="true"></span>
	</article>
</section>

<section class="grade-subject-grid" aria-label="Oceny według przedmiotów">
	{#each Object.entries(subjects) as [subName, subGrades] (subName)}
		<SubjectCard name={subName} grades={subGrades} />
	{/each}
</section>