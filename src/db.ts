import Dexie, { type Table } from "dexie";

export interface ISetting {
  key: string;
  value: any;
}

export class PGDexie extends Dexie {
  settings!: Table<ISetting, string>;

  constructor() {
    super("pgDexie");
    this.version(1).stores({
      settings: "key",
    });
  }
}

// Global db instance
export const db = new PGDexie();
