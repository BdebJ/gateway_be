import { FibonacciServiceFn, ReverseStringServiceFn } from "../types/testTypes";

export const fibonacciService: FibonacciServiceFn = (count: number): string[] => {
  const fib = ['0', '1'];
  for (let i = 2; i <= count; i++) {
    fib[i] = String(Number(fib[i - 1]) + Number(fib[i - 2]));
  }
  return fib;
};

export const reverseStringService: ReverseStringServiceFn = (inputStr: string): string => {
  return inputStr.split('').reverse().join('');
};