import React from "react";
import Link from "next/link";
import classes from "./button.module.css";

export default function Button(props) {
  if (props.link) {
    return (
      <Link href={props.link}>
        <a className={classes.button}>{props.children}</a>
      </Link>
    );
  }
  return (
    <button className={classes.button} onClick={props.onClick}>
      {props.children}
    </button>
  );
}
