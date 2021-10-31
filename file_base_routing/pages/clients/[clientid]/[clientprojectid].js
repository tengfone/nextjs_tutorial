import React from "react";
import { useRouter } from "next/router";

export default function SelectedClientProjectPage() {
  const router = useRouter();
  console.log(router);
  return (
    <div>
      <h1>
        Project page for a specific project({router.query.clientprojectid}) for
        a specific client ({router.query.clientid})
      </h1>
    </div>
  );
}
