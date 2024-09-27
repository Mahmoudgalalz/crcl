import Link from "next/link";
import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/sidebar-toggle";
import Image from "next/image";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-3 pt-4 overflow-y-auto shadow-md">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 !no-underline"
          >
            <Image
              src="https://instagram.fcai2-1.fna.fbcdn.net/v/t51.2885-19/428585771_2777152992441459_5287123038744243977_n.jpg?stp=dst-jpg_s320x320&_nc_ht=instagram.fcai2-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=P5QNQFy7VCsQ7kNvgHobLZ0&_nc_gid=177d8032c78447d284356003d02a85ec&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AYBIgiLj1Rc6AKYmJPDjL2N2KJBm8i95rKUvTlSctT6JUg&oe=66FB3C34&_nc_sid=8b3546"
              height={40}
              width={40}
              alt="logo"
              className="rounded-full"
            />
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300 text-[#AA8C72] no-underline",
                sidebar?.isOpen === false
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              CRCL Admin
            </h1>
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
