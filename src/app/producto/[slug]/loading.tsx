export default function FeaturedProductLoading() {
  return (
    <main className="product-loading" aria-live="polite" aria-busy="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/burning-star-emblem.svg" alt="" aria-hidden="true" />
      <span>BS:// LOADING PRODUCT FILE</span>
      <i aria-hidden="true" />
    </main>
  );
}
