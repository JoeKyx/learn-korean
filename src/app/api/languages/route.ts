import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createLanguage,
  deleteLanguage,
  updateLanguage,
} from "@/lib/api/languages/mutations";
import { 
  insertLanguageParams,
  languageIdSchema,
  updateLanguageParams 
} from "@/lib/db/schema/languages";

export async function POST(req: Request) {
  try {
    const validatedData = insertLanguageParams.parse(await req.json());
    const { success, error } = await createLanguage(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/languages"); // optional - assumes you will have named route same as entity
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

    const validatedData = updateLanguageParams.parse(await req.json());
    const validatedParams = languageIdSchema.parse({ id });

    const { success, error } = await updateLanguage(validatedParams.id, validatedData);

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

    const validatedParams = languageIdSchema.parse({ id });
    const { success, error } = await deleteLanguage(validatedParams.id);
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
