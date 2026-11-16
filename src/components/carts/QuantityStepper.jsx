import { Button } from "react-bootstrap";
import { Dash, Plus } from "react-bootstrap-icons";

function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = Infinity,
  disabled = false,
  label = "Quantity",
}) {
  return (
    <div className="ss-stepper" role="group" aria-label={label}>
      <Button
        variant="link"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Dash size={18} />
      </Button>
      <span className="ss-stepper-value" aria-live="polite">
        {value}
      </span>
      <Button
        variant="link"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={18} />
      </Button>
    </div>
  );
}

export default QuantityStepper;