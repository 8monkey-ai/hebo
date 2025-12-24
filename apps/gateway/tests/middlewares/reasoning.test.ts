import { describe, expect, test } from "bun:test";

import {
  Gemini3FlashPreviewAdapter,
  Gemini3ProPreviewAdapter,
} from "~gateway/middlewares/models/gemini";
import type { ModelAdapter } from "~gateway/middlewares/models/model";
import type { ProviderAdapter } from "~gateway/middlewares/providers/provider";
import { VertexProviderAdapter } from "~gateway/middlewares/providers/vertex";

import type { ProviderOptions } from "@ai-sdk/provider-utils";

describe("End-to-End Reasoning Option Transformation", () => {
  type TestCase = {
    name: string;
    modelAdapter: ModelAdapter;
    providerAdapter: ProviderAdapter;
    initialInput: ProviderOptions | undefined;
    expectedOutput: ProviderOptions | Record<string, any>;
  };

  const gemini3ProAdapter = new Gemini3ProPreviewAdapter();
  const vertexProvider = new VertexProviderAdapter("gemini-2.5-pro");

  const testCases: TestCase[] = [
    {
      name: "Gemini 3 Pro + Vertex: reasoning enabled (boolean) defaults to high thinkingLevel",
      modelAdapter: gemini3ProAdapter,
      providerAdapter: vertexProvider,
      initialInput: {
        openaiCompatible: {
          reasoning: {
            enabled: true,
          },
        },
      },
      expectedOutput: {
        openaiCompatible: {
          reasoning: {
            enabled: true,
          },
        },
        google: {
          thinkingConfig: {
            includeThoughts: true,
            thinkingLevel: "high",
          },
        },
      },
    },
    {
      name: "Gemini 3 Pro + Vertex: reasoning with low effort",
      modelAdapter: gemini3ProAdapter,
      providerAdapter: vertexProvider,
      initialInput: {
        openaiCompatible: {
          reasoning: {
            effort: "low",
          },
        },
      },
      expectedOutput: {
        openaiCompatible: {
          reasoning: {
            effort: "low",
          },
        },
        google: {
          thinkingConfig: {
            includeThoughts: true,
            thinkingLevel: "low",
          },
        },
      },
    },
    {
      name: "Gemini 3 Flash + Vertex: reasoning with medium effort",
      modelAdapter: new Gemini3FlashPreviewAdapter(),
      providerAdapter: vertexProvider,
      initialInput: {
        openaiCompatible: {
          reasoning: {
            effort: "medium",
          },
        },
      },
      expectedOutput: {
        openaiCompatible: {
          reasoning: {
            effort: "medium",
          },
        },
        google: {
          thinkingConfig: {
            includeThoughts: true,
            thinkingLevel: "medium",
          },
        },
      },
    },
  ];

  for (const {
    name,
    modelAdapter,
    providerAdapter,
    initialInput,
    expectedOutput,
  } of testCases) {
    test(name, () => {
      const modelTransformed = modelAdapter.transformOptions(initialInput);
      const result = providerAdapter.transformOptions(modelTransformed);
      expect(result).toEqual(expectedOutput);
    });
  }
});
