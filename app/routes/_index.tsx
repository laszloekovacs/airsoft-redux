import { env } from "~/services/env.server"
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/_index";


export function action() {
  if (env.NODE_ENV == "production") {
    console.log("production environment")
  }

}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Welcome />
}
