"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyPassword, setSession } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const mode = String(formData.get("mode") ?? "manager");

  if (mode === "manager") {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    if (!email || !password) return { error: "أدخل البريد وكلمة المرور" };

    const user = await prisma.user.findFirst({
      where: { email, role: "manager" },
    });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return { error: "بيانات الدخول غير صحيحة" };
    }
    await setSession({
      userId: user.id.toString(),
      shopId: user.shopId.toString(),
      role: "manager",
      name: user.name,
    });
    redirect("/dashboard");
  }

  // موظف: رمز المحل + رمز الدخول
  const shopCode = String(formData.get("shopCode") ?? "").trim().toUpperCase();
  const loginCode = String(formData.get("loginCode") ?? "").trim();
  if (!shopCode || !loginCode) return { error: "أدخل رمز المحل ورمز الدخول" };

  const shop = await prisma.shop.findUnique({ where: { shopCode } });
  if (!shop) return { error: "رمز المحل غير صحيح" };

  const barber = await prisma.user.findFirst({
    where: { shopId: shop.id, loginCode, role: "barber", isActive: true },
  });
  if (!barber) return { error: "رمز الدخول غير صحيح أو الحساب معطّل" };

  await setSession({
    userId: barber.id.toString(),
    shopId: barber.shopId.toString(),
    role: "barber",
    name: barber.name,
  });
  redirect("/serve");
}
