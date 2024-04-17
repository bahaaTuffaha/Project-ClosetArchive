export const handleNumberChange = (
  func: any,
  text: string,
  min: number,
  max: number,
) => {
  // Use regular expressions to allow only numbers and optionally a single decimal point
  const regex = /^[0-9]*\.?[0-9]*$/;
  if (regex.test(text) && Number(text) >= min && Number(text) <= max) {
    func();
  }
};
