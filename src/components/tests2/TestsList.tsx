"use client";
import { CompleteTests } from "@/lib/db/schema/tests2";
import { trpc } from "@/lib/trpc/client";
import TestsModal from "./TestsModal";


export default function TestsList({ tests2 }: { tests2: CompleteTests[] }) {
  const { data: t } = trpc.tests2.getTests2.useQuery(undefined, {
    initialData: { tests2 },
    refetchOnMount: false,
  });

  if (t.tests2.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {t.tests2.map((tests) => (
        <Tests tests={tests} key={tests.id} />
      ))}
    </ul>
  );
}

const Tests = ({ tests }: { tests: CompleteTests }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{tests.date.toString()}</div>
      </div>
      <TestsModal tests={tests} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No tests2</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new tests.
      </p>
      <div className="mt-6">
        <TestsModal emptyState={true} />
      </div>
    </div>
  );
};

