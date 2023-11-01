import TestingModelList from "@/components/testingModels/TestingModelList";
import NewTestingModelModal from "@/components/testingModels/TestingModelModal";
import { getTestingModels } from "@/lib/api/testingModels/queries";

export default async function TestingModels() {
  const { testingModels } = await getTestingModels();  

  return (
    <main className="max-w-3xl mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Testing Models</h1>
        <NewTestingModelModal />
      </div>
      <TestingModelList testingModels={testingModels} />
    </main>
  );
}
