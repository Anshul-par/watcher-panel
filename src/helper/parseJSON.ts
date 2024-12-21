/**
 * Utility function to safely parse a value to JSON if it is a string.
 * Ensures the result is not an array and handles borderline cases.
 *
 * @param value - The value to check and parse if necessary.
 * @returns Parsed object, an empty object for invalid cases, or `null` if the value is an array.
 */
export function parseJSON(value: unknown): object | null {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      // Ensure the parsed value is not an array
      if (Array.isArray(parsed)) {
        return null;
      }

      return parsed;
    } catch {
      // Return an empty object for invalid JSON
      return {};
    }
  } else if (typeof value === "object" && value !== null) {
    // Return as-is if already an object and not an array
    if (Array.isArray(value)) {
      return null;
    }
    return value as object;
  }

  // Return an empty object for all other cases (e.g., null, undefined, non-string types)
  return {};
}

// Example usage
