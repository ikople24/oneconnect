import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlignJustify } from "lucide-react";
import { links } from "@/utils/links";
import Usericon from "./Usericon";
import { Link } from "react-router";
import SignOutLink from "@/components/nevbar/SignOutLink";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

const DropdownListMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="bg-transparent hover:bg-transparent">
        {/* ปุ่มด้านขวา user pro file  */}
        <div className="cursor-pointer">
          {/* <AlignJustify/> */}
          <Usericon />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {links.map((item, index) => {
          console.log(item.href);
          return (
            <DropdownMenuItem key={index}>
              <Link to={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />

        <SignedOut>
          <DropdownMenuItem>
            {/* กรณีทียังไม่ได้ล็อกอิน */}
            <SignInButton mode="modal">
              <button>เข้าสู่ระบบ</button>
            </SignInButton>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <SignUpButton mode="modal">
              <button>สมัครสมาชิก</button>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>

        {/* กรณีที่ล็อคอินแล้ว */}
        <SignedIn>
          <DropdownMenuItem>
            <UserButton />
            {/* <SignOutButton /> */}
            <SignOutLink />
          </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default DropdownListMenu;
