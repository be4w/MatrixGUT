export const gutCriteria = {
  impact: {
    1: "No impact - Minimal, insignificant damage",
    2: "Low impact - Minor but noticeable damage",
    3: "Moderate impact - Regular damage, medium effect",
    4: "High impact - Major damage, but reversible",
    5: "Extreme impact - Severe, potentially irreversible damage",
  },
  urgency: {
    1: "No hurry",
    2: "Can wait a little",
    3: "As soon as possible",
    4: "With some urgency",
    5: "Requires immediate action",
  },
  tendency: {
    1: "Will not worsen",
    2: "Will worsen in the long term",
    3: "Will worsen in the medium term",
    4: "Will worsen in the short term",
    5: "Will worsen rapidly",
  },
};

export const calculatePriority = (
  impact: number,
  urgency: number,
  tendency: number
) => {
  return impact * urgency * tendency;
};
