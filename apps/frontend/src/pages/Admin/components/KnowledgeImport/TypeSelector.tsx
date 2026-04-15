import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TKnowledgeType } from '@lostfound/shared';

interface TypeSelectorProps {
  value: TKnowledgeType;
  onChange: (value: TKnowledgeType) => void;
}

export default function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">知识库分类</Label>
      <Select value={value} onValueChange={(v) => onChange(v as TKnowledgeType)}>
        <SelectTrigger>
          <SelectValue placeholder="选择分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="faq">常见问题 (FAQ)</SelectItem>
          <SelectItem value="notice">通知公告 (Notice)</SelectItem>
          <SelectItem value="rule">规章制度 (Rule)</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-500">
        选择文件对应的知识库分类，有助于 AI 更准确地回答相关问题
      </p>
    </div>
  );
}
