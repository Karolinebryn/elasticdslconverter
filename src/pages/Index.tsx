import { TranslatorHeader } from "@/components/TranslatorHeader";
import { TranslatorPanel } from "@/components/TranslatorPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <TranslatorHeader />
        <TranslatorPanel />
        <footer className="text-center py-8 text-sm text-muted-foreground">
          Powered by AI • Supports NEST 7.x and Elastic.Clients.Elasticsearch 8.x
        </footer>
      </div>
    </div>
  );
};

export default Index;
