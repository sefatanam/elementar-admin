export function isValidHexColor(color: string): boolean {
  if (typeof color !== 'string' || !color) {
    return false;
  }

  const hexRegex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
  return hexRegex.test(color);
}
