import CheckboxQuestion from "../CheckboxQuestion";

interface Props {
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
  showErrors: boolean;
}

const Step5Incident = ({ data, onChange, showErrors }: Props) => (
  <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
    <CheckboxQuestion
      label="Which types of incidents or accidents have been encountered in the last 12 months?"
      options={["Near misses", "First-aid injuries", "Medical treatment injuries", "Lost-time injuries", "Property damage", "Vehicle incidents", "Environmental incidents", "No incidents"]}
      values={(data.s5_q0 || "").split("|||").filter(Boolean)}
      onChange={(v) => onChange("s5_q0", v.join("|||"))}
      showError={showErrors}
    />
    <CheckboxQuestion
      label="Which safety KPIs are currently tracked?"
      options={["Incident rates", "Near-miss reporting", "Training completion", "Corrective action closure", "Vehicle inspection compliance", "Driver behaviour metrics", "None formally tracked"]}
      values={(data.s5_q1 || "").split("|||").filter(Boolean)}
      onChange={(v) => onChange("s5_q1", v.join("|||"))}
      showError={showErrors}
    />
  </div>
);

export default Step5Incident;

export const validateStep5 = (data: Record<string, string>) =>
  (data.s5_q0 || "").split("|||").filter(Boolean).length > 0 &&
  (data.s5_q1 || "").split("|||").filter(Boolean).length > 0;
