
import Image from "next/image";

import { getUserAuth } from "@/lib/auth/utils";

import ButtonLink from "@/components/links/ButtonLink";

export default async function Home() {
  const userAuth = await getUserAuth();
  return (
    <main >
      <div className="flex w-full items-center justify-center h-screen gap-4">
        <Image src="/images/logo.png" alt="logo" width={250} height={250} />
        {/* Create a vertical divider line */}
        <div className="border-l-2 border-l-black h-52" />
        <div className="flex flex-col gap-4">

          <h1 className="text-4xl font-bold">안녕하세요</h1>

          <div className="flex flex-col items-center w-full">
            <ButtonLink href="/dashboard" className="w-full" variant="primary">
              {userAuth ? (
                <span>Go to Dashboard</span>
              ) : (
                <span>Sign In</span>
              )}
            </ButtonLink>


            <span>or</span>
            <ButtonLink href="/dashboard" className="w-full" variant="light">
              Learn More
            </ButtonLink>
          </div>
        </div>


      </div>
    </main>
  );
}
