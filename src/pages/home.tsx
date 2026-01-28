import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVideoRequestSchema, RECITER_OPTIONS, SURAH_LIST } from "@shared/schema";
import { useGenerateVideo, useVideoRequest } from "@/hooks/use-video";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ProcessingState } from "@/components/ProcessingState";
import { Sparkles, BookOpen, Video, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = insertVideoRequestSchema.extend({
  surah: z.coerce.number().min(1).max(114),
  startAyah: z.coerce.number().min(1),
  endAyah: z.coerce.number().min(1),
});

export default function Home() {
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const generateMutation = useGenerateVideo();
  const { data: requestStatus } = useVideoRequest(currentRequestId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      surah: 1,
      startAyah: 1,
      endAyah: 7,
      reciter: "Alafasy_128kbps",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const result = await generateMutation.mutateAsync(data);
      setCurrentRequestId(result.id);
      toast({
        title: "تم استلام الطلب",
        description: "بدأنا في معالجة الفيديو الخاص بك",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
      });
    }
  }

  const isProcessing = requestStatus?.status === "pending" || requestStatus?.status === "processing";
  const isCompleted = requestStatus?.status === "completed";
  const isFailed = requestStatus?.status === "failed";

  return (
    <div className="min-h-screen pb-20 islamic-pattern">
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <main className="container max-w-4xl mx-auto px-4 pt-12 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4 ring-1 ring-primary/20 shadow-lg shadow-primary/5">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-primary drop-shadow-sm font-display">
            صانع فيديوهات القرآن
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            أنشئ مقاطع فيديو قرآنية جميلة بتلاوات عذبة وتصاميم هادئة في ثوانٍ معدودة
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="hidden lg:block lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-none">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-xl font-display">
                  <Sparkles className="w-5 h-5 text-accent" />
                  ميزات الخدمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-white/10 p-2 rounded-lg mt-1">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">جودة عالية</h4>
                    <p className="text-white/80 text-sm">فيديوهات بدقة عالية مناسبة للمشاركة</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-white/10 p-2 rounded-lg mt-1">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">أصوات نقية</h4>
                    <p className="text-white/80 text-sm">اختر من بين أشهر القراء في العالم الإسلامي</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="relative p-6 rounded-2xl bg-secondary/30 border border-secondary text-center">
              <span className="font-display text-2xl text-secondary-foreground/80 leading-loose">
                "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
              </span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-t-4 border-t-primary shadow-2xl shadow-primary/5">
              <CardHeader>
                <CardTitle className="font-display">إعدادات الفيديو</CardTitle>
                <CardDescription>أدخل تفاصيل الآيات التي تود إنشاء فيديو لها</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="surah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اختر السورة</FormLabel>
                            <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl">
                                  <SelectValue placeholder="اختر السورة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[300px]">
                                {SURAH_LIST.map((surah) => (
                                  <SelectItem key={surah.id} value={surah.id.toString()}>
                                    {surah.id}. {surah.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="reciter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>القارئ</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl">
                                  <SelectValue placeholder="اختر القارئ" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {RECITER_OPTIONS.map((option) => (
                                  <SelectItem key={option.id} value={option.id}>
                                    {option.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="startAyah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>آية البداية</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} className="h-12 rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endAyah"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>آية النهاية</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} className="h-12 rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full text-lg h-14 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20" 
                      disabled={generateMutation.isPending || isProcessing}
                    >
                      {generateMutation.isPending ? "جاري الإرسال..." : "إنشاء الفيديو"}
                      {!generateMutation.isPending && <Sparkles className="mr-2 h-5 w-5" />}
                    </Button>

                  </form>
                </Form>

                {isProcessing && <ProcessingState />}
                
                {isCompleted && requestStatus?.videoUrl && (
                  <VideoPlayer url={requestStatus.videoUrl} />
                )}

                {isFailed && (
                  <VideoPlayer url={null} error={requestStatus?.error || "حدث خطأ غير معروف"} />
                )}

              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
