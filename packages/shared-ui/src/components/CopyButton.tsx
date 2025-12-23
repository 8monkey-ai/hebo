import { Check, Copy } from "lucide-react";
import * as React from "react";

import { cn } from "#/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

export function CopyButton({
  value,
  className,
  tooltip = "Copy to Clipboard",
  ...props
}: {
  value: string;
  tooltip?: string;
  className?: string;
} & React.ComponentProps<"button">) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) return;
    const timeout = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  return (
    <Tooltip>
      <TooltipTrigger
        data-slot="copy-button"
        data-copied={hasCopied}
        className={cn(
          "[&_svg:not([class*='size-'])]:size-4.5",
          "opacity-70 hover:opacity-100 cursor-pointer",
          className,
        )}
        onClick={() => {
          try {
            navigator.clipboard.writeText(value);
            setHasCopied(true);
          } catch (error) {
            console.error("Failed to copy to clipboard:", error);
          }
        }}
        {...props}
      >
        <span className="sr-only">Copy</span>
        {hasCopied ? <Check className="text-green-800" /> : <Copy />}
      </TooltipTrigger>
      <TooltipContent>{hasCopied ? "Copied" : tooltip}</TooltipContent>
    </Tooltip>
  );
}
