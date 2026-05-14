import { Code2, Zap } from "lucide-react";

export function TranslatorHeader() {
  return (
    <header className="text-center space-y-4 py-8">
      <div className="flex items-center justify-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Code2 className="w-8 h-8" />
        </div>
        <Zap className="w-5 h-5 text-accent-foreground animate-pulse" />
        <div className="p-3 rounded-xl bg-secondary text-secondary-foreground">
          <span className="font-mono text-lg font-bold">C#</span>
        </div>
      </div>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Elasticsearch Query DSL to C# Converter
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Translate Elasticsearch Query DSL into strongly-typed Elasticsearch C# for the
          <span className="font-mono"> Elastic.Clients.Elasticsearch</span> .NET client (8.x and 9.x).
        </p>
      </div>
    </header>
  );
}
