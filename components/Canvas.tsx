import React, { useRef, useEffect, useState } from 'react';

export type ColorFn = (x: number, y: number) => Color;

type VoidFunction = () => void | null;

const pixelation = 2;
const zoomSpeed = 200;

interface Color {
  r: number;
  g: number;
  b: number;
}

interface Axis {
  x: number;
  y: number;
}

interface CanvasProps {
  onDraw: ColorFn;
  initialZoom: number;
}
const Canvas = ({ onDraw, initialZoom }: CanvasProps): JSX.Element => {
  const canvas = useRef<HTMLCanvasElement>();
  const [center, setCenter] = useState<Axis>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [imageData, setImageData] = useState<ImageData>();
  const [context, setContext] = useState<CanvasRenderingContext2D>();

  const onMouseMove = (event: MouseEvent): void => {
    if (event.buttons === 1) {
      setCenter((current) => ({
        x: current.x + event.movementX / pixelation,
        y: current.y + event.movementY / pixelation,
      }));
    }
  };

  const onWheel = (event: WheelEvent): void => {
    setZoom((current) => current + current * (event.deltaY / zoomSpeed));
  }

  useEffect((): VoidFunction => {
    if (canvas.current) {
      const ctx = canvas.current.getContext('2d');
      canvas.current.width = canvas.current.clientWidth / pixelation;
      canvas.current.height = canvas.current.clientHeight / pixelation;
      const { width, height } = canvas.current;
      setCenter({ x: width / 2, y: height / 2 });
      setZoom(zoom);
      setContext(ctx);
      setImageData(ctx.getImageData(0, 0, width, height));
      canvas.current.addEventListener('mousemove', onMouseMove);
      canvas.current.addEventListener('wheel', onWheel);
      return (): void => {
        canvas.current.removeEventListener('mousemove', onMouseMove);
        canvas.current.removeEventListener('wheel', onWheel);
      };
    }
    return null;
  }, [canvas.current]);

  useEffect((): void => {
    if (imageData) {
      const drawPixel = (axis: Axis, r: number, g: number, b: number): void => {
        const index = (axis.x + axis.y * imageData.width) * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
      };
      for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {
          const axis = {
            x: (x - center.x) / zoom,
            y: (y - center.y) / zoom,
          };
          const color = onDraw(axis.x, axis.y);
          drawPixel({ x, y }, color.r, color.g, color.b);
        }
      }
      context.putImageData(imageData, 0, 0);
    }
  }, [zoom, center, imageData]);
  return <canvas ref={canvas} className="fullCanvas" />;
};

export default Canvas;
