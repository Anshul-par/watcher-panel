import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const description = "An interactive bar chart";

interface LiveIndicatorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  isLive?: boolean;
}

export const LiveIndicatorButton: React.FC<LiveIndicatorButtonProps> = ({
  text,
  isLive = true,
  className,
  ...props
}) => {
  const [isRippling, setIsRippling] = useState(false);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 1000);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  return (
    <button
      className={cn(
        "relative flex items-center px-4 py-2 bg-gray-800 text-white rounded-full font-semibold",
        "hover:bg-gray-700 transition-colors duration-300",
        className
      )}
      {...props}
    >
      <span className="mr-2">{text}</span>
      <span className="relative flex h-3 w-3">
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75",
            isLive ? "bg-green-500" : "bg-gray-500",
            isRippling && isLive && "animate-ping"
          )}
        ></span>
        <span
          className={cn(
            "relative inline-flex rounded-full h-3 w-3",
            isLive ? "bg-green-500" : "bg-gray-500"
          )}
        ></span>
      </span>
    </button>
  );
};
