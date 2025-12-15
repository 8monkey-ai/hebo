import { createGroq } from "@ai-sdk/groq";

import type { ApiKeyProviderConfig } from "@hebo/database/src/types/providers";
import { getSecret } from "@hebo/shared-api/utils/secrets";

import { ProviderAdapterBase, type ProviderAdapter } from "./provider";

export class GroqProviderAdapter
  extends ProviderAdapterBase
  implements ProviderAdapter
{
  private config?: ApiKeyProviderConfig;

  constructor(modelType: string) {
    super("groq", modelType);
  }

  protected getSupportedModels(): Record<string, string> {
    return {
      "openai/gpt-oss-120b": "openai/gpt-oss-120b",
      "openai/gpt-oss-20b": "openai/gpt-oss-20b",
    };
  }

  async initialize(config?: ApiKeyProviderConfig): Promise<this> {
    if (config) {
      this.config = config;
    } else {
      const apiKey = await getSecret("GroqApiKey");
      this.config = { apiKey };
    }
    return this;
  }

  async getProvider() {
    const cfg = this.config!;
    return createGroq({ ...cfg });
  }
}
