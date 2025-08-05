declare module "vite-plugin-crx" {
  interface CrxOptions {
    manifest: any;
    [key: string]: any;
  }

  export function crx(options: CrxOptions): any;
}
