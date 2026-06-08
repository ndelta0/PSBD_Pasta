<script lang="ts">
	let { children } = $props();
</script>


<main class="auth-shell">
	<div class="auth-shell-inner">
		{@render children()}
	</div>
</main>