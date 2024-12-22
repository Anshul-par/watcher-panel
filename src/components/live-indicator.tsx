import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"

interface LiveIndicatorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  isLive?: boolean
}

export const LiveIndicatorButton: React.FC<LiveIndicatorButtonProps> = ({
  text = "Live",
  isLive = true,
  className,
}) => {
  return (
    <Badge variant="secondary" className={cn("gap-2", className)}>
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          isLive ? "bg-green-500 animate-pulse duration-1000" : "bg-gray-900"
        )}
      />
      {text}
    </Badge>
  )
}
