import QRCode from "qrcode";

export async function generateQR(text: string) {
  try {
    const qr = await QRCode.toDataURL(text);
    return qr;
  } catch (err) {
    console.error("QR Error:", err);
    return null;
  }
}