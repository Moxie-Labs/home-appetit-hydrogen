export const PAGINATION_SIZE = 8;
export const DEFAULT_GRID_IMG_LOAD_EAGER_COUNT = 4;
export const ATTR_LOADING_EAGER = 'eager';

export function getImageLoadingPriority(
  index,
  maxEagerLoadCount = DEFAULT_GRID_IMG_LOAD_EAGER_COUNT,
) {
  return index < maxEagerLoadCount ? ATTR_LOADING_EAGER : undefined;
}

export const MAIN_ITEMS_STEP = 2;
export const SIDE_ITEMS_STEP = 3;
export const ADDON_ITEMS_STEP = 4;
export const TRADITIONAL_PLAN_NAME = 'classic';
export const FLEXIBLE_PLAN_NAME = 'flexible';

export const TOAST_CLEAR_TIME = 5000;
export const FREE_QUANTITY_LIMIT = 4;
export const FIRST_STEP = 1;
export const ADD_ON_STEP = 4;
// export const READY_FOR_PAYMENT_STEP = 5;
export const FIRST_PAYMENT_STEP = 6;
export const CONFIRMATION_STEP = 8;
export const FIRST_WINDOW_START = 8;
export const PLACEHOLDER_SALAD = `https://cdn.shopify.com/s/files/1/0624/5738/1080/products/mixed_greens.png?v=1646182911`;
export const READY_FOR_PAYMENT_STEP = 5;