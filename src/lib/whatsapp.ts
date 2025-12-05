import type { OrderItem, PaymentMethod } from "./firestore";
import { PAYMENT_METHODS } from "../types";

/**
 * Generate a WhatsApp message from order data
 * @param items - Array of order items
 * @param totalAmount - Total order amount
 * @param customerPhone - Customer phone number
 * @param deliveryAddress - Delivery address
 * @param orderId - Order ID from Firebase
 * @param paymentMethod - Payment method for the order
 * @returns Formatted message string for WhatsApp
 */
export function generateOrderMessage(
  items: OrderItem[],
  totalAmount: number,
  customerPhone: string,
  deliveryAddress: string,
  orderId: string,
  paymentMethod: PaymentMethod = "cod"
): string {
  const itemsList = items
    .map(
      (item) =>
        `• *${item.name}*\n  الكمية: ${item.quantity}\n  السعر: ${
          item.price * item.quantity
        } ج.م`
    )
    .join("\n\n");

  const paymentLabel = PAYMENT_METHODS[paymentMethod]?.label || "الدفع عند الاستلام";
  const paymentEmoji = PAYMENT_METHODS[paymentMethod]?.emoji || "🚚";

  const message = `
🛍️ *طلب جديد من OZERA*

📄 *تفاصيل الطلب*
رقم الطلب: *${orderId.slice(0, 8).toUpperCase()}*

👤 *بيانات العميل*
• رقم الهاتف: ${customerPhone}
• العنوان: ${deliveryAddress}

📦 *المنتجات المطلوبة*
${itemsList}

💰 *الإجمالي:* *${totalAmount} ج.م*

${paymentEmoji} *طريقة الدفع:* ${paymentLabel}

━━━━━━━━━━━━━
تم استلام الطلب عبر *تطبيق OZERA*
نشكر ثقتك بنا ✨
  `.trim();

  return message;
}

/**
 * Redirect to WhatsApp with order message
 * @param message - Message to send
 * @param adminPhoneNumber - Admin phone number to send message to (format: 20XXXXXXXXXX)
 */
export function redirectToWhatsApp(
  message: string,
  adminPhoneNumber: string = "209546481125"
): void {
  // Ensure phone number format (remove + if present, keep only digits)
  const formattedPhone = adminPhoneNumber.replace(/\D/g, "");

  // WhatsApp Web API link
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    message
  )}`;

  // Detect if running on iOS Safari
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari =
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const isIOSSafari = isIOS && isSafari;

  // Use location.href for iOS Safari (more reliable), window.open for others
  if (isIOSSafari) {
    // For iOS Safari, use location.href which is more reliable
    window.location.href = whatsappUrl;
  } else {
    // For other browsers, use window.open with a small delay to ensure execution
    setTimeout(() => {
      const newWindow = window.open(whatsappUrl, "_blank");
      // Fallback in case window.open is blocked
      if (!newWindow) {
        window.location.href = whatsappUrl;
      }
    }, 0);
  }
}

/**
 * Combined function to generate message and redirect to WhatsApp
 */
export function sendOrderToWhatsApp(
  items: OrderItem[],
  totalAmount: number,
  customerPhone: string,
  deliveryAddress: string,
  orderId: string,
  paymentMethod: PaymentMethod = "cod",
  adminPhoneNumber: string = "201271772724"
): void {
  const message = generateOrderMessage(
    items,
    totalAmount,
    customerPhone,
    deliveryAddress,
    orderId,
    paymentMethod
  );
  redirectToWhatsApp(message, adminPhoneNumber);
}
