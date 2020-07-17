
export type ColorFn = (x: number, y: number) => Color;

export type VoidFunction = () => void | null;

export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface Axis {
  x: number;
  y: number;
}
