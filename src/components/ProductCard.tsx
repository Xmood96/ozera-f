import { useState, useEffect } from "react";
import type { Product, CartItem } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onRemoveFromCart?: (productId: string) => void;
  cartItems?: CartItem[];
}

export default function ProductCard({
  product,
  onAddToCart,
  onRemoveFromCart,
  cartItems = [],
}: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  // Get the current cart item if it exists
  const cartItem = cartItems.find((item) => item.productId === product.id);
  const isInCart = !!cartItem;

  // Update quantity when expansion state or cart item changes
  useEffect(() => {
    if (isExpanded) {
      const targetQuantity = cartItem ? cartItem.quantity : 1;
      // Use setTimeout to avoid calling setState synchronously during render
      setTimeout(() => {
        setQuantity(targetQuantity);
      }, 0);
    }
  }, [isExpanded, cartItem]);

  const handleAddToCart = () => {
    if (isInCart && cartItem) {
      // If item is already in cart, only add the difference
      const quantityToAdd = quantity - cartItem.quantity;
      if (quantityToAdd !== 0) {
        onAddToCart(product, quantityToAdd);
      }
    } else {
      // If new item, add the full quantity
      onAddToCart(product, quantity);
    }
    setQuantity(1);
    setIsExpanded(false);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const benefitsToShow = showAllBenefits
    ? product.benefits || []
    : (product.benefits || []).slice(0, 3);

  const ingredientsToShow = showAllIngredients
    ? product.ingredients || []
    : (product.ingredients || []).slice(0, 3);

  return (
    <>
      {/* Overlay for expanded state */}
      {isExpanded && (
        <div
          className="fixed  inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        className={`product-card bg-base-100 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border border-base-200 hover:border-primary/20 ${
          isExpanded
            ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto"
            : "relative group"
        }`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {/* Product Image */}
        <div
          className={`product-image relative overflow-hidden ${
            isExpanded ? "h-80" : "h-64"
          } bg-gradient-to-br from-base-200 to-base-300`}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isExpanded ? "scale-110" : "group-hover:scale-105"
            }`}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
                setQuantity(1);
              }}
              className="absolute top-4 right-4 btn btn-circle btn-sm bg-white/90 hover:bg-white text-base-content shadow-lg backdrop-blur-sm border-0"
              aria-label="إغلاق"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Product Content */}
        <div
          className={`product-content transition-all duration-300 ${
            isExpanded ? "p-8" : "p-6"
          }`}
        >
          {/* Product Name */}
          <h3
            className={`product-name font-bold text-base-content mb-3 transition-all duration-300 ${
              isExpanded ? "text-3xl" : "text-xl"
            }`}
          >
            {product.name}
          </h3>

          {/* Product Description */}
          <p
            className={`product-description text-base-content/80 mb-6 transition-all duration-300 leading-relaxed ${
              isExpanded ? "text-base" : "text-sm line-clamp-2"
            }`}
          >
            {product.description}
          </p>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="expanded-content space-y-6 animate-fadeIn">
              {/* Benefits Section */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="benefits-section">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                      <span className="text-success">✨</span>
                    </div>
                    <h4 className="text-lg font-semibold text-base-content">
                      الفوائد
                    </h4>
                  </div>
                  <div className="grid gap-2">
                    {benefitsToShow.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-success/5 rounded-xl"
                      >
                        <span className="text-success/60 mt-1">•</span>
                        <span className="text-sm text-base-content/90">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                  {product.benefits.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllBenefits(!showAllBenefits);
                      }}
                      className="btn btn-ghost btn-sm text-success hover:bg-success/10 mt-3"
                    >
                      {showAllBenefits
                        ? "عرض أقل"
                        : `عرض ${product.benefits.length - 3} فوائد أخرى`}
                    </button>
                  )}
                </div>
              )}

              {/* Usage Instructions Section */}
              {product.usageInstructions && (
                <div className="usage-section">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-info/10 rounded-full flex items-center justify-center">
                      <span className="text-info">📋</span>
                    </div>
                    <h4 className="text-lg font-semibold text-base-content">
                      طريقة الاستخدام
                    </h4>
                  </div>
                  <div className="p-4 bg-info/5 rounded-xl">
                    <p className="text-sm text-base-content/90 leading-relaxed whitespace-pre-line">
                      {product.usageInstructions}
                    </p>
                  </div>
                </div>
              )}

              {/* Ingredients Section */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="ingredients-section">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                      <span className="text-warning">🌿</span>
                    </div>
                    <h4 className="text-lg font-semibold text-base-content">
                      المكونات
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ingredientsToShow.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-warning/10 text-warning/80 text-sm rounded-full border border-warning/20"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                  {product.ingredients.length > 3 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllIngredients(!showAllIngredients);
                      }}
                      className="btn btn-ghost btn-sm text-warning hover:bg-warning/10 mt-3"
                    >
                      {showAllIngredients
                        ? "عرض أقل"
                        : `عرض ${product.ingredients.length - 3} مكونات أخرى`}
                    </button>
                  )}
                </div>
              )}

              {/* Quantity Section */}
              <div className="quantity-section">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary">📦</span>
                  </div>
                  <h4 className="text-lg font-semibold text-base-content">
                    الكمية
                  </h4>
                </div>
                <div className="quantity-counter flex items-center gap-4 bg-base-100 rounded-2xl p-4 border border-base-200 w-fit">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      decrementQuantity();
                    }}
                    className="btn btn-circle btn-sm bg-base-200 hover:bg-base-300 text-base-content border-0 shadow-sm"
                    aria-label="تقليل الكمية"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="text-2xl font-bold text-primary w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      incrementQuantity();
                    }}
                    className="btn btn-circle btn-sm bg-primary hover:bg-primary/90 text-primary-content border-0 shadow-sm"
                    aria-label="زيادة الكمية"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Footer */}
          <div
            className={`product-footer flex justify-between items-center gap-4 ${
              isExpanded ? "mt-8 pt-6" : "mt-6 pt-4"
            } border-t border-base-200`}
          >
            {/* Price Section */}
            <div className="product-price-section flex-1 flex flex-col">
              {product.discount && product.discount > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg line-through text-base-content/50 font-medium">
                      {product.basePrice} ج.م
                    </span>
                    <span className="badge badge-error text-white font-bold px-2 py-1 text-xs">
                      -{product.discount}%
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-success">
                    {product.price} ج.م
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {product.price} ج.م
                </span>
              )}
            </div>

            {/* Action Buttons */}
            {isExpanded ? (
              <div className="expanded-actions flex items-center gap-3">
                {isInCart && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromCart?.(product.id);
                      setIsExpanded(false);
                      setQuantity(1);
                    }}
                    className="btn btn-circle btn-sm bg-error/10 hover:bg-error/20 text-error border-0"
                    title="إزالة من السلة"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  className="btn-add-to-cart text-sm btn btn-primary px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold text-white border-0 shadow-primary/25"
                  aria-label={
                    isInCart
                      ? `تحديث ${product.name}`
                      : `إضافة ${product.name} إلى السلة`
                  }
                >
                  <span className="flex items-center gap-2">
                    {isInCart ? "تحديث" : "إضافة"}
                    <span className="badge badge-primary-content bg-primary text-white px-2 py-1 rounded-full text-xl">
                      ×{quantity}
                    </span>
                  </span>
                </button>
              </div>
            ) : isInCart ? (
              <div className="in-cart-badge flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-2xl font-semibold">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                <span>في السلة ({cartItem.quantity})</span>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
                className="btn-add-to-cart btn btn-primary btn-sm rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold border-0 shadow-primary/25"
                aria-label={`عرض تفاصيل ${product.name}`}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  إضافة
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
