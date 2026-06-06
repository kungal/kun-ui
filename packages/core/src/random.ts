// Generate a random integer within an inclusive [lower, upper] range.
export const randomNum = (lowerValue: number, upperValue: number): number =>
  Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue)
