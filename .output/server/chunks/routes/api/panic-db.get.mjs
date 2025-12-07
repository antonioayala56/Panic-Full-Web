import { c as defineEventHandler, e as createError } from '../../_/nitro.mjs';
import { p as panicDB } from '../../_/panic_db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const panicDb_get = defineEventHandler(async (event) => {
  try {
    return panicDB;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error loading panic database"
    });
  }
});

export { panicDb_get as default };
//# sourceMappingURL=panic-db.get.mjs.map
