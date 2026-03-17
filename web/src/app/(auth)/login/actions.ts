"use server";

import { signIn } from "@/services/auth";

export async function signInWithGitHub() {
  await signIn("github", { redirectTo: "/" });
}
