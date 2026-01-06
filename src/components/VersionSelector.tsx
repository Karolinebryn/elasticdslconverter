import { Label } from "@/components/ui/label";

export function VersionSelector() {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Elasticsearch Version
      </Label>
      <div className="px-3 py-2 bg-muted rounded-md text-sm text-muted-foreground">
        Elasticsearch 8.x (Elastic.Clients.Elasticsearch)
      </div>
    </div>
  );
}