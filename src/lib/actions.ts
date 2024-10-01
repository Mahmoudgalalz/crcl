"use server";

import { createSession, deleteSession } from "./session";

export async function loginServer(token: string) {
  createSession(token);
}

export async function logoutServer() {
  deleteSession();
}
