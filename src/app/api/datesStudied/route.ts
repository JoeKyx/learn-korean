import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createDatesStudie,
  deleteDatesStudie,
  updateDatesStudie,
} from "@/lib/api/datesStudied/mutations";
import { 
  datesStudieIdSchema,
  insertDatesStudieParams,
  updateDatesStudieParams 
} from "@/lib/db/schema/datesStudied";

export async function POST(req: Request) {
  try {
    const validatedData = insertDatesStudieParams.parse(await req.json());
    const { success, error } = await createDatesStudie(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/datesStudied"); // optional - assumes you will have named route same as entity
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

    const validatedData = updateDatesStudieParams.parse(await req.json());
    const validatedParams = datesStudieIdSchema.parse({ id });

    const { success, error } = await updateDatesStudie(validatedParams.id, validatedData);

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

    const validatedParams = datesStudieIdSchema.parse({ id });
    const { success, error } = await deleteDatesStudie(validatedParams.id);
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
