import { Play, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface VideoPlayerProps {
  url: string | null;
  error?: string | null;
}

export function VideoPlayer({ url, error }: VideoPlayerProps) {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mt-8"
      >
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-bold text-destructive mb-2 font-display">حدث خطأ أثناء الإنشاء</h3>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!url) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-8"
    >
      <Card className="overflow-hidden bg-black/5 border-primary/20">
        <div className="aspect-video w-full bg-black relative rounded-t-xl overflow-hidden group">
          <video
            src={url}
            controls
            className="w-full h-full object-contain"
            playsInline
          />
        </div>
        <CardContent className="p-4 flex items-center justify-between bg-card">
          <div>
            <h3 className="font-bold text-primary font-display text-lg">الفيديو جاهز</h3>
            <p className="text-xs text-muted-foreground">تم إنشاء الفيديو بنجاح</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => window.open(url, '_blank')}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            تحميل
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
