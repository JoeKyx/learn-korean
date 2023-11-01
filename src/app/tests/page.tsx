import { getTests } from "@/lib/api/tests/queries";

import TestList from "@/components/tests/TestList";
import NewTestModal from "@/components/tests/TestModal";

export default async function Tests() {
  const { tests } = await getTests();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Tests</h1>
        <NewTestModal />
      </div>
      <TestList tests={tests} />
    </main>
  );
}
