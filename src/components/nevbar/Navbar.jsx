import React, { useState } from "react";
import DropdownListMenu from "./DropdownListMenu";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { AlignJustify, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <div className="hidden md:flex space-x-16">
          <Link to="/">ข้อมูลเมือง</Link>
          <Link to="/map">แผนที่</Link>
          <Link to="/">ของดีในเมือง</Link>
          <Link to="/">สุขภาพคนเมือง</Link>
        </div>
        <div className="hidden md:block">
          <DropdownListMenu />
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <AlignJustify size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden flex flex-col justify-center items-center space-y-4 p-4 bg-white shadow-md">
          <Link to="/" onClick={() => setIsOpen(false)}>
            ข้อมูลเมือง
          </Link>
          <Link to="/map" onClick={() => setIsOpen(false)}>
            แผนที่
          </Link>
          <Link to="/" onClick={() => setIsOpen(false)}>
            ของดีในเมือง
          </Link>
          <Link to="/" onClick={() => setIsOpen(false)}>
            สุขภาพคนเมือง
          </Link>
          <DropdownListMenu />
        </div>
      )}
    </nav>
  );
};
export default Navbar;
