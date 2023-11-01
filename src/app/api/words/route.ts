import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createWord, deleteWord, updateWord } from '@/lib/api/words/mutations';
import {
  insertWordParams,
  updateWordParams,
  wordIdSchema,
} from '@/lib/db/schema/words';

export async function POST(req: Request) {
  try {
    const validatedData = insertWordParams.parse(await req.json());
    const { success, error } = await createWord(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath('/words'); // optional - assumes you will have named route same as entity
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

    const validatedData = updateWordParams.parse(await req.json());
    const validatedParams = wordIdSchema.parse({ id });

    const { success, error } = await updateWord(
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

    const validatedParams = wordIdSchema.parse({ id });
    const { success, error } = await deleteWord(validatedParams.id);
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
