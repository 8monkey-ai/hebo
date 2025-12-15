import { createGroq } from "@ai-sdk/groq";

import { getSecret } from "@hebo/shared-api/utils/secrets";

import type { ApiKeyProviderConfig } from "~api/modules/providers/types";

import { ProviderAdapterBase, type ProviderAdapter } from "./provider";

export class GroqProviderAdapter
  extends ProviderAdapterBase
  implements ProviderAdapter
{
  private config?: ApiKeyProviderConfig;

  constructor(modelName: string) {
    super("groq", modelName);
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

  async resolveModelId() {
    return this.getProviderModelId();
  }
}
