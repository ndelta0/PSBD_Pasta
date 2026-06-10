<script lang="ts">
	import { utils } from '$lib';

	interface Props {
		name: string;
		time: string;
		room: string;
		teacher: string;
		type: string;
		accent?: string;
	}

	const { name, time, room, teacher, type, accent }: Props = $props();
</script>

<article class="lesson-row">
	<div>
		<h3>{name}</h3>
		<p>
			<span aria-hidden="true" class="mini-icon clock"></span>{time}
		</p>
		<p>
			<span aria-hidden="true" class="mini-icon pin"></span>{room}
			<span aria-hidden="true" class="mini-icon user"></span>{teacher}
		</p>
	</div>
	<strong style:color={utils.getAccentForClassType(type, accent)}>{type}</strong>
</article>