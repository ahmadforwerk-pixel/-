import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { Suspense } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route component={NotFound} />
    </Switch>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div dir="rtl" className="font-sans antialiased text-foreground bg-background min-h-screen">
          <Suspense fallback={<LoadingFallback />}>
            <Router />
          </Suspense>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
