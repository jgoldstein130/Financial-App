import React, { createContext, useState } from "react";

export const ConfirmModalContext = createContext<any>(null);

export const ConfirmModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalFunction, setConfirmModalFunction] = useState(() => {});

  return (
    <ConfirmModalContext.Provider
      value={{
        isConfirmModalOpen,
        setIsConfirmModalOpen,
        confirmModalTitle,
        setConfirmModalTitle,
        confirmModalFunction,
        setConfirmModalFunction,
      }}
    >
      {children}
    </ConfirmModalContext.Provider>
  );
};
