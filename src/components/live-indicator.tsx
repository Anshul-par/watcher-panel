import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface LiveIndicatorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  isLive?: boolean;
  onClick?: () => void;
}

export const LiveIndicatorButton: React.FC<LiveIndicatorButtonProps> = ({
  text = "Live",
  isLive = true,
  className,
  onClick,
}) => {
  return (
    <Badge
      variant="secondary"
      onClick={onClick}
      className={cn("gap-2 cursor-pointer", className)}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          isLive ? "bg-green-500 animate-pulse duration-1000" : "bg-gray-900"
        )}
      />
      {text}
    </Badge>
  );
};
