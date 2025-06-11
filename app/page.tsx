import { Metadata } from "next";
import MainPage from "@/components/MainPage";

export const metadata: Metadata = {
  title: 'Habit Wars',
}


export default async function Home() {
  return <MainPage />
}
