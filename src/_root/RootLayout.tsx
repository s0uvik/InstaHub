import { Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { BottomBar, LeftSidebar, TopBar } from "@/components/shared";

const RootLayout = () => {
  const { isAuthenticated } = useUserContext();
  const { pathname } = useLocation();

  if (!isAuthenticated) return;

  return (
    <div className=" w-full md:flex">
      <TopBar />
      <LeftSidebar />

      <section className=" flex flex-1 h-full">
        <Outlet />
      </section>
      {pathname !== "/message" && <BottomBar />}
    </div>
  );
};

export default RootLayout;
