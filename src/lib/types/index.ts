export type { NavItem } from './sidebar';
export type { User } from './user';

export const DayOfWeekValues = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday'
] as const;

export type DayOfWeek = (typeof DayOfWeekValues)[number];
