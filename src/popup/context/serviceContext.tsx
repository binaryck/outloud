import { createContext, useContext } from "react";
import { WalletService } from "../services/walletService";
import { OrdinalsBotService } from "../services/ordinalsBotService";

// Define the context type
interface ServiceContextType {
  walletService: typeof WalletService;
  ordinalsBotService: typeof OrdinalsBotService;
}

// Create context
const ServiceContext = createContext<ServiceContextType | null>(null);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  // Static services
  const services = {
    walletService: WalletService,
    ordinalsBotService: OrdinalsBotService,
  };

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}

// Custom hook for consuming context
export const useServices = () => {
  const context = useContext(ServiceContext);
  // Ensure context is not null for type checking
  if (!context) {
    throw new Error("Context not found");
  }
  return context;
};
