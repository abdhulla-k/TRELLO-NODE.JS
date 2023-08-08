// Function to convert error to string
export const getErrorMessage = (err: unknown): string => {
  // Set error message here
  const errorMessage = err instanceof Error ? err.message : String(err);
  // Return it
  return errorMessage;
}