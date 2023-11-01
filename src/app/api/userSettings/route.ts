import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createUserSetting,
  deleteUserSetting,
  updateUserSetting,
} from "@/lib/api/userSettings/mutations";
import { 
  insertUserSettingParams,
  updateUserSettingParams, 
  userSettingIdSchema} from "@/lib/db/schema/userSettings";

export async function POST(req: Request) {
  try {
    const validatedData = insertUserSettingParams.parse(await req.json());
    const { success, error } = await createUserSetting(validatedData);
    if (error) return NextResponse.json({ error }, { status: 500 });
    revalidatePath("/userSettings"); // optional - assumes you will have named route same as entity
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

    const validatedData = updateUserSettingParams.parse(await req.json());
    const validatedParams = userSettingIdSchema.parse({ id });

    const { success, error } = await updateUserSetting(validatedParams.id, validatedData);

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

    const validatedParams = userSettingIdSchema.parse({ id });
    const { success, error } = await deleteUserSetting(validatedParams.id);
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
