const BASE_URL = process.env.BKASH_BASE_URL ?? "https://tokenized.sandbox.bka.sh/v1.2.0-beta";

type GrantTokenResponse = {
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
};

type CreatePaymentResponse = {
  paymentID: string;
  bkashURL: string;
  statusCode: string;
  statusMessage: string;
};

type ExecutePaymentResponse = {
  paymentID: string;
  trxID?: string;
  transactionStatus?: string;
  statusCode: string;
  statusMessage: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export async function grantBkashToken(): Promise<GrantTokenResponse> {
  const res = await fetch(`${BASE_URL}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: requireEnv("BKASH_USERNAME"),
      password: requireEnv("BKASH_PASSWORD"),
    },
    body: JSON.stringify({
      app_key: requireEnv("BKASH_APP_KEY"),
      app_secret: requireEnv("BKASH_APP_SECRET"),
    }),
  });

  if (!res.ok) throw new Error("Failed to authenticate with bKash.");
  return res.json();
}

export async function createBkashPayment(params: {
  amount: number;
  payerReference: string;
  callbackURL: string;
  merchantInvoiceNumber: string;
}): Promise<CreatePaymentResponse> {
  const { id_token } = await grantBkashToken();

  const res = await fetch(`${BASE_URL}/tokenized/checkout/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: id_token,
      "X-APP-Key": requireEnv("BKASH_APP_KEY"),
    },
    body: JSON.stringify({
      mode: "0011",
      payerReference: params.payerReference,
      callbackURL: params.callbackURL,
      amount: params.amount.toString(),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: params.merchantInvoiceNumber,
    }),
  });

  if (!res.ok) throw new Error("Failed to create bKash payment.");
  return res.json();
}

export async function executeBkashPayment(paymentID: string): Promise<ExecutePaymentResponse> {
  const { id_token } = await grantBkashToken();

  const res = await fetch(`${BASE_URL}/tokenized/checkout/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: id_token,
      "X-APP-Key": requireEnv("BKASH_APP_KEY"),
    },
    body: JSON.stringify({ paymentID }),
  });

  if (!res.ok) throw new Error("Failed to execute bKash payment.");
  return res.json();
}
