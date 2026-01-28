import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { InsertVideoRequest, VideoRequest } from "@shared/schema";

export function useVideoRequest(id: number | null) {
  return useQuery({
    queryKey: [api.video.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.video.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("فشل في جلب البيانات");
      return api.video.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data as VideoRequest | undefined;
      // Poll if status is pending or processing
      if (data && (data.status === "pending" || data.status === "processing")) {
        return 2000; // Poll every 2 seconds
      }
      return false;
    },
  });
}

export function useGenerateVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertVideoRequest) => {
      // Validate input before sending using the shared schema
      const validated = api.video.create.input.parse(data);
      
      const res = await fetch(api.video.create.path, {
        method: api.video.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.video.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("فشل في بدء إنشاء الفيديو");
      }
      
      // 202 Accepted return
      return api.video.create.responses[202].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate the get query for this specific ID so it starts fetching immediately
      queryClient.setQueryData([api.video.get.path, data.id], data);
    },
  });
}
