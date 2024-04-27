export const calculateViewPadding = (screenWidth: number) => {
  const boxWidth = 64; // Width of each box
  const boxPadding = 8; // Padding on each side of the box (left & right)
  const availableSpace = screenWidth - boxWidth; // Space available excluding one box
  const totalPaddingPerBox = boxPadding * 2; // Total padding for one box (left & right)
  const numberOfBoxesInRow = Math.floor(
    availableSpace / (boxWidth + totalPaddingPerBox),
  ); // Number of boxes that fit in a row

  // Calculate remaining space after fitting boxes
  const remainingSpace =
    availableSpace - numberOfBoxesInRow * (boxWidth + totalPaddingPerBox);

  // Calculate padding for the view to distribute remaining space equally
  const viewPadding = remainingSpace / 2;

  return viewPadding;
};
