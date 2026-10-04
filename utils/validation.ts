/** Checks whether a trimmed value has a basic email address format. */
export function isValidEmail(value: string): boolean {
  return /^\S+@\S+\.\S+$/.test(value.trim())
}
