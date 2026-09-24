const SANDBOX_URL = "https://tokenized.sandbox.bka.sh/v1.2.0-beta";
const REQUEST_TIMEOUT_MS = 15_000;
const SUCCESS_CODE = "0000";

function baseUrl(): string {
  const url = process.env.BKASH_BASE_URL;
  if (url) return url;
  // Never let a missing variable silently route real payments to the sandbox.
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing required environment variable: BKASH_BASE_URL");
  }
  return SANDBOX_URL;
}

type GrantTokenResponse = {
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  statusCode?: string;
  statusMessage?: string;
};

type CreatePaymentResponse = {
  paymentID: string;
  bkashURL: string;
  statusCode: string;
  statusMessage: string;
};

export type ExecutePaymentResponse = {
  paymentID: string;
  trxID?: string;
  transactionStatus?: string;
  amount?: string;
  merchantInvoiceNumber?: string;
  statusCode: string;
  statusMessage: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function bkashFetch<T extends { statusCode?: string; statusMessage?: string }>(
  path: string,
  init: { headers: Record<string, string>; body: unknown }
): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...init.headers },
    body: JSON.stringify(init.body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) throw new Error(`bKash request failed (${res.status}) for ${path}`);
  const data = (await res.json()) as T;
  // bKash reports business failures with HTTP 200 and a non-0000 statusCode.
  if (data.statusCode !== undefined && data.statusCode !== SUCCESS_CODE) {
    throw new Error(`bKash rejected ${path}: ${data.statusCode} ${data.statusMessage ?? ""}`.trim());
  }
  return data;
}

// Cache the auth token until shortly before it expires instead of granting one per call.
let cachedToken: { value: string; expiresAt: number } | null = null;

export async function grantBkashToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const data = await bkashFetch<GrantTokenResponse>("/tokenized/checkout/token/grant", {
    headers: { username: requireEnv("BKASH_USERNAME"), password: requireEnv("BKASH_PASSWORD") },
    body: { app_key: requireEnv("BKASH_APP_KEY"), app_secret: requireEnv("BKASH_APP_SECRET") },
  });

  const ttlMs = Math.max((data.expires_in ?? 0) - 60, 0) * 1000;
  cachedToken = { value: data.id_token, expiresAt: Date.now() + ttlMs };
  return data.id_token;
}

export async function createBkashPayment(params: {
  amount: number;
  payerReference: string;
  callbackURL: string;
  merchantInvoiceNumber: string;
}): Promise<CreatePaymentResponse> {
  const token = await grantBkashToken();

  return bkashFetch<CreatePaymentResponse>("/tokenized/checkout/create", {
    headers: { Authorization: token, "X-APP-Key": requireEnv("BKASH_APP_KEY") },
    body: {
      mode: "0011",
      payerReference: params.payerReference,
      callbackURL: params.callbackURL,
      amount: params.amount.toString(),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: params.merchantInvoiceNumber,
    },
  });
}

export async function executeBkashPayment(paymentID: string): Promise<ExecutePaymentResponse> {
  const token = await grantBkashToken();

  return bkashFetch<ExecutePaymentResponse>("/tokenized/checkout/execute", {
    headers: { Authorization: token, "X-APP-Key": requireEnv("BKASH_APP_KEY") },
    body: { paymentID },
  });
}
