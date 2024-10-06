import { DelayServiceFn, FibonacciServiceFn, ReverseStringServiceFn } from '../types/standardTypes';

export const fibonacciService: FibonacciServiceFn = (count) => {
  const fib: string[] = ['0', '1'];
  for (let i = 2; i <= count; i++) {
    fib[i] = String(Number(fib[i - 1]) + Number(fib[i - 2]));
  }
  return fib;
};

export const delayService: DelayServiceFn = (delay) => {
  return new Promise((res) => setTimeout(res, delay));
};

export const reverseStringService: ReverseStringServiceFn = (inputStr) => {
  return inputStr.split('').reverse().join('');
};