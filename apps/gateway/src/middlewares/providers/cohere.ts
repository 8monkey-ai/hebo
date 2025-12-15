import { createCohere } from "@ai-sdk/cohere";

import { getSecret } from "@hebo/shared-api/utils/secrets";

import type { ApiKeyProviderConfig } from "~api/modules/providers/types";

import { ProviderAdapterBase, type ProviderAdapter } from "./provider";

export class CohereProviderAdapter
  extends ProviderAdapterBase
  implements ProviderAdapter
{
  private config?: ApiKeyProviderConfig;

  constructor(modelName: string) {
    super("cohere", modelName);
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

  async resolveModelId() {
    return this.getProviderModelId();
  }
}
