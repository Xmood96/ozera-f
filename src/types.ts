/* ========== الفئات ========== */
export interface Category {
    id: string;
  name: string;    // اسم الفئة
}

/* ========== المنتجات ========== */
export interface Product {
  id: string;
  name: string;        // اسم المنتج
  description: string; // وصف
  price: number;       // السعر الحالي (السعر بعد الخصم)
  basePrice?: number;  // السعر الأساسي قبل الخصم (اختياري)
  discount?: number;   // نسبة الخصم (0-100) - اختياري
  imageUrl: string;    // رابط الصورة
  categoryId: string;  // الفئة المرتبطة
  
  // حقول اختيارية جديدة
  benefits?: string[];        // الفوائد - قائمة من الفوائد
  usageInstructions?: string; // طريقة الاستخدام
  ingredients?: string[];     // المكونات - قائمة من المكونات
  
  createdAt?: number;  // تاريخ الإنشاء (اختياري)
  updatedAt?: number;  // تاريخ التحديث
}

/* ========== المستخدمين ========== */
export interface UserProfile {
  uid: string;         // ID المستخدم في Firebase Auth
  name: string;        // اسم المستخدم
  email: string;       // الإيميل
  photoUrl?: string;   // رابط الصورة (اختياري)
}

/* ========== عناصر العربة ========== */
export interface CartItem {
  productId: string;        // ID المنتج
  name: string;             // اسم المنتج
  price: number;            // سعر المنتج الحالي
  quantity: number;         // الكمية المختارة
  imageUrl: string;         // صورة المنتج
  total: number;            // السعر الإجمالي للمنتج = price * quantity
}

/* ========== العربة الكاملة ========== */
export interface Cart {
  userId: string;           // ID صاحب العربة
  items: CartItem[];        // جميع العناصر
  totalPrice: number;       // المجموع الكلي
  updatedAt: number;        // آخر تحديث
}

/* ========== طرق الدفع ========== */
export type PaymentMethod = "cod" | "instapay" | "wallet";

/* ========== تفاصيل طرق الدفع ========== */
export const PAYMENT_METHODS = {
  cod: {
    id: "cod",
    label: "الدفع عند الاستلام",
    emoji: "🚚",
    description: "ادفع عند استلام الطلب"
  },
  instapay: {
    id: "instapay",
    label: "الدفع إنستا باي",
    emoji: "💳",
    description: "ادفع عبر تطبيق إنستا باي"
  },
  wallet: {
    id: "wallet",
    label: "المحافظ الإلكترونية",
    emoji: "📱",
    description: "ادفع عبر المحافظ الإلكترونية"
  }
} as const;
