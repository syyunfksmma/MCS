export type FeatureFlag = 'feature.search-routing';

const flagState: Record<FeatureFlag, boolean> = {
  'feature.search-routing': true
};

export function isFeatureEnabled(flag: FeatureFlag) {
  return flagState[flag];
}

export function setFeatureFlag(flag: FeatureFlag, enabled: boolean) {
  flagState[flag] = enabled;
}
