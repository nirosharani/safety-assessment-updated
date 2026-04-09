import { Progress } from "@/components/ui/progress";

const getScoreInfo = (score: number) => {
  if (score >= 80)
    return {
      label: "Excellent",
      color: "text-green-600",
      message:
        "Your organization demonstrates a strong safety culture with mature systems in place. Continue refining your approach and leveraging advanced analytics to stay ahead.",
    };
  if (score >= 60)
    return {
      label: "Good",
      color: "text-blue-600",
      message:
        "Your organization has a solid safety foundation with room for improvement. Focus on closing gaps in incident management and adopting data-driven safety practices.",
    };
  if (score >= 40)
    return {
      label: "Developing",
      color: "text-yellow-600",
      message:
        "Your safety practices are developing but need attention. Prioritize leadership engagement, regular training, and establishing consistent incident reporting processes.",
    };
  return {
    label: "Needs Improvement",
    color: "text-red-600",
    message:
      "Your organization needs significant safety improvements. We recommend starting with foundational safety training, leadership commitment, and basic incident tracking systems.",
  };
};

interface Props {
  score: number;
}

const ScoreResult = ({ score }: Props) => {
  const info = getScoreInfo(score);

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-primary text-primary-foreground px-4 sm:px-6 py-3 font-medium text-sm sm:text-base text-center">
          Safety Intelligence Score
        </div>
        <div className="p-6 sm:p-10 space-y-6 sm:space-y-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 140 140"
              >
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="10"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 377} 377`}
                  className={info.color}
                />
              </svg>
              <div className="z-10 flex flex-col items-center">
                <span className="text-4xl sm:text-5xl font-bold">{score}</span>
                <span className="text-xs text-muted-foreground">out of 100</span>
              </div>
            </div>
            <span className={`text-lg sm:text-xl font-semibold ${info.color}`}>
              {info.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>100</span>
            </div>
            <Progress value={score} className="h-3" />
          </div>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {info.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="https://www.safetyconnect.io/get-a-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded font-medium text-sm bg-next-btn text-accent-foreground hover:opacity-90 inline-block"
            >
              Book a Demo Session
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreResult;
