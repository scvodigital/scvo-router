declare module 'json-logic-js' {
  export function apply(rules: any, data: any): any;
  export function add_operation(name: string, operation: (...args: any[]) => any): void;
}
