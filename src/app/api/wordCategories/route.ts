import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createWordCategorie,
  deleteWordCategorie,
  updateWordCategorie,
} from "@/lib/api/wordCategories/mutations";
import { 
  wordCategorieIdSchema,
  insertWordCategorieParams,
  updateWordCategorieParams 
} from "@/lib/db/schema/wordCategories";

export async function POST(req: Request) {
  try {
    const validatedData = insertWordCategorieParams.parse(await req.json());
    const { success, error } = await createWordCategorie(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/wordCategories"); // optional - assumes you will have named route same as entity
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

    const validatedData = updateWordCategorieParams.parse(await req.json());
    const validatedParams = wordCategorieIdSchema.parse({ id });

    const { success, error } = await updateWordCategorie(validatedParams.id, validatedData);

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

    const validatedParams = wordCategorieIdSchema.parse({ id });
    const { success, error } = await deleteWordCategorie(validatedParams.id);
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