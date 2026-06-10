<script lang="ts">
	import type { PageData } from './$types';
	import EventCard from '$lib/components/app/events/EventCard.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const events = $derived(data.events);
	// type EventTone = 'red' | 'amber' | 'green' | 'purple';
	//
	// type EventItem = {
	// 	id: number;
	// 	title: string;
	// 	date: string;
	// 	time: string;
	// 	subject: string;
	// 	description: string;
	// 	type: string;
	// 	tone: EventTone;
	// };
	//
	// const getInitialEvents = () => data.events as EventItem[];
	// const initialEvents = getInitialEvents();
	// let events = $state<EventItem[]>(initialEvents);
	// let addEventOpen = $state(false);
	// let nextEventId = Math.max(0, ...initialEvents.map((event) => event.id)) + 1;
	// let subjectOptions = $state(Array.from(new Set(initialEvents.map((event) => event.subject))));
	//
	// const createEventForm = () => ({
	// 	title: '',
	// 	date: new Date().toISOString().slice(0, 10),
	// 	timeHour: '12',
	// 	timeMinute: '00',
	// 	subject: subjectOptions[0] ?? '',
	// 	description: '',
	// 	type: 'Egzamin'
	// });
	//
	// let eventForm = $state(createEventForm());
	// let newSubjectOption = $state('');
	// const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
	// const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));
	//
	// const toneForType = (type: string): EventTone => {
	// 	const normalized = type.trim().toLowerCase();
	//
	// 	if (normalized.includes('egzamin')) return 'red';
	// 	if (normalized.includes('projekt')) return 'amber';
	// 	if (normalized.includes('kolokwium')) return 'green';
	// 	return 'purple';
	// };
	//
	// const addEvent = () => {
	// 	const title = eventForm.title.trim();
	// 	const subject = eventForm.subject.trim();
	// 	const description = eventForm.description.trim();
	// 	const time = `${eventForm.timeHour}:${eventForm.timeMinute}`;
	//
	// 	if (
	// 		!title ||
	// 		!eventForm.date ||
	// 		!eventForm.timeHour ||
	// 		!eventForm.timeMinute ||
	// 		!subject ||
	// 		!description
	// 	) {
	// 		return;
	// 	}
	//
	// 	events = [
	// 		{
	// 			id: nextEventId++,
	// 			title,
	// 			date: eventForm.date,
	// 			time,
	// 			subject,
	// 			description,
	// 			type: eventForm.type,
	// 			tone: toneForType(eventForm.type)
	// 		},
	// 		...events
	// 	];
	//
	// 	eventForm = createEventForm();
	// 	addEventOpen = false;
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
	// 	eventForm.subject = value;
	// 	newSubjectOption = '';
	// };
</script>

<svelte:head>
	<title>Wydarzenia - PASTA</title>
</svelte:head>

<div class="page-head-row">
	<section class="page-heading" aria-labelledby="events-page-title">
		<h1 id="events-page-title">Wydarzenia</h1>
		<p>Zarządzaj nadchodzącymi wydarzeniami</p>
	</section>
	<!--	<button class="action-button" onclick={() => (addEventOpen = !addEventOpen)}>-->
	<!--		<span aria-hidden="true">+</span>Dodaj wydarzenie-->
	<!--	</button>-->
</div>

<!--{#if addEventOpen}-->
<!--	<section class="panel add-panel" aria-labelledby="add-event-title">-->
<!--		<header>-->
<!--			<div>-->
<!--				<h2 id="add-event-title">Dodaj wydarzenie</h2>-->
<!--				<p>Dodaj nowe wydarzenie w tym samym układzie kart.</p>-->
<!--			</div>-->
<!--		</header>-->
<!--		<form-->
<!--			class="add-form"-->
<!--			onsubmit={(event) => {-->
<!--				event.preventDefault();-->
<!--				addEvent();-->
<!--			}}-->
<!--		>-->
<!--			<div class="form-grid">-->
<!--				<label class="field-group full">-->
<!--					<span>Tytuł</span>-->
<!--					<input bind:value={eventForm.title} placeholder="np. Egzamin z fizyki" required />-->
<!--				</label>-->
<!--				<label class="field-group full">-->
<!--					<span>Przedmiot</span>-->
<!--					<select bind:value={eventForm.subject} required>-->
<!--						{#each subjectOptions as subjectOption (subjectOption)}-->
<!--							<option value={subjectOption}>{subjectOption}</option>-->
<!--						{/each}-->
<!--					</select>-->
<!--					<div class="inline-add-row">-->
<!--						<input bind:value={newSubjectOption} placeholder="Dodaj nowy przedmiot" />-->
<!--						<button class="ghost-button" type="button" onclick={addSubjectOption}>Dodaj</button>-->
<!--					</div>-->
<!--				</label>-->
<!--				<label class="field-group">-->
<!--					<span>Typ</span>-->
<!--					<select bind:value={eventForm.type} required>-->
<!--						<option>Egzamin</option>-->
<!--						<option>Kolokwium</option>-->
<!--						<option>Projekt</option>-->
<!--						<option>Prezentacja</option>-->
<!--						<option>Inne</option>-->
<!--					</select>-->
<!--				</label>-->
<!--				<label class="field-group">-->
<!--					<span>Data</span>-->
<!--					<input bind:value={eventForm.date} type="date" required />-->
<!--				</label>-->
<!--				<label class="field-group full">-->
<!--					<span>Godzina</span>-->
<!--					<div class="time-picker-row">-->
<!--						<select bind:value={eventForm.timeHour} required>-->
<!--							{#each hours as hour (hour)}-->
<!--								<option value={hour}>{hour}</option>-->
<!--							{/each}-->
<!--						</select>-->
<!--						<span aria-hidden="true">:</span>-->
<!--						<select bind:value={eventForm.timeMinute} required>-->
<!--							{#each minutes as minute (minute)}-->
<!--								<option value={minute}>{minute}</option>-->
<!--							{/each}-->
<!--						</select>-->
<!--					</div>-->
<!--				</label>-->
<!--				<label class="field-group full">-->
<!--					<span>Opis</span>-->
<!--					<textarea bind:value={eventForm.description} placeholder="Krótki opis wydarzenia" required-->
<!--					></textarea>-->
<!--				</label>-->
<!--			</div>-->
<!--			<div class="form-actions">-->
<!--				<button class="ghost-button" type="button" onclick={() => (addEventOpen = false)}-->
<!--					>Anuluj</button-->
<!--				>-->
<!--				<button class="action-button" type="submit"-->
<!--					><span aria-hidden="true">+</span>Dodaj wydarzenie</button-->
<!--				>-->
<!--			</div>-->
<!--		</form>-->
<!--	</section>-->
<!--{/if}-->

<section class="event-card-grid" aria-label="Lista wydarzeń">
	{#each events as event (event.id)}
		<EventCard {...event} />
	{/each}
</section>
