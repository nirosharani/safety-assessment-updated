import RadioQuestion from "../RadioQuestion";
import { OrgProfile } from "../AssessmentData";

interface Props {
  data: OrgProfile;
  onChange: (partial: Partial<OrgProfile>) => void;
  showErrors: boolean;
}

const Step1OrgProfile = ({ data, onChange, showErrors }: Props) => (
  <div className="border rounded-lg overflow-hidden">
    <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base">
      Organization Profile
    </div>
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
      <div className="space-y-2">
        <p className="font-medium text-sm">
          Company Name <span className="text-destructive">*</span>
        </p>
        <input
          type="text"
          placeholder="Enter your company name"
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {showErrors && !data.companyName.trim() && (
          <p className="text-destructive text-xs">This field is required</p>
        )}
      </div>
      <RadioQuestion
        label="Industry"
        required
        options={["Manufacturing", "Construction", "Logistics/Transport", "Oil and Gas", "Utilities", "Warehousing", "Facility Management", "Other"]}
        value={data.industry}
        onChange={(v) => onChange({ industry: v })}
        showError={showErrors}
      />
      <RadioQuestion
        label="Number of Employees"
        required
        options={["Less than 100", "100 - 500", "500 - 1000", "1000 - 5000", "More than 5000"]}
        value={data.employees}
        onChange={(v) => onChange({ employees: v })}
        showError={showErrors}
      />
      <div className="space-y-2">
        <p className="font-medium text-sm">Number of operational sites / branches</p>
        <input
          type="text"
          placeholder="Enter number"
          value={data.sites}
          onChange={(e) => onChange({ sites: e.target.value })}
          className="w-full border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <RadioQuestion
        label="Respondent designation"
        required
        options={["Safety Head / HSE Manager", "Operations Manager", "Plant / Site Manager", "HR / L&D", "Business Head", "Safety Officer / Engineer", "Other"]}
        value={data.designation}
        onChange={(v) => onChange({ designation: v })}
        showError={showErrors}
      />
      <RadioQuestion
        label="Does your organization operate vehicles as part of business operations?"
        required
        options={["Yes", "No"]}
        value={data.vehicles}
        onChange={(v) => onChange({ vehicles: v })}
        showError={showErrors}
      />
    </div>
  </div>
);

export default Step1OrgProfile;
