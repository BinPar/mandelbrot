import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import InfiniteCanvas, { ColorFn } from '../components/InfiniteCanvas';

const maxIterations = 100;

const getLight = (x: number, y: number): number => {
  let e = x;
  let i = y;
  let n = 0;

  while (n < maxIterations) {
    const aa = e ** 2 - i ** 2;
    const bb = 2 * e * i;
    e = aa + x;
    i = bb + y;
    if (e * e + i * i > 16) {
      return Math.sqrt(n / maxIterations);
    }
    n++;
  }
  return 0;
};

const axis: ColorFn = (x, y) => {
  const light = getLight(x, y);
  return {
    r: light * 255,
    g: light * 255,
    b: light * 128,
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
