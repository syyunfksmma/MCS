export type FeatureFlag = 'feature.search-routing' | 'feature.hover-quick-menu';

const flagState: Record<FeatureFlag, boolean> = {
  'feature.search-routing': true,
  'feature.hover-quick-menu': false
};

export function isFeatureEnabled(flag: FeatureFlag) {
  return flagState[flag];
}

export function setFeatureFlag(flag: FeatureFlag, enabled: boolean) {
  flagState[flag] = enabled;
}
