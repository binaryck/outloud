export const bitmapValidator = (input: string): string | null => {
  if (input.endsWith(".bitmap")) {
    const numberPart = input.slice(0, -7); // Remove ".bitmap" suffix

    // Check if the remaining part is only numbers
    if (!/^\d+$/.test(numberPart)) {
      return "Bitmap address must be a number followed by .bitmap";
    }

    const number = parseInt(numberPart, 10);

    // Check if number is between 0 and 900.000
    if (number < 0 || number > 900000) {
      return "Bitmap number must be between 0 and 900,000";
    }
  }

  return null;
};
