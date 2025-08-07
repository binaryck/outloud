import React from "react";
import { MemoryRouter } from "react-router-dom";
import { PopupContent } from "./components/PopupContent";

export function Popup(): React.JSX.Element {
  return (
    <div className="container-popup">
      <MemoryRouter initialEntries={["/"]}>
        <PopupContent />
      </MemoryRouter>
    </div>
  );
}

export default Popup;
