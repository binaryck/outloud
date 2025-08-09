import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BackArrow(): React.JSX.Element {
  return (
    <Link to="/" className="back-arrow">
      <ArrowLeft size={25} strokeWidth={4} />
    </Link>
  );
}
