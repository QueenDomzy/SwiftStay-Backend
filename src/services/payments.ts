import Paystack from "paystack-api";
import Flutterwave from "flutterwave-node-v3";

const paystack = Paystack(process.env.PAYSTACK_SECRET!);
const flw = new Flutterwave(process.env.FLW_PUBLIC!, process.env.FLW_SECRET!);

export async function payWithPaystack(email: string, amount: number) {
  const response = await paystack.transaction.initialize({
    email,
    amount: amount * 100, // kobo
  });
  return response.data;
}

export async function payWithFlutterwave(amount: number, email: string, tx_ref: string) {
  const response = await flw.Payment.initialize({
    tx_ref,
    amount,
    currency: "NGN",
    redirect_url: "https://swiftstay.ng/payment/callback",
    customer: { email },
    payment_options: "card, banktransfer, ussd",
  });
  return response;
}