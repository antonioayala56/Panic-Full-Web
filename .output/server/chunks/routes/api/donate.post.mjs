import { c as defineEventHandler, r as readBody, e as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const donate_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { amount } = body;
    if (!amount || typeof amount !== "number" || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid amount"
      });
    }
    const preferenceId = `DONATION_${amount}_${Date.now()}`;
    const initPoint = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
    return {
      init_point: initPoint,
      id: preferenceId
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error creating payment preference"
    });
  }
});

export { donate_post as default };
//# sourceMappingURL=donate.post.mjs.map
