import { createContext } from "@lit/context";
import { db } from "./db";

export class Settings {
  async queryOpenAIKey(): Promise<string> {
    let val = (await db.settings.get("openai-key"))?.value || "";
    console.log("queryOpenAIKey", val);
    return val;
  }

  async setOpenAIKey(key: string) {
    console.log("setOpenAIKey", key);
    await db.settings.put({ key: "openai-key", value: key });
  }
}

export const settingsContext = createContext<Settings>(Symbol("settings"));
