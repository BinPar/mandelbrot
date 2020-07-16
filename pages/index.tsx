import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default (): JSX.Element => (
  <React.Fragment>
    <Head>
      <title>BinPar: Mandelbrot Performance Tests</title>
      <link rel="stylesheet" type="text/css" href="/styles.css" />
    </Head>
    <h1>BinPar Mandelbrot Performance Tests</h1>
    <ul>
      <li>
        <Link href="/mandelbrot">
          <a>Standard JS Mandelbrot</a>
        </Link>        
      </li>
    </ul>
  </React.Fragment>
);
