import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ElasticVersion = "8.x" | "9.x";

interface VersionSelectorProps {
  value: ElasticVersion;
  onChange: (value: ElasticVersion) => void;
}

export function VersionSelector({ value, onChange }: VersionSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Elasticsearch Version</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select version" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="8.x">Elasticsearch 8.x (Elastic.Clients.Elasticsearch)</SelectItem>
          <SelectItem value="9.x">Elasticsearch 9.x (Elastic.Clients.Elasticsearch)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export type { ElasticVersion };