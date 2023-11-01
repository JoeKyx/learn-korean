import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createLessonCategorie,
  deleteLessonCategorie,
  updateLessonCategorie,
} from "@/lib/api/lessonCategories/mutations";
import { 
  lessonCategorieIdSchema,
  insertLessonCategorieParams,
  updateLessonCategorieParams 
} from "@/lib/db/schema/lessonCategories";

export async function POST(req: Request) {
  try {
    const validatedData = insertLessonCategorieParams.parse(await req.json());
    const { success, error } = await createLessonCategorie(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/lessonCategories"); // optional - assumes you will have named route same as entity
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

    const validatedData = updateLessonCategorieParams.parse(await req.json());
    const validatedParams = lessonCategorieIdSchema.parse({ id });

    const { success, error } = await updateLessonCategorie(validatedParams.id, validatedData);

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

    const validatedParams = lessonCategorieIdSchema.parse({ id });
    const { success, error } = await deleteLessonCategorie(validatedParams.id);
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
