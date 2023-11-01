import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createTestingModel,
  deleteTestingModel,
  updateTestingModel,
} from '@/lib/api/testingModels/mutations';
import {
  insertTestingModelParams,
  testingModelIdSchema,
  updateTestingModelParams,
} from '@/lib/db/schema/testingModels';

export async function POST(req: Request) {
  try {
    const validatedData = insertTestingModelParams.parse(await req.json());
    const { success, error } = await createTestingModel(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath('/testingModels'); // optional - assumes you will have named route same as entity
    return NextResponse.json(success, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const validatedData = updateTestingModelParams.parse(await req.json());
    const validatedParams = testingModelIdSchema.parse({ id });

    const { success, error } = await updateTestingModel(
      validatedParams.id,
      validatedData
    );

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const validatedParams = testingModelIdSchema.parse({ id });
    const { success, error } = await deleteTestingModel(validatedParams.id);
    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
