import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlignJustify } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { links } from "@/utils/links";
import Usericon from "./Usericon";
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/clerk-react";


const DropdownListMenu = () => {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        {/* ปุ่มด้านขวา user pro file  */}
        <Button variant="secondary" size="lg">
          <AlignJustify />
          <Usericon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          links.map((item,index)=>{
            console.log(item.href)
            return(
              <DropdownMenuItem>{item.label}</DropdownMenuItem>
            )
          })
        }
        <DropdownMenuSeparator />

        <SignedOut>
        <DropdownMenuItem>
        {/* กรณีทียังไม่ได้ล็อกอิน */}
          <SignInButton mode="modal">
          <button>login</button>
          </SignInButton>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <SignUpButton mode="modal">
            <button>Registers</button>
          </SignUpButton>
        </DropdownMenuItem>
        </SignedOut>
        
        {/* กรณีที่ล็อคอินแล้ว */}
        <SignedIn>
          <DropdownMenuItem>
            <UserButton />
            <SignOutButton />
          </DropdownMenuItem>
        </SignedIn>
      
        
       
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default DropdownListMenu