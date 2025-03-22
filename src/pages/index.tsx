import Translator from '@/components/Translator';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Multi-lang Translator</title>
        <meta name="description" content="Multi-language Translator Assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Translator />
      </main>
    </>
  );
}
