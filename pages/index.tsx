import type { NextPage } from "next";
import Head from "next/head";
import Scene from "../components/Scene";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Canoo Lifestyle Vehicle rendered using react-three-fiber</title>
        <meta
          prefix="og: http://ogp.me/ns#"
          property="og:title"
          content="Canoo Lifestyle Vehicle rendered using react-three-fiber"
        />
        <meta
          prefix="og: http://ogp.me/ns#"
          property="og:image"
          content="https://canoo-explorer-omega.vercel.app/meta-image.jpg"
        />
        <meta
          prefix="og: http://ogp.me/ns#"
          property="og:url"
          content="https://canoo-explorer-omega.vercel.app/"
        />
      </Head>
      <Scene />
    </>
  );
};

export default Home;
