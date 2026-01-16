import { secrets } from "bun";
import { Resource } from "sst";

export const getSecret = async (name: string, required = true) => {
  try {
    // @ts-expect-error: Resource may not be defined
    const value = Resource[name].value;
    return value === "undefined" ? undefined : value;
  } catch {
    const value = await secrets.get({ service: "hebo", name });
    if (required && !value) {
      throw new Error(`Secret ${name} is required but not found`);
    }
    return value;
  }
};
