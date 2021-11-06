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

### Auth

Install next-auth, bcryptjs. Create a helper function auth.js and db.js(optional).  
For API: api/auth/[.. .nextauth].js, insied shoudl be like that

```js
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { verifyPassword } from "../../../helper/auth";
import { connectToDatabase } from "../../../helper/db";

export default NextAuth({
  session: {
    jwt: true, // ONLY FOR JWT (SELF HOSTED DB)
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  providers: [
    Providers.Credentials({
      // CAN USE DISCORD LOGIN/GOOGLE LOGIN ETC
      async authorize(credentials) {
        const client = await connectToDatabase();
        const usersCollection = client.db().collection("users");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });
        if (!user) {
          client.close();
          throw new Error("User not found");
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          client.close();
          throw new Error("Invalid password");
        }
        client.close();
        return { email: user.email };
      },
    }),
  ],
});
```

To login/logout:

```js
import { useSession, signOut } from "next-auth/client";

// Sign in
if (isLogin) {
  const result = await signIn("credentials", {
    redirect: false, // by default nextJS will send to another error page
    email: enteredEmail,
    password: enteredPassword,
  });
}

// Sign out
signOut();
```

Next Auth will auto create and store cookie session using signIn function.

To use:

```js
import { useSession } from "next-auth/client";

const [session, loading] = useSession();

return (
  {!session && !loading && (
    <Link href="..."/>
  )}
)
```

```js
// Check Page Auth (Not so good)
import { getSession } from "next-auth/client";

const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  getSession().then((session) => {
    if (!session) {
      window.location.href = "/auth";
    } else {
      setIsLoading(false);
    }
  });
}, []);
```

Use getServerSideProps to PREVENT page flashing. Use this then no need useEffect above.

```js
import { getSession } from "next-auth/client";

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      },
    };
  }

  return {
    props: { session },
  };
}
```

However, if you don't want to refresh the page stats (example i am already logged in, previous one is no log in at all before)

```js
const router = useRouter();

router.replace("/profile");
```

Optimizing use Provider in \_app.js. Prevent double getting session cookie

```js
// Optimization: Must have getServerSideProps
import { Provider } from "next-auth/client";
function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
```

Protect API routes (Headers)

```js
import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../helper/db";
import { verifyPassword, hashPassword } from "../../../helper/password";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }
  // Check if auth user or not
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({
      message: "Auth Missing",
    });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");

  const user = await userCollection.findOne({
    email: userEmail,
  });

  if (!user) {
    res.status(404).json({
      message: "User No Found",
    });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordAreEqual) {
    res.status(403).json({
      message: "Wrong Auth (Invalid Password)",
    });
    client.close();
    return;
  }

  const newHashedPassword = await hashPassword(newPassword);

  const result = await userCollection.updateOne(
    { email: userEmail },
    { $set: { password: newHashedPassword } }
  );

  client.close();
  res.status(200).json({
    message: "Password Updated",
  });
}
```

NEXTAUTH_URL environment not set, deploy in production. 