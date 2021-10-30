/**
 * Determines if something is a object or not
 * @param item a possible object
 * @returns boolean
 */
function isObject(item: unknown) {
	return item && typeof item == 'object' && !Array.isArray(item);
}

/**
 * Merges object which contain other objects.
 * **Important** Cyclical references will result in an infinite loop
 * @param target The object which will have the merged properties
 * @param sources The set of objects which properties will be merged into the target. Objects in params further back will overwrite earlier.
 * @returns The post merged target
 */
function deepMerge(
	target: Record<string, unknown>,
	...sources: Record<string, unknown>[]
): Record<string, unknown> {
	if (sources.length == 0) {
		return target;
	}
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!isObject(target[key])) {
					Object.assign(target, { [key]: {} });
				}
				deepMerge(<Record<string, unknown>>target[key], <Record<string, unknown>>source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}
	return deepMerge(target, ...sources);
}

export default deepMerge;
