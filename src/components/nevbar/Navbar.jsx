import { Button } from "../ui/button";
import DropdownListMenu from "./DropdownListMenu";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav>
      <div
        className="flex flex-col items-center bg-primaryTitle text-slate-200 
      py-4 justify-between sm:flex-row gap-4 "
      >
       
        <div className="flex gap-2 ml-5">
        <Logo/>
        <Button variant="ghost" className="bg-gray-100 text-primaryContent ml-5">ข้อมูลเมือง</Button>
        <Button variant="ghost" className="bg-gray-100 text-primaryContent">ของดีในเมือง</Button>
        <Button variant="ghost" className="bg-gray-100 text-primaryContent">สุขภาพคนเมือง</Button>
        </div>
        <h1>cityname</h1>
        <DropdownListMenu />
        
      </div>
    </nav>
  );
};
export default Navbar;