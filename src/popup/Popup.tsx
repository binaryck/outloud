import React from "react";
import { MemoryRouter } from "react-router-dom";
import { PopupContent } from "./components/PopupContent/PopupContent";
import { ServiceProvider } from "./context/serviceContext";
import { Provider } from "@/components/ui/provider";

export function Popup(): React.JSX.Element {
  return (
    <Provider>
      <ServiceProvider>
        <div className="container-popup">
          <MemoryRouter initialEntries={["/"]}>
            <PopupContent />
          </MemoryRouter>
        </div>
      </ServiceProvider>
    </Provider>
  );
}

export default Popup;
