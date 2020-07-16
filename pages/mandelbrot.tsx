import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Canvas, { ColorFn } from '../components/Canvas';

const getLight = (x: number, y: number): number => {
  const dist = x ** 2 + y ** 2;
  return Math.cos(dist / 100);
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
      <Canvas onDraw={axis} initialZoom={10} />
      <Link href="/">
        <a className="back">← Back</a>
      </Link>
    </React.Fragment>
  );
};
