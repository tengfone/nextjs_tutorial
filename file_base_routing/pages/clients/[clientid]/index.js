import React from "react";
import { useRouter } from "next/router";

export default function ClientProjectsPage() {
  const router = useRouter();

  function loadProjectHandler() {
    router.push({
      pathname: "/clients/[clientid]/[clientprojectid]",
      query: {
        clientid: router.query.clientid,
        clientprojectid: 123,
      },
    });
  }

  console.log(router);
  return (
    <div>
      <h1>The Projects of a given client: {router.query.clientid}</h1>
      <button onClick={loadProjectHandler}>Load Project</button>
    </div>
  );
}
