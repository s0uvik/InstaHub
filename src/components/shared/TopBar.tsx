import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "../../lib/react-query/queriesAndMutations";
import { useUserContext } from "../../context/AuthContext";

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();

  const {user}= useUserContext()

  useEffect(() => {
    if (isSuccess) {
      navigate(0);
    }
  }, [isSuccess, navigate]);

  
  return (
    <section className="topbar">
      <div className="flex justify-between items-center w-full py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/images/logo.svg" alt="logo" width={130} height={325} />
        </Link>

        <div className="flex gap-4">
          <Button onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`profile/${user.id}`} className="flex-center">
            <img src={user.imageUrl || "/assets/images/profile.png"} alt="profile" className="h-10 w-10 rounded-full" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
