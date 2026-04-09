import RatingQuestion from "../RatingQuestion";

interface Props {
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
  showErrors: boolean;
}

const QUESTIONS = [
  "Safety is visibly prioritized by leadership",
  "Employees feel safe reporting near-misses",
  "Incidents are investigated beyond surface causes",
  "Learnings from incidents are shared across teams",
];

const Step2Culture1 = ({ data, onChange, showErrors }: Props) => (
  <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
    <p className="text-sm text-muted-foreground mb-4">
      Rate each statement on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree)
    </p>
    {QUESTIONS.map((q, i) => (
      <RatingQuestion
        key={i}
        label={q}
        value={data[`s2_q${i}`] || ""}
        onChange={(v) => onChange(`s2_q${i}`, v)}
        showError={showErrors}
      />
    ))}
  </div>
);

export default Step2Culture1;

export const validateStep2 = (data: Record<string, string>) =>
  QUESTIONS.every((_, i) => !!data[`s2_q${i}`]);
