import { describe, expect, test } from "bun:test";

import { GroqProviderAdapter } from "~gateway/middlewares/providers/groq";
import type { ProviderAdapter } from "~gateway/middlewares/providers/provider";

import type { ProviderOptions } from "@ai-sdk/provider-utils";

describe("GroqProviderAdapter transformOptions", () => {
  type TestCase = {
    name: string;
    provider: ProviderAdapter;
    input: ProviderOptions | undefined;
    expected: ProviderOptions;
  };

  const groqProvider = new GroqProviderAdapter("openai/gpt-oss-120b");

  const testCases: TestCase[] = [
    {
      name: "Groq: no options provided",
      provider: groqProvider,
      input: undefined,
      expected: {},
    },
    {
      name: "Groq: passes through transformed reasoningEffort",
      provider: groqProvider,
      input: {
        modelConfig: {
          reasoningEffort: "medium",
        },
      } as any,
      expected: {
        groq: {
          reasoningEffort: "medium",
        },
      },
    },
    {
      name: "Groq: preserves other provider options",
      provider: groqProvider,
      input: {
        "other-provider": {
          key: "value",
        },
        modelConfig: {
          reasoningEffort: "high",
        },
      } as any,
      expected: {
        "other-provider": {
          key: "value",
        },
        groq: {
          reasoningEffort: "high",
        },
      },
    },
  ];

  for (const { name, provider, input, expected } of testCases) {
    test(name, () => {
      const result = provider.transformOptions(input);
      expect(result).toEqual(expected);
    });
  }
});
