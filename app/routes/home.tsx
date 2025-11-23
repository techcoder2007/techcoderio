import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TechCoder.io" },
    { name: "description", content: "Portfolio of TechCoder.io" },
  ];
}

export default function Home() {
  return <Welcome />;
}
