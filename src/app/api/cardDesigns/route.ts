import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  createCardDesign,
  deleteCardDesign,
  updateCardDesign,
} from '@/lib/api/cardDesigns/mutations';
import {
  cardDesignIdSchema,
  insertCardDesignParams,
  updateCardDesignParams,
} from '@/lib/db/schema/cardDesigns';

export async function POST(req: Request) {
  try {
    const validatedData = insertCardDesignParams.parse(await req.json());
    const { success, error } = await createCardDesign(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath('/cardDesigns'); // optional - assumes you will have named route same as entity
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

    const validatedData = updateCardDesignParams.parse(await req.json());
    const validatedParams = cardDesignIdSchema.parse({ id });

    const { success, error } = await updateCardDesign(
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

    const validatedParams = cardDesignIdSchema.parse({ id });
    const { success, error } = await deleteCardDesign(validatedParams.id);
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
