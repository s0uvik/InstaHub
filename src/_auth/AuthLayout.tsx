import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAUthenticated = false;

  return (
    <>
      {isAUthenticated ? (
        <Navigate to="/" />
      ) : (
          <section className="flex flex-1 flex-col justify-center items-center py-10">
            <Outlet />
          </section>
      )}
    </>
  );
};

export default AuthLayout;
