export type FibonacciParams = { limit: string; };
export type FibonacciServiceFn = (count: number) => string[];
export type ReverseStringBody = { input: string; };
export type ReverseStringServiceFn = (inputStr: string) => string;