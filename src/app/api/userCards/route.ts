import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createUserCard,
  deleteUserCard,
  updateUserCard,
} from '@/lib/api/userCards/mutations';
import {
  insertUserCardParams,
  updateUserCardParams,
  userCardIdSchema,
} from '@/lib/db/schema/userCards';

export async function POST(req: Request) {
  try {
    const validatedData = insertUserCardParams.parse(await req.json());
    const { success, error } = await createUserCard(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath('/userCards'); // optional - assumes you will have named route same as entity
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

    const validatedData = updateUserCardParams.parse(await req.json());
    const validatedParams = userCardIdSchema.parse({ id });

    const { success, error } = await updateUserCard(
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

    const validatedParams = userCardIdSchema.parse({ id });
    const { success, error } = await deleteUserCard(validatedParams.id);
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
