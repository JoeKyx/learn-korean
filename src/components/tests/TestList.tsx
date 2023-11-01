'use client';
import { CompleteTest } from '@/lib/db/schema/tests';
import { trpc } from '@/lib/trpc/client';

import TestModal from './TestModal';

export default function TestList({ tests }: { tests: CompleteTest[] }) {
  const { data: t } = trpc.tests.getTests.useQuery(undefined, {
    initialData: { tests },
    refetchOnMount: false,
  });

  if (t.tests.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {t.tests.map((test) => (
        <Test test={test} key={test.id} />
      ))}
    </ul>
  );
}

const Test = ({ test }: { test: CompleteTest }) => {
  return (
    <li className='flex justify-between my-2'>
      <div className='w-full'>
        <div>{test.test}</div>
      </div>
      <TestModal test={test} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className='text-center'>
      <h3 className='mt-2 text-sm font-semibold text-gray-900'>No tests</h3>
      <p className='mt-1 text-sm text-gray-500'>
        Get started by creating a new test.
      </p>
      <div className='mt-6'>
        <TestModal emptyState={true} />
      </div>
    </div>
  );
};
