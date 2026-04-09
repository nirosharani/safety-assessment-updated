import RatingQuestion from "../RatingQuestion";

interface Props {
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
  showErrors: boolean;
}

const QUESTIONS = [
  "Safety procedures are followed even under operational pressure",
  "Risks are assessed before non-routine or high-risk tasks",
  "Safety performance is reviewed regularly using data",
  "Employees actively participate in identifying hazards and unsafe conditions",
];

const Step3Culture2 = ({ data, onChange, showErrors }: Props) => (
  <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
    <p className="text-sm text-muted-foreground mb-4">
      Rate each statement on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree)
    </p>
    {QUESTIONS.map((q, i) => (
      <RatingQuestion
        key={i}
        label={q}
        value={data[`s3_q${i}`] || ""}
        onChange={(v) => onChange(`s3_q${i}`, v)}
        showError={showErrors}
      />
    ))}
  </div>
);

export default Step3Culture2;

export const validateStep3 = (data: Record<string, string>) =>
  QUESTIONS.every((_, i) => !!data[`s3_q${i}`]);
