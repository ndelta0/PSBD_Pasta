<script lang="ts">
	import type { PageData } from './$types';
	import SubjectCard from '$lib/components/app/grades/SubjectCard.svelte';
	import type { Grade } from './+page.server.ts';
	import { utils } from '$lib';

	interface Props {
		data: PageData;
	}

	let { data } = $props();

	const subjects = $derived(data.subjects);

	// type GradeItem = {
	// 	id: number;
	// 	value: number;
	// 	name: string;
	// 	date: string;
	// 	weight: number;
	// };
	//
	// type Subject = {
	// 	name: string;
	// 	grades: GradeItem[];
	// };
	//
	// const getInitialSubjects = () => data.subjects as Subject[];
	// const initialSubjects = getInitialSubjects();
	// let subjects = $state<Subject[]>(initialSubjects);
	// let addGradeOpen = $state(false);
	// let nextGradeId =
	// 	Math.max(0, ...initialSubjects.flatMap((subject) => subject.grades.map((grade) => grade.id))) +
	// 	1;
	// let subjectOptions = $state(initialSubjects.map((subject) => subject.name));
	// let gradeNameOptions = $state(
	// 	Array.from(
	// 		new Set(initialSubjects.flatMap((subject) => subject.grades.map((grade) => grade.name)))
	// 	)
	// );
	//
	// const createGradeForm = () => ({
	// 	subject: initialSubjects[0]?.name ?? '',
	// 	name: gradeNameOptions[0] ?? '',
	// 	value: '5.0',
	// 	date: new Date().toISOString().slice(0, 10),
	// 	weight: '1'
	// });
	//
	// let gradeForm = $state(createGradeForm());
	// let newSubjectOption = $state('');
	// let newGradeNameOption = $state('');
	//
	// const averageFor = (grades: GradeItem[]) => {
	// 	const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);
	// 	if (!totalWeight) {
	// 		return '0.00';
	// 	}
	//
	// 	const weightedAverage =
	// 		grades.reduce((sum, grade) => sum + grade.value * grade.weight, 0) / totalWeight;
	// 	return weightedAverage.toFixed(2);
	// };
	//
	// const addGrade = () => {
	// 	const subjectName = gradeForm.subject.trim();
	// 	const gradeName = gradeForm.name.trim();
	// 	const gradeValue = Number.parseFloat(gradeForm.value);
	// 	const gradeWeight = Number.parseInt(gradeForm.weight, 10);
	//
	// 	if (
	// 		!subjectName ||
	// 		!gradeName ||
	// 		!gradeForm.date ||
	// 		Number.isNaN(gradeValue) ||
	// 		Number.isNaN(gradeWeight)
	// 	) {
	// 		return;
	// 	}
	//
	// 	const newGrade: GradeItem = {
	// 		id: nextGradeId++,
	// 		value: gradeValue,
	// 		name: gradeName,
	// 		date: gradeForm.date,
	// 		weight: gradeWeight
	// 	};
	//
	// 	const existingSubject = subjects.find(
	// 		(subject) => subject.name.toLowerCase() === subjectName.toLowerCase()
	// 	);
	//
	// 	if (existingSubject) {
	// 		subjects = subjects.map((subject) =>
	// 			subject.name.toLowerCase() === subjectName.toLowerCase()
	// 				? { ...subject, grades: [newGrade, ...subject.grades] }
	// 				: subject
	// 		);
	// 	} else {
	// 		subjects = [{ name: subjectName, grades: [newGrade] }, ...subjects];
	// 	}
	//
	// 	gradeForm = createGradeForm();
	// 	addGradeOpen = false;
	// };
	//
	// const addSubjectOption = () => {
	// 	const value = newSubjectOption.trim();
	//
	// 	if (!value || subjectOptions.some((option) => option.toLowerCase() === value.toLowerCase())) {
	// 		return;
	// 	}
	//
	// 	subjectOptions = [...subjectOptions, value].sort((left, right) =>
	// 		left.localeCompare(right, 'pl')
	// 	);
	// 	gradeForm.subject = value;
	// 	newSubjectOption = '';
	// };
	//
	// const addGradeNameOption = () => {
	// 	const value = newGradeNameOption.trim();
	//
	// 	if (!value || gradeNameOptions.some((option) => option.toLowerCase() === value.toLowerCase())) {
	// 		return;
	// 	}
	//
	// 	gradeNameOptions = [...gradeNameOptions, value].sort((left, right) =>
	// 		left.localeCompare(right, 'pl')
	// 	);
	// 	gradeForm.name = value;
	// 	newGradeNameOption = '';
	// };

	const weightedAverageForSubject = (grades: Grade[]) => {
		if (grades.length === 0) {
			return 0;
		}

		return utils.weightedAverage(grades.map((grade) => grade.value), grades.map((grade) => grade.weight));
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
	<!--	<button class="action-button" onclick={() => (addGradeOpen = !addGradeOpen)}>-->
	<!--		<span aria-hidden="true">+</span>Dodaj ocenę-->
	<!--	</button>-->
</div>

<!--{#if addGradeOpen}-->
<!--	<section class="panel add-panel" aria-labelledby="add-grade-title">-->
<!--		<header>-->
<!--			<div>-->
<!--				<h2 id="add-grade-title">Dodaj ocenę</h2>-->
<!--				<p>Dodaj nowy wpis w stylu pozostałych kart ocen.</p>-->
<!--			</div>-->
<!--		</header>-->
<!--		<form-->
<!--			class="add-form"-->
<!--			onsubmit={(event) => {-->
<!--				event.preventDefault();-->
<!--				addGrade();-->
<!--			}}-->
<!--		>-->
<!--			<div class="form-grid">-->
<!--				<label class="field-group full">-->
<!--					<span>Przedmiot</span>-->
<!--					<select bind:value={gradeForm.subject} required>-->
<!--						{#each subjectOptions as subjectOption (subjectOption)}-->
<!--							<option value={subjectOption}>{subjectOption}</option>-->
<!--						{/each}-->
<!--					</select>-->
<!--					<div class="inline-add-row">-->
<!--						<input bind:value={newSubjectOption} placeholder="Dodaj nowy przedmiot" />-->
<!--						<button class="ghost-button" type="button" onclick={addSubjectOption}>Dodaj</button>-->
<!--					</div>-->
<!--				</label>-->
<!--				<label class="field-group full">-->
<!--					<span>Nazwa oceny</span>-->
<!--					<select bind:value={gradeForm.name} required>-->
<!--						{#each gradeNameOptions as gradeNameOption (gradeNameOption)}-->
<!--							<option value={gradeNameOption}>{gradeNameOption}</option>-->
<!--						{/each}-->
<!--					</select>-->
<!--					<div class="inline-add-row">-->
<!--						<input bind:value={newGradeNameOption} placeholder="Dodaj nową nazwę oceny" />-->
<!--						<button class="ghost-button" type="button" onclick={addGradeNameOption}>Dodaj</button>-->
<!--					</div>-->
<!--				</label>-->
<!--				<label class="field-group">-->
<!--					<span>Wartość</span>-->
<!--					<input-->
<!--						bind:value={gradeForm.value}-->
<!--						inputmode="decimal"-->
<!--						step="0.1"-->
<!--						type="number"-->
<!--						min="1"-->
<!--						max="5"-->
<!--						required-->
<!--					/>-->
<!--				</label>-->
<!--				<label class="field-group">-->
<!--					<span>Data</span>-->
<!--					<input bind:value={gradeForm.date} type="date" required />-->
<!--				</label>-->
<!--				<label class="field-group">-->
<!--					<span>Waga</span>-->
<!--					<input bind:value={gradeForm.weight} type="number" min="1" max="10" required />-->
<!--				</label>-->
<!--			</div>-->
<!--			<div class="form-actions">-->
<!--				<button class="ghost-button" type="button" onclick={() => (addGradeOpen = false)}-->
<!--					>Anuluj</button-->
<!--				>-->
<!--				<button class="action-button" type="submit"-->
<!--					><span aria-hidden="true">+</span>Dodaj ocenę</button-->
<!--				>-->
<!--			</div>-->
<!--		</form>-->
<!--	</section>-->
<!--{/if}-->

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