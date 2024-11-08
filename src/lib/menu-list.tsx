import {
  LayoutGrid,
  LucideIcon,
  Ticket,
  Newspaper,
  Users,
  BellDotIcon,
  Settings,
  Contact,
} from "lucide-react";
import type { SuperUserType } from "./types";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon | JSX.Element;
  submenus: Submenu[];
};
type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  const superUserType = localStorage.getItem("type") as SuperUserType;
  return [
    {
      groupLabel: "",
      menus: [
        (superUserType === "ADMIN" || superUserType === "FINANCE") && {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname === "/dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
        (superUserType === "ADMIN" || superUserType === "APPROVAL") && {
          href: "/events",
          label: "Events",
          active: pathname.includes("/events"),
          icon: Ticket,
          submenus: [],
        },
        (superUserType === "ADMIN" || superUserType === "MODERATOR") && {
          href: "/newspaper",
          label: "Newspaper",
          active: pathname.includes("/newspaper"),
          icon: Newspaper,
          submenus: [],
        },
        superUserType === "ADMIN" && {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
        },
        superUserType === "ADMIN" && {
          href: "/push-notification",
          label: "Push Notifications",
          active: pathname.includes("/push-notification"),
          icon: BellDotIcon,
          submenus: [],
        },
        superUserType === "ADMIN" && {
          href: "/refund-requests",
          label: "Refund Requests",
          active: pathname.includes("/refund-requests"),

          icon: (props: {
            size?: number;
            color?: string;
            [key: string]: unknown;
          }) => (
            <svg
              width={props.size || "24"}
              height={props.size || "24"}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              {...props}
            >
              <path
                fill={props.color || "currentColor"}
                d="M5.676 4.257c3.928-3.219 9.733-2.995 13.4.672c3.905 3.905 3.905 10.237 0 14.142s-10.237 3.905-14.142 0a9.99 9.99 0 0 1-2.678-9.304l.077-.313l1.934.51a8 8 0 1 0 3.053-4.45l-.22.166l1.017 1.017l-4.596 1.06l1.06-4.596zM13.005 6v2h2.5v2h-5.5a.5.5 0 0 0-.09.992l.09.008h4a2.5 2.5 0 0 1 0 5h-1v2h-2v-2h-2.5v-2h5.5a.5.5 0 0 0 .09-.992l-.09-.008h-4a2.5 2.5 0 1 1 0-5h1V6z"
              />
            </svg>
          ),
          submenus: [],
        },
        superUserType === "ADMIN" && {
          href: "/ops",
          label: "Operations",
          active: pathname.includes("/ops"),
          icon: Contact,
          submenus: [],
        },
        superUserType === "ADMIN" && {
          href: "/settings",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: [],
        },
      ].filter(Boolean) as Menu[],
    },
  ];
}
