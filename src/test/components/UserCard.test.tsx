import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserCard from "@/components/shared/UserCard";

describe("UserCard", () => {
  const mockUser = {
    $id: "123",
    name: "Souvik",
    username: "s0uvik",
    imageUrl: "https://url.com/profile.jpg"
  };

  const renderUserCard = () => {
    return render(
      <BrowserRouter>
        <UserCard user={mockUser} />
      </BrowserRouter>
    );
  };

  it("should render user information", () => {
    renderUserCard();
    
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(`@${mockUser.username}`)).toBeInTheDocument();
    expect(screen.getByAltText("profile")).toHaveAttribute("src", mockUser.imageUrl);
  });

  it("should render profile placeholder when imageUrl is not provided", () => {
    const userWithoutImage = { ...mockUser, imageUrl: "" };
    render(
      <BrowserRouter>
        <UserCard user={userWithoutImage} />
      </BrowserRouter>
    );

    expect(screen.getByAltText("profile")).toHaveAttribute(
      "src",
      "/assets/icons/profile-placeholder.svg"
    );
  });

  it("should link to user profile", () => {
    renderUserCard();
    
    const profileLink = screen.getByRole("link");
    expect(profileLink).toHaveAttribute("href", `/profile/${mockUser.$id}`);
  });

  it("should render view profile button", () => {
    renderUserCard();
    
    const button = screen.getByText(/View Profile/i);
    expect(button).toBeInTheDocument();
  });
});