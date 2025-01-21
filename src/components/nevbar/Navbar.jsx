import DropdownListMenu from "./DropdownListMenu";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav>
      <div
        className="flex flex-col items-center 
      py-4 justify-between sm:flex-row gap-4 ml-4 mr-4"
      >
        <Logo/>
        <h1>cityname</h1>
        <DropdownListMenu />
        
      </div>
    </nav>
  );
};
export default Navbar;