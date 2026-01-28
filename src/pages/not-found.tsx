import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
      <div dir="rtl" className="w-full">
        <Card className="w-full max-w-md mx-4 border-t-4 border-t-destructive shadow-lg">
          <CardContent className="pt-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-bold font-display text-destructive">404</h1>
                <h2 className="text-2xl font-bold text-foreground">الصفحة غير موجودة</h2>
              </div>

              <CardDescription className="text-base leading-relaxed">
                عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها. يرجى التأكد من عنوان الرابط أو العودة إلى الصفحة الرئيسية.
              </CardDescription>

              <Link href="/" asChild>
                <Button className="w-full mt-6 h-11 gap-2">
                  <Home className="w-4 h-4" />
                  العودة إلى الصفحة الرئيسية
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
