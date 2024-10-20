import Link from "next/link";
import { Button } from "./ui/button";

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <>
      <div className="z-10 flex h-20 w-full items-center justify-between bg-[#930B3E] px-16">
        <Link href={"/"} className="text-4xl font-bold text-white">
          RailMadadAI
        </Link>
        <Link href={"/complaint/track"}>
          <Button variant={"secondary"} className="h-10 font-bold">
            Track your complaint
          </Button>
        </Link>
      </div>
      <main>{children}</main>
    </>
  );
};

export default Navbar;
