import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link
              href="/dashboard"
              className="flex items-center gap-2 !no-underline"
            >
              <img
                src="https://instagram.fcai2-1.fna.fbcdn.net/v/t51.2885-19/428585771_2777152992441459_5287123038744243977_n.jpg?stp=dst-jpg_s320x320&_nc_ht=instagram.fcai2-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=P5QNQFy7VCsQ7kNvgHobLZ0&_nc_gid=177d8032c78447d284356003d02a85ec&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AYBIgiLj1Rc6AKYmJPDjL2N2KJBm8i95rKUvTlSctT6JUg&oe=66FB3C34&_nc_sid=8b3546"
                height={40}
                width={40}
                alt="logo"
                className="rounded-full"
              />
              <h1 className="font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300 text-[#AA8C72] no-underline">
                CRCL Admin
              </h1>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
