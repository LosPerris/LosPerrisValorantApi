import type { DetailedHTMLProps, HTMLAttributes } from 'react';

interface IconifyProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  icon?: string;
  width?: string | number;
  height?: string | number;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': IconifyProps;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': IconifyProps;
    }
  }
}
