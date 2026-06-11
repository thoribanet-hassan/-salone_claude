"use server";

import { redirect } from "next/navigation";
import {
  verifyFounderPassword,
  setFounderSession,
  clearFounderSession,
} from "@/lib/founder";

export async function founderLoginAction(formData: FormData): Promise<void> {
  const pw = String(formData.get("password") ?? "");
  if (!verifyFounderPassword(pw)) redirect("/founder?e=1");
  await setFounderSession();
  redirect("/founder");
}

export async function founderLogoutAction(): Promise<void> {
  await clearFounderSession();
  redirect("/founder");
}
