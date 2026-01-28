import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { InsertVideoRequest, VideoRequest } from "@shared/schema";
import {
  validateVideoRequest,
  retryRequest,
  VIDEO_SERVICE_CONFIG,
} from "@/lib/videoService";

export function useVideoRequest(id: number | null) {
  return useQuery({
    queryKey: [api.video.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const url = buildUrl(api.video.get.path, { id });
        const res = await fetch(url, {
          signal: AbortSignal.timeout(VIDEO_SERVICE_CONFIG.REQUEST_TIMEOUT),
        });

        if (res.status === 404) return null;

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `فشل في جلب البيانات: ${res.status} - ${errorText || res.statusText}`,
          );
        }

        const data = await res.json();
        return api.video.get.responses[200].parse(data);
      } catch (error) {
        console.error("خطأ في استدعاء الفيديو:", error);
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error("انتهت مهلة انتظار الطلب");
        }
        throw error;
      }
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data as VideoRequest | undefined;
      // Poll if status is pending or processing
      if (data && (data.status === "pending" || data.status === "processing")) {
        return VIDEO_SERVICE_CONFIG.POLLING_INTERVAL;
      }
      return false;
    },
    // Retry configuration
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error instanceof Error) {
        if (
          error.message.includes("404") ||
          error.message.includes("400")
        ) {
          return false;
        }
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) =>
      Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });
}

export function useGenerateVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertVideoRequest) => {
      try {
        // Validate input before sending using the video service
        const validation = validateVideoRequest(data);
        if (!validation.valid) {
          throw new Error(validation.errors.join("\n"));
        }

        // Validate using shared schema
        const validated = api.video.create.input.parse(data);

        console.log("Creating video with data:", validated);

        // Use retry logic for the request
        const response = await retryRequest(
          async () => {
            const res = await fetch(api.video.create.path, {
              method: api.video.create.method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(validated),
              signal: AbortSignal.timeout(
                VIDEO_SERVICE_CONFIG.REQUEST_TIMEOUT,
              ),
            });

            if (!res.ok) {
              if (res.status === 400) {
                const error = api.video.create.responses[400].parse(
                  await res.json(),
                );
                throw new Error(error.message);
              }

              const errorText = await res.text();
              const errorMessage =
                errorText || `HTTP Error: ${res.status}`;
              const error = new Error(
                `فشل في بدء إنشاء الفيديو: ${res.status} - ${errorMessage}`,
              );
              (error as any).status = res.status;
              throw error;
            }

            return res;
          },
          VIDEO_SERVICE_CONFIG.MAX_RETRIES,
          VIDEO_SERVICE_CONFIG.RETRY_DELAY,
        );

        // 202 Accepted return
        const responseData = await response.json();
        return api.video.create.responses[202].parse(responseData);
      } catch (error) {
        console.error("خطأ في إنشاء الفيديو:", error);

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            throw new Error("انتهت مهلة انتظار الطلب");
          }
          throw new Error(error.message);
        }

        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate the get query for this specific ID so it starts fetching immediately
      queryClient.setQueryData([api.video.get.path, data.id], data);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
}
