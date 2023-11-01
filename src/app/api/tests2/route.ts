import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createTests,
  deleteTests,
  updateTests,
} from "@/lib/api/tests2/mutations";
import { 
  insertTestsParams,
  testsIdSchema,
  updateTestsParams 
} from "@/lib/db/schema/tests2";

export async function POST(req: Request) {
  try {
    const validatedData = insertTestsParams.parse(await req.json());
    const { success, error } = await createTests(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/tests2"); // optional - assumes you will have named route same as entity
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

    const validatedData = updateTestsParams.parse(await req.json());
    const validatedParams = testsIdSchema.parse({ id });

    const { success, error } = await updateTests(validatedParams.id, validatedData);

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

    const validatedParams = testsIdSchema.parse({ id });
    const { success, error } = await deleteTests(validatedParams.id);
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
