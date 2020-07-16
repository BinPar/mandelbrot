import React, { useRef, useEffect, useState } from 'react';

export type ColorFn = (x: number, y: number) => Color;

type VoidFunction = () => void | null;

const pixelation = 1;
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

const drawPixel = (
  imageData: ImageData,
  axis: Axis,
  r: number,
  g: number,
  b: number,
): void => {
  const index = (axis.x + axis.y * imageData.width) * 4;
  const { data } = imageData;
  data[index + 0] = r;
  data[index + 1] = g;
  data[index + 2] = b;
  data[index + 3] = 255;
};

const Canvas = ({ onDraw, initialZoom }: CanvasProps): JSX.Element => {
  const canvas = useRef<HTMLCanvasElement>();
  const [center, setCenter] = useState<Axis>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(initialZoom / pixelation);
  const [imageData, setImageData] = useState<ImageData>();
  const [context, setContext] = useState<CanvasRenderingContext2D>();

  useEffect((): VoidFunction => {
    if (canvas.current) {
      const onMouseMove = (event: MouseEvent): void => {
        if (event.buttons === 1) {
          setCenter((current) => ({
            x: current.x + event.movementX / pixelation,
            y: current.y + event.movementY / pixelation,
          }));
        }
      };
      const onWheel = (event: WheelEvent): void => {
        setZoom((current) => {
          const delta = current * (event.deltaY / zoomSpeed);
          setCenter((currentPos) => {
            const x = currentPos.x - event.clientX / pixelation;
            const dx = (x * (current + delta)) / current - x;
            const y = currentPos.y - event.clientY / pixelation;
            const dy = (y * (current + delta)) / current - y;
            return {
              x: currentPos.x + dx,
              y: currentPos.y + dy,
            };
          });
          return Math.abs(current + delta);
        });
      };
      const ctx = canvas.current.getContext('2d');
      const onWindowResize = (): void => {
        const currentCanvas = canvas.current;
        currentCanvas.width = currentCanvas.clientWidth / pixelation;
        currentCanvas.height = currentCanvas.clientHeight / pixelation;
        setImageData(
          ctx.getImageData(0, 0, currentCanvas.width, currentCanvas.height),
        );
      };
      onWindowResize();
      const { width, height } = canvas.current;
      setCenter({ x: width / 2, y: height / 2 });
      setZoom(zoom);
      setContext(ctx);
      window.addEventListener('resize', onWindowResize);
      canvas.current.addEventListener('mousemove', onMouseMove);
      canvas.current.addEventListener('wheel', onWheel);
      return (): void => {
        window.removeEventListener('resize', onWindowResize);
        canvas.current.removeEventListener('mousemove', onMouseMove);
        canvas.current.removeEventListener('wheel', onWheel);
      };
    }
    return null;
  }, [canvas.current]);

  useEffect((): void => {
    if (imageData) {
      for (let x = 0; x < imageData.width; x++) {
        for (let y = 0; y < imageData.height; y++) {
          const pontToDraw = {
            x: (x - center.x) / zoom,
            y: (y - center.y) / zoom,
          };
          const color = onDraw(pontToDraw.x, pontToDraw.y);
          drawPixel(imageData, { x, y }, color.r, color.g, color.b);
        }
      }
      context.putImageData(imageData, 0, 0);
    }
  }, [zoom, center, imageData]);

  return <canvas ref={canvas} className="fullCanvas" />;
};

export default Canvas;
