import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Check if response is OK, throw error with proper message if not
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const text = await res.text();
      if (text) {
        errorMessage = text;
      }
    } catch {
      // Use statusText if text parsing fails
    }
    
    const error = new Error(`${res.status}: ${errorMessage}`);
    (error as any).status = res.status;
    throw error;
  }
}

/**
 * Generic API request function with error handling
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API Request Error [${method} ${url}]:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Query function factory with customizable 401 handling
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey.join("/") as string, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error("Query Error:", error);
      throw error;
    }
  };

/**
 * Configured QueryClient with optimized defaults
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Retry once on failure
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
