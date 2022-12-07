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