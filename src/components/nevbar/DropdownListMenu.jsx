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

        
       
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default DropdownListMenu