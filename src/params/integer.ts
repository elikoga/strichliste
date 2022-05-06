import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string) => {
  // check if param is a positive integer
  const num = parseInt(param, 10);
  if (Number.isNaN(num)) {
    return false;
  }
  return num > 0;
};
