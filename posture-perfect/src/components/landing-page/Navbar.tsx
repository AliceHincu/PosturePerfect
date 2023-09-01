import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { CiLogin, CiLogout } from "react-icons/ci";
import { GrUserNew } from "react-icons/gr";
import { BsPerson } from "react-icons/bs";
import { TbHealthRecognition } from "react-icons/tb";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";

type MenuOptions = {
  text: string;
  icon: JSX.Element;
  path?: string;
  action?: () => void;
  isLink: boolean;
  isSpecial: boolean;
};

export const NavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { token, onLogout } = useAuth();
  console.log(token);
  const menuOptions: MenuOptions[] = token
    ? [
        {
          text: "Logout",
          icon: <CiLogout />,
          action: onLogout, // Logout action from useAuth
          isLink: false,
          isSpecial: false,
        },
        {
          text: "Profile",
          icon: <BsPerson />,
          path: "/profile",
          isLink: true,
          isSpecial: false,
        },
      ]
    : [
        {
          text: "Login",
          icon: <CiLogin />,
          path: "/login",
          isLink: true,
          isSpecial: false,
        },
        {
          text: "Register",
          icon: <GrUserNew />,
          path: "/register",
          isLink: true,
          isSpecial: false,
        },
      ];

  // common stuff
  menuOptions.push(
    {
      text: "Ergonomics",
      icon: <TbHealthRecognition />,
      path: "/ergonomics",
      isLink: true,
      isSpecial: false,
    },
    {
      text: "Analyze Posture",
      icon: <MdOutlineSettingsSuggest />,
      path: "/posture-processing",
      isLink: true,
      isSpecial: true,
    }
  );

  return (
    <nav>
      <div className="nav-logo-container">
        <img src="/assets/Logo3.png" width="400px" alt=""></img>
      </div>
      <div className="navbar-links-container">
        {menuOptions.map((item, index) =>
          item.isLink ? (
            <Link key={index} to={item.path!} className={item.isSpecial ? "primary-button" : ""}>
              {item.text}
            </Link>
          ) : (
            <button key={index} onClick={item.action} className="navbar-button">
              {item.text}
            </button>
          )
        )}
      </div>
      <div className="navbar-menu-container">
        <AiOutlineMenu onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};
