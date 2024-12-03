import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignOutAccount } from "../../lib/react-query/queriesAndMutations";
import { useUserContext } from "../../context/AuthContext";
import { Button } from "../ui/button";

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();

  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in");
      location.reload();
    }
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex justify-between items-center w-full py-4 px-5">
        <Link to="/" className="flex gap-2 items-center">
          <img src="/assets/images/logo.png" alt="logo" width={35} height={35} />{" "}
          <h3 className=" text-2xl font-semibold">InstaHub</h3>
        </Link>

        <div className="flex gap-4">
          <Button onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`profile/${user.id}`} className="flex-center">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-10 w-10 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
