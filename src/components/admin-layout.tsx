import { Navbar } from "@/components/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="container pt-8  px-4 sm:px-8 mx-auto">{children}</div>
    </div>
  );
}
