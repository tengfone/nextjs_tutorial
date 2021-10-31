// catch-all routes
// eg /blog/2021 or /blog/2021/393-3333 or /blog/393-3333
import React from "react";
import { useRouter } from "next/router";

export default function BlogPostsPage() {
  const router = useRouter();
  console.log(router.query);
  return (
    <div>
      <h1>The Blog Posts</h1>
    </div>
  );
}
