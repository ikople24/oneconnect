import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlignJustify, DotIcon } from "lucide-react";
import { links } from "@/utils/links";
import Usericon from "./Usericon";
import { Link, useNavigate } from "react-router";
import SignOutLink from "@/components/nevbar/SignOutLink";
import { useGlobalContext } from "@/context/Context";
import { Fragment, useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
  useClerk,
  UserButton,
  UserProfile,
  useUser,
} from "@clerk/clerk-react";
import { Dropdown, Menu, Space } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import Role from "@/enum/role.enum";

const DropdownListMenu = () => {
  const { role, isLoaded } = useGlobalContext();
  const [visible, setVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoaded) {
      setIsReady(true);
    }
  }, [isLoaded, role]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  const handleMenuClick = (e) => {
    e.preventDefault();
  };

  const items = [
    {
      key: "1",
      label: <div className="text-start p-1">หน้าแรก</div>,
      style: { padding: 0 },
    },
    // {
    //   key: "2",
    //   label: <div className="text-start p-1">เพิ่มข้อมูลเมือง</div>,
    //   style: { padding: 0 },
    // },
    {
      key: "signIn",
      label: (
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full p-1 text-start">เข้าสู่ระบบ</button>
          </SignInButton>
        </SignedOut>
      ),
      style: { padding: 0 },
    },
    {
      key: "signUp",
      label: (
        <SignedOut>
          <SignUpButton mode="modal">
            <button className="w-full p-1 text-start">สมัครสมาชิก</button>
          </SignUpButton>
        </SignedOut>
      ),
      style: { padding: 0 },
    },
    {
      key: "userButton",
      label: (
        <SignedIn>
          <div
            className="flex gap-2 p-1"
            onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking on these elements
          >
            <UserButton userProfileMode="modal" />
            <SignOutLink />
          </div>
        </SignedIn>
      ),
      style: { padding: 0 },
    },
  ];

  return (
    <>
      <SignedOut>
        <Dropdown
          autoAdjustOverflow
          destroyPopupOnHide
          menu={{ items }}
          trigger={["click"]}
          open={visible}
          onOpenChange={(newVisible) => setVisible(newVisible)}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Usericon />
          </a>
        </Dropdown>
      </SignedOut>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Action
              label="หน้าแรก"
              labelIcon={<DotIcon />}
              onClick={() => navigate("/")}
            />
            {isLoaded && (role === Role.SUPER_ADMIN || role === Role.ADMIN) && (
              <UserButton.Action
                label="Dashboard"
                labelIcon={<DotIcon />}
                onClick={() => navigate("/admin/marker-manage")}
              />
            )}
            {/* <UserButton.Action
              label="เพิ่มข้อมูลเมือง"
              labelIcon={<DotIcon />}
              onClick={() => navigate("/map")}
            /> */}
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
    </>
  );
};

export default DropdownListMenu;
