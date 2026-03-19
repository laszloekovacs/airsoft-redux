import { logger } from "~/services/pino.server";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/_index";


export function action() {
  logger.info("hello world")

}

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Welcome />
}
