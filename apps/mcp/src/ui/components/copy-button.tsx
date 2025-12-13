"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";

import { Button } from "~mcp/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~mcp/ui/components/tooltip";
import { cn } from "~mcp/ui/lib/utils";

export function CopyButton({
  value,
  className,
  tooltip = "Copy to Clipboard",
}: React.ComponentProps<typeof Button> & {
  value: string;
  tooltip?: string;
}) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger
        data-slot="copy-button"
        data-copied={hasCopied}
        className={cn(
          "size-4.5 [&_svg:not([class*='size-'])]:size-4.5",
          "bg-code z-10 hover:opacity-100 focus-visible:opacity-100",
          className,
        )}
        onClick={() => {
          navigator.clipboard.writeText(value);
          setHasCopied(true);
        }}
      >
        <span className="sr-only">Copy</span>
        {hasCopied ? <Check /> : <Copy />}
      </TooltipTrigger>
      <TooltipContent>{hasCopied ? "Copied" : tooltip}</TooltipContent>
    </Tooltip>
  );
}
