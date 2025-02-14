import React, { useState } from "react";
import DropdownListMenu from "./DropdownListMenu";
import Logo from "./Logo";
import { NavLink } from "react-router-dom";
import { AlignJustify, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-greenLight shadow-md">
      <div className="container mx-auto flex justify-between items-center md:px-4 p-4">
        <div>
          <p className="text-2xl font-bold text-white">OCN</p>
        </div>
        <div className="hidden md:flex space-x-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-white font-bold" : "text-greenSoft"
            }
          >
            ข้อมูลเมือง
          </NavLink>
          <NavLink
            to="/map"
            end
            className={({ isActive }) =>
              isActive ? "text-white font-bold" : "text-greenSoft"
            }
          >
            แผนที่
          </NavLink>
          {/* <NavLink
            to=""
            end
            className={({ isActive }) =>
              isActive ? "text-white font-bold" : "text-greenSoft"
            }
          >
            ของดีในเมือง
          </NavLink> */}
          {/* <NavLink
            to=""
            end
            className={({ isActive }) =>
              isActive ? "text-white font-bold" : "text-greenSoft"
            }
          >
            สุขภาพคนเมือง
          </NavLink> */}
          <DropdownListMenu />
        </div>
        <button className="md:hidden px-4" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <AlignJustify size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden flex flex-col justify-center items-center space-y-4 p-4 bg-greenLight shadow-md">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-white font-bold" : "text-greenSoft"
            }
            onClick={() => setIsOpen(false)}
            style={{ width: "100%", "textAlign": "center" }}
          >
            ข้อมูลเมือง
          </NavLink>
          <NavLink
            to="/map"
            end
            className={({ isActive }) =>
              isActive ? "text-white font-bold" : "text-greenSoft"
            }
            onClick={() => setIsOpen(false)}
            style={{ width: "100%", "textAlign": "center" }}
          >
            แผนที่
          </NavLink>
          {/* <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-cyan-400 font-bold" : "text-cyan-50"
            }
            onClick={() => setIsOpen(false)}
          >
            ของดีในเมือง
          </NavLink>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-cyan-400 font-bold" : "text-cyan-50"
            }
            onClick={() => setIsOpen(false)}
          >
            สุขภาพคนเมือง
          </NavLink> */}
          <DropdownListMenu />
        </div>
      )}
    </nav>
  );
};
export default Navbar;
