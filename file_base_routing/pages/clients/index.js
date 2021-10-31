import React from "react";
import Link from "next/link";

export default function ClientsPage() {
  const clients = [
    {
      id: "teng",
      name: "TengFone",
    },
    {
      id: "samsung",
      name: "Samsung",
    },
  ];

  return (
    <div>
      <h1>Client Page</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <Link
              href={{
                pathname: "/clients/[id]",
                query: { id: client.id },
              }}
            >
              {client.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
