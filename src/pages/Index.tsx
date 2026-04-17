import { useState } from "react";
import Header from "@/components/assessment/Header";
import Footer from "@/components/assessment/Footer";
import StepIndicator from "@/components/assessment/StepIndicator";
import ScoreResult from "@/components/assessment/ScoreResult";
import { SECTION_LABELS, INITIAL_ORG_PROFILE, OrgProfile } from "@/components/assessment/AssessmentData";
import { calculateScoring } from "@/components/assessment/ScoringLogic";
import Step1OrgProfile from "@/components/assessment/steps/Step1OrgProfile";
import Step2Culture1, { validateStep2 } from "@/components/assessment/steps/Step2Culture1";
import Step3Culture2, { validateStep3 } from "@/components/assessment/steps/Step3Culture2";
import Step4Training, { validateStep4 } from "@/components/assessment/steps/Step4Training";
import Step5Incident, { validateStep5 } from "@/components/assessment/steps/Step5Incident";
import Step6Technology, { validateStep6 } from "@/components/assessment/steps/Step6Technology";
import Step7OpenInputs, { validateStep7 } from "@/components/assessment/steps/Step7OpenInputs";
import Step8Summary from "@/components/assessment/steps/Step8Summary";

const validateStep1 = (data: OrgProfile) =>
  !!(data.companyName.trim() && data.industry && data.employees && data.designation && data.vehicles);

const Index = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [orgData, setOrgData] = useState<OrgProfile>(INITIAL_ORG_PROFILE);
  const [stepData, setStepData] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  const scoringResult = calculateScoring(stepData);

  const validateCurrentStep = (): boolean => {
    switch (step) {
      case 1: return validateStep1(orgData);
      case 2: return validateStep2(stepData);
      case 3: return validateStep3(stepData);
      case 4: return validateStep4(stepData);
      case 5: return validateStep5(stepData);
      case 6: return validateStep6(stepData);
      case 7: return validateStep7(stepData);
      case 8: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (step < 8) setStep(step + 1);
  };

  const handlePrev = () => {
    setShowErrors(false);
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // No API key needed!
  },
      body: JSON.stringify({

        // Section 1
        section1_org_profile: {
          companyName: orgData.companyName,
          industry: orgData.industry,
          employees: orgData.employees,
          sites: orgData.sites,
          designation: orgData.designation,
          vehicles: orgData.vehicles,
        },

        // Sections 2-3
        section2_3_culture_leadership: {
          safety_prioritized_by_leadership: stepData.culture_safety_prioritized_by_leadership,
          employees_report_near_misses: stepData.culture_employees_report_near_misses,
          incidents_investigated: stepData.culture_incidents_investigated,
          learnings_shared: stepData.culture_learnings_shared,
          procedures_followed_under_pressure: stepData.culture_procedures_followed_under_pressure,
          risks_assessed_before_tasks: stepData.culture_risks_assessed_before_tasks,
          safety_reviewed_with_data: stepData.culture_safety_reviewed_with_data,
          employees_identify_hazards: stepData.culture_employees_identify_hazards,
        },

        // Section 4
        section4_training_competency: {
          frequency: stepData.training_frequency,
          effectiveness_methods: (stepData.training_effectiveness_methods || "").split("|||").filter(Boolean),
          microlearning_used: stepData.training_microlearning_used,
          who_reports_observations: stepData.training_who_reports_observations,
        },

        // Section 5
        section5_incident_management: {
          types_last_12_months: (stepData.incident_types_last_12_months || "").split("|||").filter(Boolean),
          kpis_tracked: (stepData.incident_kpis_tracked || "").split("|||").filter(Boolean),
        },

        // Section 6
        section6_technology_ai: {
          ai_currently_used: stepData.tech_ai_currently_used,
          vehicle_inspections: stepData.tech_vehicle_inspections,
        },

        // Section 7
        section7_open_inputs: {
          top_safety_challenges: stepData.open_top_safety_challenges,
          safety_improvement_priority: (stepData.open_safety_improvement_priority || "").split("|||").filter(Boolean),
        },

        // Scoring Results
        scoring_results: {
          overall_score: scoringResult.overall,
          maturity_level: scoringResult.maturityLevel,
          maturity_label: scoringResult.maturityLabel,
          categories: scoringResult.categories,
        }

      })
    });

    if (response.ok) {
      console.log("Data sent successfully!");
      setSubmitted(true); // show results page
    } else {
      console.error("API error:", response.status);
      setSubmitted(true); // still show results even if API fails
    }

  } catch (error) {
    console.error("Failed to connect:", error);
    setSubmitted(true); // still show results even if API fails
  }
};
  const handleStepDataChange = (key: string, val: string) => {
    setStepData((prev) => ({ ...prev, [key]: val }));
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-4 sm:py-6 md:py-8">
          <ScoreResult result={scoringResult} companyName={orgData.companyName} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 md:mb-3">
            Safety Intelligence Framework
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            This assessment is intended to understand the current maturity of your organization's safety culture, systems, training practices, incident management, and safety intelligence capabilities. Your responses will help identify strengths, gaps, and improvement opportunities.
          </p>
          <p className="text-destructive text-xs sm:text-sm mt-2 md:mt-3">
            * Indicates required question
          </p>
        </div>

        <StepIndicator currentStep={step} totalSteps={8} stepLabels={SECTION_LABELS} />

        {step === 1 && (
          <Step1OrgProfile
            data={orgData}
            onChange={(partial) => setOrgData((prev) => ({ ...prev, ...partial }))}
            showErrors={showErrors}
          />
        )}

        {step >= 2 && step <= 7 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base">
              {SECTION_LABELS[step - 1]}
            </div>
            {step === 2 && <Step2Culture1 data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
            {step === 3 && <Step3Culture2 data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
            {step === 4 && <Step4Training data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
            {step === 5 && <Step5Incident data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
            {step === 6 && <Step6Technology data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
            {step === 7 && <Step7OpenInputs data={stepData} onChange={handleStepDataChange} showErrors={showErrors} />}
          </div>
        )}

        {step === 8 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-sm sm:text-base">
              {SECTION_LABELS[7]}
            </div>
            <Step8Summary />
          </div>
        )}

        <div className="flex justify-between mt-4 sm:mt-6">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="px-4 sm:px-6 py-2 rounded font-medium text-xs sm:text-sm border border-input hover:bg-muted"
            >
              Previous
            </button>
          ) : (
            <div />
          )}
          {step < 8 ? (
            <button
              onClick={handleNext}
              className="px-4 sm:px-6 py-2 rounded font-medium text-xs sm:text-sm bg-next-btn text-accent-foreground hover:opacity-90"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 sm:px-6 py-2 rounded font-medium text-xs sm:text-sm bg-next-btn text-accent-foreground hover:opacity-90"
            >
              Submit
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
