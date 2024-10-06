export type FibonacciParams = { limit: string; };
export type FibonacciServiceFn = (count: number) => string[];
export type StatusCodeParams = { code: string; };
export type DelayParams = { ms: string; };
export type DelayServiceFn = (delay: number) => Promise<void>;
export type ReverseStringBody = { input: string; };
export type ReverseStringServiceFn = (inputStr: string) => string;