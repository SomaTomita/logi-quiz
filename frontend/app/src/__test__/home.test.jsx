import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Home from "../quiz-components/home";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../App";

test("it renders the Home component correctly", () => {
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ isSignedIn: true }}>
        <Home />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText(/まず学びたい分野を選んで問題に挑戦しましょう。/i)).toBeInTheDocument();
  expect(screen.getByText(/次に学習状況を確認しましょう。/i)).toBeInTheDocument();

  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(2);

  const loginLink = screen.getByText(/ログイン/i);
  expect(loginLink).toBeInTheDocument();
});
