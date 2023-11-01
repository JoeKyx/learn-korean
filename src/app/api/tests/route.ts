import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createTest,
  deleteTest,
  updateTest,
} from "@/lib/api/tests/mutations";
import { 
  insertTestParams,
  testIdSchema,
  updateTestParams 
} from "@/lib/db/schema/tests";

export async function POST(req: Request) {
  try {
    const validatedData = insertTestParams.parse(await req.json());
    const { success, error } = await createTest(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/tests"); // optional - assumes you will have named route same as entity
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

    const validatedData = updateTestParams.parse(await req.json());
    const validatedParams = testIdSchema.parse({ id });

    const { success, error } = await updateTest(validatedParams.id, validatedData);

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

    const validatedParams = testIdSchema.parse({ id });
    const { success, error } = await deleteTest(validatedParams.id);
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
