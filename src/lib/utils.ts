import type { DayOfWeek } from '$lib/types';

export const stringToHslColor = (str: string, saturation = 70, lightness = 50): string => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Bound the hue between 0 and 360
	const hue = Math.abs(hash % 360);

	// Returns a predictable color with guaranteed contrast
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const getToneForClassType = (type: string, tone?: string): string => {
	if (tone) return tone;

	switch (type.toLowerCase()) {
		case 'wykład':
			return 'purple';
		case 'ćwiczenia':
			return 'green';
		case 'laboratorium':
			return 'amber';
		case 'projekt':
			return 'red';
		default:
			return 'neutral';
	}
};

export const getAccentForClassType = (type: string, accent?: string): string => {
	if (accent) return accent;

	switch (type.toLowerCase()) {
		case 'wykład':
			return '#9a7cff';
		case 'ćwiczenia':
			return '#54c69a';
		case 'laboratorium':
			return '#d8a12d';
		case 'projekt':
			return '#ff697a';
		default:
			return stringToHslColor(type);
	}
};

export const dayOfWeekLocalized = (day: DayOfWeek): string => {
	switch (day) {
		case 'Monday':
			return 'Poniedziałek';
		case 'Tuesday':
			return 'Wtorek';
		case 'Wednesday':
			return 'Środa';
		case 'Thursday':
			return 'Czwartek';
		case 'Friday':
			return 'Piątek';
		case 'Saturday':
			return 'Sobota';
		case 'Sunday':
			return 'Niedziela';
		default: {
			const ds = day as string;
			return ds.charAt(0).toUpperCase() + ds.slice(1);
		}
	}
};

export const average = (nums: number[]) => {
	return nums.reduce((acc, num) => acc + num, 0) / nums.length;
};

export const weightedAverage = (nums: number[], weights: number[]) => {
	if (nums.length !== weights.length) throw new Error('nums and weights must have the same length');
	if (nums.length === 0) return 0;

	const [sum, weightSum] = weights.reduce(
		(acc, w, i) => {
			acc[0] = acc[0] + nums[i] * w;
			acc[1] = acc[1] + w;
			return acc;
		},
		[0, 0]
	);
	return sum / weightSum;
};