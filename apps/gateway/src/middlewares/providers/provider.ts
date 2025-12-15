import type {
  ProviderConfig,
  ProviderSlug,
} from "@hebo/database/src/types/providers";

import type { Provider } from "ai";

export interface ProviderAdapter {
  initialize(config?: ProviderConfig): Promise<this>;
  getProvider(): Promise<Provider>;
  resolveModelId(): Promise<string>;
  supportsModel(modelType: string): boolean;
  transformConfigs(modelConfig: Record<string, any>): Record<string, any>;
  getProviderSlug(): ProviderSlug;
}

export abstract class ProviderAdapterBase {
  protected constructor(
    protected readonly providerSlug: ProviderSlug,
    protected readonly modelType: string,
  ) {}

  public getProviderSlug(): ProviderSlug {
    return this.providerSlug;
  }

  protected abstract getSupportedModels(): Record<string, string>;

  supportsModel(modelType: string): boolean {
    return modelType in this.getSupportedModels();
  }

  async resolveModelId(): Promise<string> {
    const modelId = this.getSupportedModels()[this.modelType];
    if (!modelId) {
      throw new Error(
        `Model ${this.modelType} not supported by ${this.providerSlug}.`,
      );
    }
    return modelId;
  }

  transformConfigs(modelConfig: Record<string, any>): Record<string, any> {
    return {
      [this.providerSlug]: modelConfig,
    };
  }
}
