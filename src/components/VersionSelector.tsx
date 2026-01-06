import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface VersionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const versions = [
  { value: "8.x", label: "Elasticsearch 8.x (NEST 8.x / Elastic.Clients.Elasticsearch)" },
  { value: "7.x", label: "Elasticsearch 7.x (NEST 7.x)" },
];

export function VersionSelector({ value, onChange }: VersionSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="version" className="text-sm font-medium">
        Elasticsearch Version
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="version" className="w-full">
          <SelectValue placeholder="Select version" />
        </SelectTrigger>
        <SelectContent>
          {versions.map((version) => (
            <SelectItem key={version.value} value={version.value}>
              {version.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
