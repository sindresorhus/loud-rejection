/**
Make unhandled promise rejections fail loudly instead of the default [silent fail](https://gist.github.com/benjamingr/0237932cee84712951a2).

@param log - Custom logging function to print the rejected promise. Receives the error stack. Default: `console.error`.
*/
export default function loudRejection(log?: (stack: string) => void): void;
