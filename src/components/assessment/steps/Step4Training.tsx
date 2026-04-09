import RadioQuestion from "../RadioQuestion";
import CheckboxQuestion from "../CheckboxQuestion";

interface Props {
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
  showErrors: boolean;
}

const Step4Training = ({ data, onChange, showErrors }: Props) => (
  <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
    <RadioQuestion
      label="How often are safety trainings conducted for employees?"
      required
      options={["Weekly", "Monthly", "Quarterly", "Half-yearly", "Annually", "Only during induction", "No regular training"]}
      value={data.s4_q0 || ""}
      onChange={(v) => onChange("s4_q0", v)}
      showError={showErrors}
    />
    <CheckboxQuestion
      label="How is training effectiveness evaluated?"
      options={["Post-training quiz or test", "Supervisor observation", "Incident / behaviour trend review", "Employee feedback", "Not formally evaluated"]}
      values={(data.s4_q1 || "").split("|||").filter(Boolean)}
      onChange={(v) => onChange("s4_q1", v.join("|||"))}
      showError={showErrors}
    />
    <RadioQuestion
      label="Are microlearning sessions used for safety awareness?"
      required
      options={["Regularly", "Occasionally", "Planned but not implemented", "Not used"]}
      value={data.s4_q2 || ""}
      onChange={(v) => onChange("s4_q2", v)}
      showError={showErrors}
    />
    <RadioQuestion
      label="Who usually reports safety observations?"
      required
      options={["Only safety team", "Mostly supervisors / managers", "All employees", "Employees and contractors", "Mostly management"]}
      value={data.s4_q3 || ""}
      onChange={(v) => onChange("s4_q3", v)}
      showError={showErrors}
    />
  </div>
);

export default Step4Training;

export const validateStep4 = (data: Record<string, string>) =>
  !!(data.s4_q0 && (data.s4_q1 || "").split("|||").filter(Boolean).length > 0 && data.s4_q2 && data.s4_q3);
