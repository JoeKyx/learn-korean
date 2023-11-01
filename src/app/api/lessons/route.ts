import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createLesson,
  deleteLesson,
  updateLesson,
} from '@/lib/api/lessons/mutations';
import {
  insertLessonParams,
  lessonIdSchema,
  updateLessonParams,
} from '@/lib/db/schema/lessons';

export async function POST(req: Request) {
  try {
    const validatedData = insertLessonParams.parse(await req.json());
    const { success, error } = await createLesson(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath('/lessons'); // optional - assumes you will have named route same as entity
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

    const validatedData = updateLessonParams.parse(await req.json());
    const validatedParams = lessonIdSchema.parse({ id });

    const { success, error } = await updateLesson(
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

    const validatedParams = lessonIdSchema.parse({ id });
    const { success, error } = await deleteLesson(validatedParams.id);
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
