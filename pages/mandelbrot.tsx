import React, { useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default (): JSX.Element => {
  const canvas = useRef<HTMLCanvasElement>();

  useEffect((): void => {
    if (canvas.current) {
      const ctx = canvas.current.getContext('2d');
      canvas.current.width = canvas.current.clientWidth;
      canvas.current.height = canvas.current.clientHeight;
      const { width, height } = canvas.current;
      const imageData = ctx.getImageData(0, 0, width, height);
      const drawPixel = (x, y, r, g, b): void => {
        const index = (x + y * width) * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
      };
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < width; y++) {
          const light = (x % 50 === 0 || y % 50 === 0) ? 255: 0;
          drawPixel(x, y, light, light, light);
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
  });
  return (
    <React.Fragment>
      <Head>
        <title>BinPar: Standard JS Mandelbrot</title>
        <link rel="stylesheet" type="text/css" href="/styles.css" />
      </Head>
      <canvas ref={canvas} className="fullCanvas" />
      <Link href="/">
        <a className="back">← Back</a>
      </Link>
    </React.Fragment>
  );
};
