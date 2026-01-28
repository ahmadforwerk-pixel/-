import { motion } from "framer-motion";
import { Loader2, Music, Type, Video, Download } from "lucide-react";
import { useEffect, useState } from "react";

const stages = [
  { id: 1, label: "جاري تحميل الآيات", icon: Type },
  { id: 2, label: "تحميل تلاوة القارئ", icon: Music },
  { id: 3, label: "رسم النصوص القرآنية", icon: Type },
  { id: 4, label: "دمج الفيديو والمؤثرات", icon: Video },
  { id: 5, label: "إنتاج الملف النهائي", icon: Download },
];

export function ProcessingState() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 5000); // Simulate progress based on stages
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full py-12 flex flex-col items-center justify-center text-center space-y-6"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center relative z-10">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </div>
      
      <div className="space-y-4 w-full max-w-sm">
        <h3 className="text-2xl font-bold font-display text-primary">جاري المعالجة...</h3>
        
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index === currentStage;
            const isCompleted = index < currentStage;
            
            return (
              <motion.div
                key={stage.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  isActive ? "bg-primary/10 border-primary/30 text-primary" : 
                  isCompleted ? "bg-secondary/50 border-secondary text-secondary-foreground/60" :
                  "bg-muted/30 border-transparent text-muted-foreground/40"
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">{stage.label}</span>
                {isActive && (
                  <div className="mr-auto">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}
                {isCompleted && (
                  <div className="mr-auto text-primary">
                    ✓
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
