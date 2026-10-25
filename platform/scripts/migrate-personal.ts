import { migratePersonal } from "../lib/personal-auth.ts";
await migratePersonal();
console.log("Personal account and journal migrations complete.");
process.exit(0);
