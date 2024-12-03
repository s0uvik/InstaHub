import { Outlet } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { BottomBar, LeftSidebar, TopBar } from "@/components/shared";

const RootLayout = () => {
  const { isAuthenticated } = useUserContext();

  if (!isAuthenticated) return;

  return (
    <div className=" w-full md:flex">
      <TopBar />
      <LeftSidebar />

      <section className=" flex flex-1 h-full">
        <Outlet />
      </section>
      <BottomBar />
    </div>
  );
};

export default RootLayout;
