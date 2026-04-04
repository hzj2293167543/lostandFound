import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className="size-4 text-muted-foreground" />
      <Switch checked={isDark} onCheckedChange={handleToggle} aria-label="切换主题" size="sm" />
      <Moon className="size-4 text-muted-foreground" />
    </div>
  );
}
