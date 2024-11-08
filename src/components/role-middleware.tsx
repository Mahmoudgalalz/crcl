"use client";

import { SuperUserType } from "@/lib/types";
import { useEffect } from "react";

const ALLOWED_ROUTES: Record<SuperUserType, string[]> = {
  ADMIN: ["*"],
  FINANCE: ["dashboard"],
  MODERATOR: ["newspaper"],
  APPROVAL: ["events"],
};

export function RolesMiddleware({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const currRoute = window.location.pathname.split("/")[1] || "";
    const userType = localStorage.getItem("type") as SuperUserType;

    console.log("Current route:", currRoute);
    console.log("User type:", userType);

    if (!userType || !Object.keys(ALLOWED_ROUTES).includes(userType)) {
      console.log("Invalid user type - redirecting to home");
      window.location.href = "/";
      return;
    }

    const allowedRoutes = ALLOWED_ROUTES[userType];
    if (
      !allowedRoutes.includes("*") &&
      !allowedRoutes.includes(currRoute) &&
      currRoute !== ""
    ) {
      console.log("Unauthorized access - redirecting to home");
      window.location.href = "/";
      return;
    }
  }, []);

  return <>{children}</>;
}
