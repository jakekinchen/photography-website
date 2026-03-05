import type { Session } from "./auth-types";

export async function getSession(): Promise<Session | null> {
  return null;
}

export async function getSessions(): Promise<Session["session"][]> {
  return [];
}
