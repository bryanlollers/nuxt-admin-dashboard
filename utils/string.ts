/** Creates uppercase initials from a name, using up to maxParts words. */
export function getInitials(name: string, maxParts = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxParts)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
