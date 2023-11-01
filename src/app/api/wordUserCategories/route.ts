import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createWordUserCategorie,
  deleteWordUserCategorie,
  updateWordUserCategorie,
} from "@/lib/api/wordUserCategories/mutations";
import { 
  wordUserCategorieIdSchema,
  insertWordUserCategorieParams,
  updateWordUserCategorieParams 
} from "@/lib/db/schema/wordUserCategories";

export async function POST(req: Request) {
  try {
    const validatedData = insertWordUserCategorieParams.parse(await req.json());
    const { success, error } = await createWordUserCategorie(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/wordUserCategories"); // optional - assumes you will have named route same as entity
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
    const id = searchParams.get("id");

    const validatedData = updateWordUserCategorieParams.parse(await req.json());
    const validatedParams = wordUserCategorieIdSchema.parse({ id });

    const { success, error } = await updateWordUserCategorie(validatedParams.id, validatedData);

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
    const id = searchParams.get("id");

    const validatedParams = wordUserCategorieIdSchema.parse({ id });
    const { success, error } = await deleteWordUserCategorie(validatedParams.id);
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
