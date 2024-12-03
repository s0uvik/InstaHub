import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <section className="flex flex-1 flex-col md:justify-center items-center py-10">
          <Outlet />
        </section>
      )}
    </>
  );
};

export default AuthLayout;
