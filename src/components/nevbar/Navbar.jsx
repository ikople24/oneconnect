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
        <h1>Profile</h1>
        
      </div>
    </nav>
  );
};
export default Navbar;