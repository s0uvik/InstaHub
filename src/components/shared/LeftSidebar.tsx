import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useSignOutAccount } from "../../lib/react-query/queriesAndMutations";
import { useUserContext } from "../../context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Button } from "../ui/button";

const LeftSidebar = () => {
  const { mutate: signOut, isSuccess, isPending } = useSignOutAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
  }, [isSuccess, navigate]);
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className=" flex gap-3 items-center">
          <img src="/assets/images/logo.png" alt="logo" width={35} height={35} />{" "}
          <h3 className=" text-2xl font-semibold">InstaHub</h3>
        </Link>
        <Link to={`profile/${user.id}`} className="flex-start gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">{user.username}</p>
          </div>
        </Link>

        <ul className=" flex flex-col gap-4">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}
              >
                <NavLink to={link.route} className="flex item-center gap-4 p-3">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={` group-hover:invert-white ${isActive && "invert-white"}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button onClick={() => signOut()} disabled={isPending} className=" flex-start flex gap-3">
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className=" small-medium lg:base-medium">{isPending ? "Logging out..." : "Logout"}</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
