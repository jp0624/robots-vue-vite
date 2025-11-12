export const getRobotNames = (count: number): string[] => {
	const baseNames = [
		"Robbie",
		"Jane",
		"Bob",
		"Phil",
		"Sarah",
		"Henry",
		"Emily",
		"Max",
		"John",
		"Sophie",
	];
	const natoAlphabet = [
		"Alpha",
		"Bravo",
		"Charlie",
		"Delta",
		"Echo",
		"Foxtrot",
		"Golf",
		"Hotel",
		"India",
		"Juliett",
		"Kilo",
		"Lima",
		"Mike",
		"November",
		"Oscar",
		"Papa",
		"Quebec",
		"Romeo",
		"Sierra",
		"Tango",
		"Uniform",
		"Victor",
		"Whiskey",
		"X-ray",
		"Yankee",
		"Zulu",
	];

	const combined = [...baseNames, ...natoAlphabet];

	// Map to requested count and filter out undefined
	const names: string[] = Array.from(
		{ length: count },
		(_, i) => combined[i % combined.length]
	).filter((n): n is string => !!n); // this guarantees string[]

	return names;
};
