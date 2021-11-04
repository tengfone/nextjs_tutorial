import React, { useEffect, useState } from "react";
import useSWR from "swr";

export default function LastSalesPage(props) {
  const [sales, setSales] = useState(props.sales);
  const [isLoading, setIsLoading] = useState(false);

  const { data, error } = useSWR("/api/sales", {});

  useEffect(() => {
    if (data) {
      // Transform
      const transformedSales = [];
      for (let i = 0; i < data.length; i++) {
        transformedSales.push({
          id: data[key].id,
          username: data[key].username,
          volume: data[key].volume,
        });
      }
      setSales(transformedSales);
    }
  }, [data]);

  if (error) {
    return <p>Failed</p>;
  }

  if (!data) {
    return <p>Loading</p>;
  }

  //   useEffect(() => {
  //     setIsLoading(true);
  //     fetch("http://localhost:3000/sales")
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const transformedSales = [];
  //         for (let i = 0; i < data.length; i++) {
  //           transformedSales.push({
  //             id: data[key].id,
  //             username: data[key].username,
  //             volume: data[key].volume,
  //           });
  //         }
  //         console.log(data);
  //         setSales(data);
  //         setIsLoading(false);
  //       });
  //   }, []);

  //   if (isLoading) {
  //     return <h1>Loading...</h1>;
  //   }

  //   if (!sales.length) {
  //     return <h1>No sales yet!</h1>;
  //   }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sales.id}>
          {sale.username} - ${sale.volume}
        </li>
      ))}{" "}
    </ul>
  );
}

export async function getStaticProps() {
  const res = await fetch("http://localhost:3000/sales");
  const data = await res.json();
  const transformedSales = [];
  for (let i = 0; i < data.length; i++) {
    transformedSales.push({
      id: data[key].id,
      username: data[key].username,
      volume: data[key].volume,
    });
  }
  return {
    props: {
      sales: transformedSales,
    },
    revalidate: 10,
  };
}
