import { Metadata } from "next";
import MainPage from "@/components/MainPage";
import { auth } from "@/app/auth";
import SignInButton from "@/components/SignInButton";

export const metadata: Metadata = {
  title: 'Habit Wars',
}


export default async function Home() {
  const session = await auth()
  // console.log(process.env.GOOGLE_CLIENT_ID);
  if (!session) {
    return (
      <div className="min-h-screen p-8">
        <main className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Welcome to Habit Wars</h1>
            <SignInButton />
          </div>
        </main>
      </div>
    )
  }
  console.log(session);
  return <MainPage />
}
