import { createCohere } from "@ai-sdk/cohere";

import type { ApiKeyProviderConfig } from "@hebo/database/src/types/providers";
import { getSecret } from "@hebo/shared-api/utils/secrets";

import { ProviderAdapterBase, type ProviderAdapter } from "./provider";

export class CohereProviderAdapter
  extends ProviderAdapterBase
  implements ProviderAdapter
{
  private config?: ApiKeyProviderConfig;

  constructor(modelType: string) {
    super("cohere", modelType);
  }

  protected getSupportedModels(): Record<string, string> {
    return {
      "cohere/embed-v4.0": "embed-v4.0",
    };
  }

  async initialize(config?: ApiKeyProviderConfig): Promise<this> {
    if (config) {
      this.config = config;
    } else {
      const apiKey = await getSecret("CohereApiKey");
      this.config = { apiKey };
    }
    return this;
  }

  async getProvider() {
    const cfg = this.config!;
    return createCohere({ ...cfg });
  }
}
