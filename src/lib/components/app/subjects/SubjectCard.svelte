<script lang="ts">
	import { utils } from '$lib';
	import templateSubjectSummary from '$lib/templates/subject_summary.html?raw';

	interface Props {
		name: string;
		code: string;
		semesterName: string;
		description?: string;
		ects: number;
		coordinator: string;
		coordinatorEmail: string;
		teachers: string[];
		types: ({ label: string; tone?: string } | string)[];
		presenceMandatory: boolean;
		grades: {
			name: string;
			value: number;
			weight: number;
			date: string;
		}[];
	}

	const {
		name,
		code,
		semesterName,
		description,
		ects,
		coordinator,
		coordinatorEmail,
		teachers,
		types,
		presenceMandatory,
		grades
	}: Props = $props();

	const escapeHtml = (value: string | number) =>
		String(value)
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll('\'', '&#39;');

	const filenameForSubject = (subjectName: string) =>
		`podsumowanie-${subjectName
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '')}.html`;

	const subjectTypeLabels = $derived(
		types.map((type) => (typeof type === 'string' ? type : type.label))
	);

	const gradeRows = $derived(
		grades.length > 0
			? grades
				.map(
					(grade) => `
							<tr>
								<td>${escapeHtml(grade.name)}</td>
								<td>${grade.value.toFixed(1)}</td>
								<td>${grade.weight}</td>
								<td>${escapeHtml(grade.date)}</td>
							</tr>
						`
				)
				.join('')
			: '<tr><td colspan="4">Brak ocen dla tego przedmiotu.</td></tr>'
	);

	const buildSubjectSummaryHtml = () => {
		const generatedAt = new Intl.DateTimeFormat('pl-PL', {
			dateStyle: 'long',
			timeStyle: 'short'
		}).format(new Date());

		const summaryDescription = description?.trim() || 'Brak opisu dla tego przedmiotu.';
		const teachersList = [coordinator, ...teachers.filter((teacher) => teacher !== coordinator)]
			.map((teacher) => `<span class="pill neutral">${escapeHtml(teacher)}</span>`)
			.join('');
		const typesList = types
			.map((type) => {
				if (typeof type === 'string') {
					return `<span class="pill ${utils.getToneForClassType(type)}">${escapeHtml(type)}</span>`;
				}

				return `<span class="pill ${utils.getToneForClassType(type.label, type.tone)}">${escapeHtml(type.label)}</span>`;
			})
			.join('');

		return templateSubjectSummary
			.replaceAll('{{SUBJECT_NAME}}', escapeHtml(name))
			.replaceAll('{{SUBJECT_CODE}}', code ? ` (${escapeHtml(code)})` : '')
			.replaceAll('{{GENERATED_AT}}', generatedAt)
			.replaceAll('{{SEMESTER_NAME}}', escapeHtml(semesterName))
			.replaceAll('{{PRESENCE_LABEL}}', presenceMandatory ? 'Obowiązkowy' : 'Nieobowiązkowy')
			.replaceAll('{{ECTS}}', ects.toString())
			.replaceAll('{{TEACHERS_COUNT}}', teachers.length.toString())
			.replaceAll('{{TYPES_COUNT}}', subjectTypeLabels.length.toString())
			.replaceAll('{{COORDINATOR}}', escapeHtml(coordinator))
			.replaceAll('{{COORDINATOR_EMAIL}}', escapeHtml(coordinatorEmail))
			.replaceAll('{{DESCRIPTION}}', escapeHtml(summaryDescription))
			.replaceAll('{{GRADE_ROWS}}', gradeRows)
			.replaceAll(
				'{{TEACHERS_LIST}}',
				teachersList || '<span class="pill muted">Brak danych</span>'
			)
			.replaceAll('{{TYPES_LIST}}', typesList || '<span class="pill muted">Brak danych</span>');
	};

	const downloadSubjectSummary = () => {
		const blob = new Blob([buildSubjectSummaryHtml()], {
			type: 'text/html;charset=utf-8'
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.href = url;
		link.download = filenameForSubject(name);
		document.body.append(link);
		link.click();
		link.remove();
		setTimeout(() => URL.revokeObjectURL(url), 0);
	};
</script>

<article class="panel subject-card">
	<header>
		<div>
			<h2>{name}</h2>
			<p>{code}</p>
		</div>
		<div class="subject-card-actions">
			<button
				aria-label={`Pobierz podsumowanie przedmiotu ${name} jako HTML`}
				class="ghost-button subject-download-button"
				onclick={downloadSubjectSummary}
				type="button"
			>
				Pobierz HTML
			</button>
			<span class:elective={presenceMandatory}
			>{presenceMandatory ? 'Obowiązkowy' : 'Nieobowiązkowy'}</span
			>
		</div>
	</header>

	<p class="subject-description">{description}</p>
	<ul aria-label="Informacje o przedmiocie" class="meta-list">
		<li><span aria-hidden="true" class="section-icon award"></span>ECTS: {ects}</li>
		<li>
			<span aria-hidden="true" class="mini-icon user"></span>Koordynator:
			<strong>{coordinator}</strong>
		</li>
		<li>
			<span aria-hidden="true" class="mini-icon mail"></span><span class="font-mono underline">
				<a href="mailto:{coordinatorEmail}">{coordinatorEmail}</a></span
			>
		</li>
	</ul>

	<div class="tag-block">
		<p>Prowadzący:</p>
		<div>
			<span class="pill neutral">{coordinator}</span>
			{#each teachers as teacher (teacher)}
				<span class="pill neutral">{teacher}</span>
			{/each}
		</div>
	</div>

	<div class="tag-block">
		<p>Typy zajęć:</p>
		<div>
			{#each types as type}
				{#if typeof type === 'string'}
					<span class={`pill ${utils.getToneForClassType(type)}`}>{type}</span>
				{:else}
					<span class={`pill ${utils.getToneForClassType(type.label, type.tone)}`}
						>{type.label}</span
					>
				{/if}
			{/each}
		</div>
	</div>
</article>