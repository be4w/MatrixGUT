export const gutCriteria = {
  gravity: {
    1: "No apparent gravity",
    2: "Slightly grave",
    3: "Grave", 
    4: "Very grave",
    5: "Extremely grave"
  },
  urgency: {
    1: "No hurry",
    2: "Can wait a little",
    3: "As soon as possible",
    4: "With some urgency", 
    5: "Requires immediate action"
  },
  tendency: {
    1: "Will not worsen",
    2: "Will worsen in the long term",
    3: "Will worsen in the medium term",
    4: "Will worsen in the short term",
    5: "Will worsen rapidly"
  }
};

export const calculatePriority = (gravity: number, urgency: number, tendency: number) => {
  return gravity * urgency * tendency;
};
