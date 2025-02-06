import React from "react";
import { Link } from "react-router-dom";


const Logo = () => {
  return (
    <>
      <Link to="/">
        <img src="/ocn_logo.png" className="w-20 h-20 p-2 object-fill" />
      </Link>
    </>
  );
};
export default Logo;
