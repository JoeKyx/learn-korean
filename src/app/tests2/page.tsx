import { getTests2 } from "@/lib/api/tests2/queries";

import TestsList from "@/components/tests2/TestsList";
import NewTestsModal from "@/components/tests2/TestsModal";

export default async function Tests2() {
  const { tests2 } = await getTests2();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Tests2</h1>
        <NewTestsModal />
      </div>
      <TestsList tests2={tests2} />
    </main>
  );
}
