import CheckboxQuestion from "../CheckboxQuestion";

interface Props {
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
  showErrors: boolean;
}

const Step7OpenInputs = ({ data, onChange, showErrors }: Props) => (
  <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
    <div className="space-y-2">
      <p className="font-medium text-sm">
        What are the top 3 safety challenges your organization is facing today?{" "}
        <span className="text-destructive">*</span>
      </p>
      <textarea
        placeholder="Your answer"
        value={data.s7_q0 || ""}
        onChange={(e) => onChange("s7_q0", e.target.value)}
        className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
      />
      {showErrors && !(data.s7_q0 || "").trim() && (
        <p className="text-destructive text-xs">This field is required</p>
      )}
    </div>
    <CheckboxQuestion
      label="What safety improvement area is your organization prioritizing most this year?"
      options={["Training and competency", "Incident reduction", "Behaviour-based safety", "Corrective action closure", "Digitalization / dashboards", "AI-based safety improvement", "Driver / vehicle safety"]}
      values={(data.s7_q1 || "").split("|||").filter(Boolean)}
      onChange={(v) => onChange("s7_q1", v.join("|||"))}
      showError={showErrors}
    />
  </div>
);

export default Step7OpenInputs;

export const validateStep7 = (data: Record<string, string>) =>
  !!(data.s7_q0 || "").trim() &&
  (data.s7_q1 || "").split("|||").filter(Boolean).length > 0;
