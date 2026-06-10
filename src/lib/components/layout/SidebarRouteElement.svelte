<script lang="ts">
	import { page } from '$app/state';
	import type { NavItem } from '$lib/types/sidebar';

	let { label, icon, href }: NavItem = $props();

	let isActive = $derived(page.url.pathname === href);
</script>

<a aria-current={isActive ? 'page' : undefined} class:active={isActive} {href}>
	<span aria-hidden="true" class="nav-icon" data-icon={icon}></span>
	<span>{label}</span>
</a>
