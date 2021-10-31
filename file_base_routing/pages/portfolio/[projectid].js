import React from "react";
import { useRouter, withRouter } from "next/router";

export default function ProjectIDPage() {
  const router = useRouter();

  return (
    <div>
      <h1>Project ID {router.query.projectid}</h1>
    </div>
  );
}
