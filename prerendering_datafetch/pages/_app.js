import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Testing App</title>
        <meta name="description" context="Testing app" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
