/**
 * Hook utility for safe async Firestore operations
 * Returns a function that wraps promise operations with abort handling
 */
export function createSafeAsyncWrapper(isMountedRef: React.MutableRefObject<boolean>) {
  return async function safeAsync<T>(
    promise: Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: unknown) => void
  ): Promise<T | null> {
    try {
      const result = await promise;
      
      // Only proceed if component is still mounted
      if (!isMountedRef.current) {
        return null;
      }
      
      onSuccess?.(result);
      return result;
    } catch (error) {
      // Handle AbortError gracefully
      if (error instanceof Error && error.name === "AbortError") {
        console.debug("Async operation was aborted (expected on unmount)");
        return null;
      }
      
      // Only log error if component is still mounted
      if (isMountedRef.current) {
        console.error("Async operation failed:", error);
        onError?.(error);
      }
      
      return null;
    }
  };
}
