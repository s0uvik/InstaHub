import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const RedirectToLogin = ({ message }: { message: string }) => {
  const navigate = useNavigate();
  const { mutateAsync } = useSignOutAccount();

  const handleLoginRedirect = async () => {
    navigate("/sign-in");
    await mutateAsync();
    location.reload();
  };
  return (
    <div className="profile-container text-2xl font-semibold mt-4">
      {message}
      <Button onClick={handleLoginRedirect} className=" shad-button_primary">
        Login
      </Button>
    </div>
  );
};

export default RedirectToLogin;
