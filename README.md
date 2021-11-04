# NextJS Tutorial

From Maximilian Schwarzmüller Udemy Course

git rm -rf --cached myuntrackedfolder

git add myuntrackedfolder

### File Base Routing

Must know:

[...id ] just means multiple slugs
[id ] is a dynamic page
Page routing

Either Use Static Gen OR Server Render.

### Rendering

Static Generation

```js
async function getData() {
    // Notice How To Export 'file'
  const filePath = path.join(process.cwd(), "dataFolder", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}


export async function getStaticProps(context){
    // Use this instead of UseRouter to get Params for Pre Render
    const { params } = context;
    const productId = params.id
    const data = await getData()

    if (!data){
        return {
            notFound: true
        }
    }

    return {
        props:{
            ...
        }
    }
}

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
```

Server Side Rendering (Pre-render for every request)
No need any staticPaths.

```js
export default function UserIdPage(props) {
  return <h1>{props.id}</h1>;
}

export async function getServerSideProps(context) {
  const { params } = context;
  const userId = params.uid;

  return {
    props: {
      id: "userid-" + userId,
    },
  };
}
```

Client-side Data Fetching (Data doesnt need to be pre-rendered)
Data changing with high frequency (Stock data) / Highly user-specifc data (eg last data in online shop) / Partial data (dashboard).

Using useEffect is good. OR use next.js one which is called SWR. Stale-while-revalidate.

```js
const { data, error } = useSWR("URL", {});
```

Can mix pre-render and server side.

INSERT HEADER for Search Engine optimizer. Can dynamically add Header info.

```js
import Head from "next/head";

return (
  <Head>
    <title>Insert Stuff</title>
    <meta name="description" content="this is a ..." />
  </Head>
);
```

look at \_document.js for rewriting document level code.

Do not use .png / .jpg for production. Use the image compoenent

```js
import Image from "next/image";

<Image src={"..."} alt={"testing"} width={240} height={160} />;
```

### API

API Calls. Server side API

```js
export default function handler(req, rest) {
  if (req.method === "POST") {
    const email = req.body.email;
    const feedbackText = req.body.text;
    const newFeedback = {
      id: new Date().toISOString(),
      email: email,
      text: feedbackText,
    };
  }
}
```

```js
fetch("/api/feedback", {
  method: "POST",
  body: JSON.stringify({
    email: enteredEmail,
    text: enteredFeedback,
  }),
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```  

If doing getStaticProps() for API, use internal file system. Don't self call. API also follow folder structure 
with pages. Like /api/feedback/index.js