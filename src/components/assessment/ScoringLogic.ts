// Scoring logic per SafetyConnect Scoring Metrics doc v1.0

export interface CategoryScore {
  name: string;
  earned: number;
  max: number;
  percentage: number;
  status: string;
  color: string;
}

export interface ScoringResult {
  overall: number;
  maturityLevel: number;
  maturityLabel: string;
  maturityDescription: string;
  categories: CategoryScore[];
}

const STEP4_Q0_POINTS: Record<string, number> = {
  "Weekly": 5, "Monthly": 5, "Quarterly": 4, "Half-yearly": 3,
  "Annually": 2, "Only during induction": 1, "No regular training": 0,
};

const STEP4_Q1_POINTS: Record<string, number> = {
  "Post-training quiz or test": 2, "Supervisor observation": 2,
  "Incident / behaviour trend review": 2, "Employee feedback": 1,
  "Not formally evaluated": 0,
};

const STEP4_Q2_POINTS: Record<string, number> = {
  "Regularly": 5, "Occasionally": 3, "Planned but not implemented": 1, "Not used": 0,
};

const STEP4_Q3_POINTS: Record<string, number> = {
  "Only safety team": 1, "Mostly supervisors / managers": 2,
  "All employees": 5, "Employees and contractors": 5, "Mostly management": 2,
};

const STEP5_Q1_POINTS: Record<string, number> = {
  "Incident rates": 1, "Near-miss reporting": 1, "Training completion": 1,
  "Corrective action closure": 1, "Vehicle inspection compliance": 1,
  "Driver behaviour metrics": 1, "None formally tracked": 0,
};

const STEP6_Q0_POINTS: Record<string, number> = {
  "Yes, actively used": 5, "Under pilot / testing": 3, "Planned for future": 1, "No": 0,
};

const STEP6_Q1_POINTS: Record<string, number> = {
  "Yes, mandatory and documented": 5, "Yes, but informal": 3,
  "Only for selected vehicles": 2, "Planned but not implemented": 1, "No": 0, "Not Applicable": 0,
};

function getCheckboxValues(data: Record<string, string>, key: string): string[] {
  return (data[key] || "").split("|||").filter(Boolean);
}

function getCategoryStatus(pct: number): { status: string; color: string } {
  if (pct >= 80) return { status: "Strong", color: "#16A34A" };
  if (pct >= 60) return { status: "Developing", color: "#0E8A7A" };
  if (pct >= 40) return { status: "Emerging", color: "#D97706" };
  return { status: "At Risk", color: "#DC2626" };
}

function getMaturity(score: number): { level: number; label: string; description: string } {
  if (score >= 85) return { level: 5, label: "Optimising", description: "Safety is deeply embedded in culture. Continuous improvement, data-driven, AI-enabled." };
  if (score >= 70) return { level: 4, label: "Proactive", description: "Safety is prioritised and measured. Leaders drive culture. Risks managed proactively." };
  if (score >= 55) return { level: 3, label: "Developing", description: "Safety systems are in place but not fully embedded. Culture is improving." };
  if (score >= 35) return { level: 2, label: "Reactive", description: "Safety actions happen after incidents. Some processes exist but are inconsistently applied." };
  return { level: 1, label: "Lagging", description: "Safety is informal or reactive. Minimal systems in place. High risk of incidents." };
}

export function calculateScoring(data: Record<string, string>): ScoringResult {
  // --- Safety Culture & Leadership (Steps 2 & 3): 8 Likert × 5 = 40 max ---
  let cultureEarned = 0;
  for (let i = 0; i < 4; i++) {
    cultureEarned += parseInt(data[`s2_q${i}`] || "0", 10);
  }
  for (let i = 0; i < 4; i++) {
    cultureEarned += parseInt(data[`s3_q${i}`] || "0", 10);
  }
  const cultureMax = 40;

  // --- Training & Competency (Step 4): 20 max ---
  const t_q0 = STEP4_Q0_POINTS[data.s4_q0] ?? 0;
  const t_q1_vals = getCheckboxValues(data, "s4_q1");
  const t_q1_raw = t_q1_vals.reduce((sum, v) => sum + (STEP4_Q1_POINTS[v] ?? 0), 0);
  const t_q1 = Math.min(t_q1_raw, 5);
  const t_q2 = STEP4_Q2_POINTS[data.s4_q2] ?? 0;
  const t_q3 = STEP4_Q3_POINTS[data.s4_q3] ?? 0;
  const trainingEarned = t_q0 + t_q1 + t_q2 + t_q3;
  const trainingMax = 20;

  // --- Incident Management (Step 5): 10 max ---
  const i_q0_vals = getCheckboxValues(data, "s5_q0");
  const i_q0 = i_q0_vals.includes("No incidents") && i_q0_vals.length === 1 ? 5 : 0;
  const i_q1_vals = getCheckboxValues(data, "s5_q1");
  const i_q1_raw = i_q1_vals.reduce((sum, v) => sum + (STEP5_Q1_POINTS[v] ?? 0), 0);
  const i_q1 = Math.min(i_q1_raw, 5);
  const incidentEarned = i_q0 + i_q1;
  const incidentMax = 10;

  // --- Technology & AI (Step 6): 10 max ---
  const tech_q0 = STEP6_Q0_POINTS[data.s6_q0] ?? 0;
  const tech_q1 = STEP6_Q1_POINTS[data.s6_q1] ?? 0;
  const techEarned = tech_q0 + tech_q1;
  const techMax = 10;

  // --- Overall ---
  const totalEarned = cultureEarned + trainingEarned + incidentEarned + techEarned;
  const totalMax = 80;
  const overall = Math.round((totalEarned / totalMax) * 100);

  const maturity = getMaturity(overall);

  const buildCat = (name: string, earned: number, max: number): CategoryScore => {
    const pct = Math.round((earned / max) * 100);
    const { status, color } = getCategoryStatus(pct);
    return { name, earned, max, percentage: pct, status, color };
  };

  return {
    overall,
    maturityLevel: maturity.level,
    maturityLabel: maturity.label,
    maturityDescription: maturity.description,
    categories: [
      buildCat("Safety Culture & Leadership", cultureEarned, cultureMax),
      buildCat("Training & Competency", trainingEarned, trainingMax),
      buildCat("Incident Management", incidentEarned, incidentMax),
      buildCat("Technology & AI in Safety", techEarned, techMax),
    ],
  };
}
