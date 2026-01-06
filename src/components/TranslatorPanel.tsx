import { useState } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from "./CodeEditor";
import { VersionSelector } from "./VersionSelector";
import { CopyButton } from "./CopyButton";
import { useTranslation } from "@/hooks/useTranslation";

const sampleQuery = `{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "elasticsearch" } }
      ],
      "filter": [
        { "term": { "status": "published" } },
        { "range": { "date": { "gte": "2024-01-01" } } }
      ]
    }
  },
  "size": 10,
  "from": 0,
  "_source": ["title", "date", "status"]
}`;

export function TranslatorPanel() {
  const [queryDsl, setQueryDsl] = useState("");
  const [version, setVersion] = useState("8.x");
  const { translate, isLoading, output } = useTranslation();

  const handleTranslate = () => {
    translate(queryDsl, version);
  };

  const loadSample = () => {
    setQueryDsl(sampleQuery);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <Card className="border-border shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Query DSL Input</CardTitle>
          <Button variant="ghost" size="sm" onClick={loadSample} className="text-xs">
            Load Sample
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <VersionSelector value={version} onChange={setVersion} />
          <CodeEditor
            value={queryDsl}
            onChange={setQueryDsl}
            language="json"
            placeholder="Paste your Elasticsearch Query DSL here..."
          />
          <Button
            onClick={handleTranslate}
            disabled={isLoading || !queryDsl.trim()}
            className="w-full gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Translate to C#
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Panel */}
      <Card className="border-border shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">C# .NET Client Code</CardTitle>
          <CopyButton text={output} disabled={!output} />
        </CardHeader>
        <CardContent>
          <CodeEditor
            value={output}
            language="csharp"
            readOnly
            placeholder="Your C# code will appear here..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
