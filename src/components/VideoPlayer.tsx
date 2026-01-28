import { Play, Download, AlertCircle, Copy, Check, Volume2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatVideoMetadata } from "@/lib/videoService";

interface VideoPlayerProps {
  url: string | null;
  error?: string | null;
}

export function VideoPlayer({ url, error }: VideoPlayerProps) {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopyLink = () => {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleDownload = () => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      const timestamp = new Date().getTime();
      link.download = `quran-video-${timestamp}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mt-8"
      >
        <Alert className="border-destructive/20 bg-destructive/5">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <span className="font-bold block mb-1">حدث خطأ أثناء الإنشاء</span>
            <span className="text-sm">{error}</span>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (!url) return null;

  const videoMetadata = formatVideoMetadata(url);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-8 space-y-4"
    >
      {/* Video Player Card */}
      <Card className="overflow-hidden bg-black/5 border-primary/20 shadow-lg">
        <div className="aspect-video w-full bg-black relative rounded-t-xl overflow-hidden group">
          <video
            src={url}
            controls
            className="w-full h-full object-contain"
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 pointer-events-none" />
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-primary font-display text-lg">
                الفيديو جاهز
              </h3>
              <p className="text-xs text-muted-foreground">
                تم إنشاء الفيديو بنجاح - {videoMetadata.format}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2"
                title="نسخ الرابط"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">نسخ</span>
                  </>
                )}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
                title="تحميل الفيديو"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">تحميل</span>
              </Button>
            </div>
          </div>

          {/* Info Alert about text rendering */}
          <Alert className="border-primary/20 bg-primary/5">
            <Volume2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-primary">
              تأكد من أن الفيديو يحتوي على النصوص القرآنية مع الكسرات والتشكيل
              الصحيح في الصور
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Video Info Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">الصيغة</p>
          <p className="font-bold text-sm">{videoMetadata.format}</p>
        </div>
        <div className="p-3 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">الحالة</p>
          <p className="font-bold text-sm text-primary">✓ مكتمل</p>
        </div>
        <div className="p-3 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">الجودة</p>
          <p className="font-bold text-sm">HD</p>
        </div>
        <div className="p-3 rounded-lg bg-card border border-border">
          <p className="text-xs text-muted-foreground mb-1">التنسيق</p>
          <p className="font-bold text-sm">RTL</p>
        </div>
      </div>
    </motion.div>
  );
}
