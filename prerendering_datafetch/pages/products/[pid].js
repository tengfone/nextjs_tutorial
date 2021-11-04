import React, { Fragment } from "react";
import fs from "fs/promises";
import path from "path";

export default function ProductIDPage(props) {
  const { loadedProduct } = props;

  if (!loadedProduct) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <h1>Product ID Page</h1>
      <h2>{loadedProduct.title}</h2>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

// Static Generation
export async function getStaticProps(context) {
  const { params } = context;

  // Use this instead of useRouter to get the params FOR pre rendering.
  const productId = params.pid;
  const data = await getData();
  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

// Static Generation
export async function getStaticPaths() {
  const data = await getData();

  const ids = data.products.map((product) => product.id);
  const params = ids.map((id) => ({
    params: {
      pid: id,
    },
  }));

  return {
    paths: params,
    fallback: true, // tells nextJs that there are pages that are not generated YET, putting the path just
    // shows that the page is pre generated. to use fallback true MUST need a fallback fn above if not will error
    // OR you can just use fallback: 'blocking'. then itll just load and wait for the page to be generated.
  };
}
