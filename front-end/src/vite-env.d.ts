/// <reference types="vite/client" />
declare module "*.svg?react" {
  import * as React from "react";
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "*.png" {
  const value: string;
  export default value;
}
