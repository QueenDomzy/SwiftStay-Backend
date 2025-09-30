import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!, // e.g., "us21"
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await mailchimp.messages.send({
      message: {
        from_email: "no-reply@swiftstay.com",
        subject,
        html,
        to: [{ email: to, type: "to" }],
      },
    });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}