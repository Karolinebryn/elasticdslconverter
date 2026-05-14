import { Link } from "react-router-dom";
import { TranslatorHeader } from "@/components/TranslatorHeader";
import { TranslatorPanel } from "@/components/TranslatorPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <TranslatorHeader />
        <main>
          <TranslatorPanel />
        </main>
        <footer className="text-center py-8 text-sm text-muted-foreground space-y-2">
          <p>Powered by AI • Supports Elasticsearch 8.x and 9.x and Elastic.Clients.Elasticsearch 8.x and 9.x</p>
          <p>
            <Link to="/about" className="text-primary hover:underline">
              About this project
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
