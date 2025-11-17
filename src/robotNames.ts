// Utility function to generate a list of robot names for the simulation
// Accepts a requested count of robots and returns an array of unique or repeated names.
export const getRobotNames = (count: number): string[] => {
	// Base human-like names for the first set of robots
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

	// NATO phonetic alphabet as additional name pool for more robots
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

	// Combine both arrays to form a larger pool of potential robot names
	const combined = [...baseNames, ...natoAlphabet];

	/*
		Generate an array of length `count`:
		- Use Array.from with a mapping function to assign names by index.
		- `i % combined.length` ensures that if the requested count exceeds available names,
		  it wraps around and reuses names.
		- The `.filter((n): n is string => !!n)` step:
			• Ensures that the resulting array contains only defined strings.
			• This is a TypeScript type guard to guarantee the return type `string[]`.
	*/
	const names: string[] = Array.from(
		{ length: count },
		(_, i) => combined[i % combined.length]
	).filter((n): n is string => !!n);

	return names;
};
