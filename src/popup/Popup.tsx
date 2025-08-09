import React from "react";
import { MemoryRouter } from "react-router-dom";
import { PopupContent } from "./components/PopupContent/PopupContent";
import { ServiceProvider } from "./context/serviceContext";

export function Popup(): React.JSX.Element {
  return (
    <ServiceProvider>
      <div className="container-popup">
        <MemoryRouter initialEntries={["/"]}>
          <PopupContent />
        </MemoryRouter>
      </div>
    </ServiceProvider>
  );
}

export default Popup;
