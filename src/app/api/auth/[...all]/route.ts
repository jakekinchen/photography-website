import { NextResponse } from "next/server";

function disabledAuthResponse() {
  return NextResponse.json({ error: "Authentication is disabled." }, { status: 404 });
}

export const GET = disabledAuthResponse;
export const POST = disabledAuthResponse;
