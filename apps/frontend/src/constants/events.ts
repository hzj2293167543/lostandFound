export const EVENT = {
  APP_ERROR_TOAST: 'APP_ERROR_TOAST',
};
export type Event = (typeof EVENT)[keyof typeof EVENT];
