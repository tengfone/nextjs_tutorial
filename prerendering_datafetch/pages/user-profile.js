import React from "react";

export default function UserProfilePage(props) {
  return <h1>{props.username}</h1>;
}

// Executed on server, not statically rendered
export async function getServerSideProps(context) {
  // Can send back data to server
  const { params, req, res } = context;
  return {
    props: {
      username: "Teng",
    },
  };
}
