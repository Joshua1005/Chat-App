import { AppContext } from "@/context/AppProvider";
import { useContext } from "react";

const useApp = () => {
  const context = useContext(AppContext);

  if (!context) throw new Error("useApp must be used within AppProvider");

  return context;
};

export default useApp;
