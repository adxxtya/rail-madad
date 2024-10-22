import Link from "next/link";
import { Button } from "./ui/button";
import NavbarActions from "./NavbarActions";

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
        <NavbarActions />
      </div>
      <main>{children}</main>
    </>
  );
};

export default Navbar;
