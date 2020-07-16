import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import InfiniteCanvas, { ColorFn } from '../components/InfiniteCanvas';

const maxIterations = 200;

const getLight = (x: number, y: number): number => {
  let natural = x;
  let imaginary = y;
  let n = 0;
  while (n < maxIterations) {
    const newImaginary = 2 * natural * imaginary + y;
    natural = natural ** 2 - imaginary ** 2 + x;
    imaginary = newImaginary;
    if (natural * natural + imaginary * imaginary > 16) {
      return n;
    }
    n++;
  }
  return 0;
};

const axis: ColorFn = (x, y) => {
  const light = (getLight(x, y) * 20) % 255;
  return {
    r: light,
    g: light,
    b: Math.sqrt(light * 200),
  };
};

export default (): JSX.Element => {
  return (
    <React.Fragment>
      <Head>
        <title>BinPar: Standard JS Mandelbrot</title>
        <link rel="stylesheet" type="text/css" href="/styles.css" />
      </Head>
      <InfiniteCanvas onDraw={axis} initialZoom={200} />
      <Link href="/">
        <a className="back">← Back</a>
      </Link>
    </React.Fragment>
  );
};
