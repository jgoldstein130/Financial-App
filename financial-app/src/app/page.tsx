"use client";

import App from "./App";
import { ConfirmModalProvider } from "./Contexts/ConfirmModalContext";

const Home = () => {
  return (
    <ConfirmModalProvider>
      <App />
    </ConfirmModalProvider>
  );
};

export default Home;
