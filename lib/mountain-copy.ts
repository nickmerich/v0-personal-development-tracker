const motivationalMessages = [
  "Every great build starts with a single step",
  "Your building journey is underway",
  "Building something great takes time",
  "Every habit is a building block",
  "You're constructing your best life",
  "Building momentum, one day at a time",
]

export function getRandomMotivationalMessage(): string {
  const index = Math.floor(Math.random() * motivationalMessages.length)
  return motivationalMessages[index]
}

export function buildingCopy(input: string): string {
  // This is a placeholder function.  In a real application, this function
  // would perform some kind of build on the input string.
  return `Building: ${input} - ${getRandomMotivationalMessage()}`
}
