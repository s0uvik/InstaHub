import { BottomBar } from "@/components/shared";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { bottomBarLinks } from "@/constants";

describe("BottomBar", () => {
  const renderBottomBar = () => {
    return render(
      <BrowserRouter>
        <BottomBar />
      </BrowserRouter>
    );
  };

  it("should render the bottom bar", () => {
    renderBottomBar();
    const bottomBar = screen.getByTestId("bottom-bar");
    expect(bottomBar).toBeInTheDocument();
  });

  it("should render all navigation links", () => {
    renderBottomBar();
    bottomBarLinks.forEach(link => {
      const linkElement = screen.getByText(link.label);
      expect(linkElement).toBeInTheDocument();
    });
  });

  it("should render all navigation icons", () => {
    renderBottomBar();
    bottomBarLinks.forEach(link => {
      const iconElement = screen.getByAltText(link.label);
      expect(iconElement).toBeInTheDocument();
      expect(iconElement.getAttribute("src")).toBe(link.imgURL);
    });
  });

  it("should have correct link destinations", () => {
    renderBottomBar();
    bottomBarLinks.forEach(link => {
      const linkElement = screen.getByText(link.label).closest("a");
      expect(linkElement).toHaveAttribute("href", link.route);
    });
  });
});
