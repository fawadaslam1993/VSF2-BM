/**
 * Errors that occurred in the `useFawad` composable
 */
export interface UseFawadErrors {
  fawadCustomApiMethod: Error | null;
}

export interface UseFawadInterface {
  fawadCustomApiMethod(): Promise<number | null>;
}
