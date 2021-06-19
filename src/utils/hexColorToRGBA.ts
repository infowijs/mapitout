export function hexColorToRGBA(color: string, opacity: number = 1) {
  if (opacity > 1 || opacity < 0) {
    throw new Error("The opacity value must be a value between 0 and 1");
  }
  color = color[0] === "#" ? color.slice(1) : color;

  if ((color.length < 6 && color.length !== 3) || color.length > 6) {
    throw new Error(
      "The provided hex color is invalid, it should be of either 3 or 6 characters in length " +
        "(excluding the (optional) prefixed hash)"
    );
  }

  color = color.length === 3 ? color + color : color;

  const num = parseInt(color, 16);

  const r = num >> 16;
  const g = (num >> 8) & 0x00ff;
  const b = num & 0x0000ff;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
