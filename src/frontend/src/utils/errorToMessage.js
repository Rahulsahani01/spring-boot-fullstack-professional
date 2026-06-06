export function errorToMessage(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;

  // Our apiClient interceptor tries to normalize to {error, message, timestamp}
  if (err.message) return err.message;
  if (err.error) return String(err.error);

  // Axios-style fallback
  if (err?.error?.message) return err.error.message;

  return "Unexpected error";
}
