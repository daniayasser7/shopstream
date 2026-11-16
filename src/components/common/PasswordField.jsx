import { useState } from "react";
import { Lock, Eye, EyeSlash } from "react-bootstrap-icons";
import FormField from "./FormField";

function PasswordField({ icon = Lock, ...props }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormField {...props} icon={icon} type={isVisible ? "text" : "password"}>
      <button
        type="button"
        className="ss-field-toggle"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? "Hide password" : "Show password"}
      >
        {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
      </button>
    </FormField>
  );
}

export default PasswordField;