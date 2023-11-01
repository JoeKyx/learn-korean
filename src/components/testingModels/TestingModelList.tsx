'use client';
import { CompleteTestingModel } from '@/lib/db/schema/testingModels';
import { trpc } from '@/lib/trpc/client';

import TestingModelModal from './TestingModelModal';

export default function TestingModelList({
  testingModels,
}: {
  testingModels: CompleteTestingModel[];
}) {
  const { data: t } = trpc.testingModels.getTestingModels.useQuery(undefined, {
    initialData: { testingModels },
    refetchOnMount: false,
  });

  if (t.testingModels.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {t.testingModels.map((testingModel) => (
        <TestingModel
          testingModel={testingModel}
          key={testingModel.testingModel.id}
        />
      ))}
    </ul>
  );
}

const TestingModel = ({
  testingModel,
}: {
  testingModel: CompleteTestingModel;
}) => {
  return (
    <li className='flex justify-between my-2'>
      <div className='w-full'>
        <div>{testingModel.testingModel.name}</div>
      </div>
      <TestingModelModal testingModel={testingModel.testingModel} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className='text-center'>
      <h3 className='mt-2 text-sm font-semibold text-gray-900'>
        No testing models
      </h3>
      <p className='mt-1 text-sm text-gray-500'>
        Get started by creating a new testing model.
      </p>
      <div className='mt-6'>
        <TestingModelModal emptyState={true} />
      </div>
    </div>
  );
};
