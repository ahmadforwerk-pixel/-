import { motion } from "framer-motion";
import { Loader2, Music, Type, Video, Download, FileText } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

const stages = [
  { id: 1, label: "جاري تحميل الآيات", icon: Type, description: "استرجاع النصوص القرآنية" },
  { id: 2, label: "تحميل تلاوة القارئ", icon: Music, description: "جلب ملف الصوت" },
  { id: 3, label: "معالجة النصوص", icon: FileText, description: "تنسيق النصوص مع الشكل والتشكيل" },
  { id: 4, label: "دمج الفيديو والمؤثرات", icon: Video, description: "دمج الصوت والصورة والنصوص" },
  { id: 5, label: "إنتاج الملف النهائي", icon: Download, description: "تحويل الفيديو والضغط" },
];

export function ProcessingState() {
  const [currentStage, setCurrentStage] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 5000); // Simulate progress based on stages
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Memoize stages to prevent unnecessary re-renders
  const memoizedStages = useMemo(() => stages, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full py-12 flex flex-col items-center justify-center text-center space-y-6"
    >
      <div className="relative">
        <motion.div 
          className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center relative z-10">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </div>
      
      <div className="space-y-4 w-full max-w-sm">
        <div>
          <h3 className="text-2xl font-bold font-display text-primary mb-1">جاري المعالجة...</h3>
          <div className="flex items-center justify-center gap-4 text-sm">
            <p className="text-muted-foreground">المرحلة {currentStage + 1} من {stages.length}</p>
            <div className="w-px h-4 bg-border" />
            <p className="text-muted-foreground">الوقت: {formatTime(elapsedTime)}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {memoizedStages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index === currentStage;
            const isCompleted = index < currentStage;
            
            return (
              <motion.div
                key={stage.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  isActive 
                    ? "bg-primary/10 border-primary/30 text-primary shadow-md shadow-primary/10" 
                    : isCompleted 
                    ? "bg-secondary/50 border-secondary text-secondary-foreground/60" 
                    : "bg-muted/30 border-transparent text-muted-foreground/40"
                }`}
              >
                <motion.div 
                  className={`p-2 rounded-lg transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
                <div className="flex-1 text-right">
                  <span className={`font-medium text-sm block ${isActive ? "text-primary" : ""}`}>
                    {stage.label}
                  </span>
                  <span className="text-xs text-muted-foreground/60">{stage.description}</span>
                </div>
                {isActive && (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                    <Loader2 className="w-4 h-4 text-primary" />
                  </motion.div>
                )}
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-primary font-bold"
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-xs text-muted-foreground mt-4 max-w-sm"
      >
        <p className="mb-2">
          قد يستغرق هذا عدة دقائق حسب حجم الملف والاتصال
        </p>
        <p>
          ⏱️ الوقت المتوقع المتبقي: حوالي دقيقتين
        </p>
      </motion.div>
    </motion.div>
  );
}
