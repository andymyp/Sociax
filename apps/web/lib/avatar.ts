const PRIMARY_NAME = ["A", "N", "H", "L", "Q", "9", "8"];
const INFO_NAME = ["F", "G", "T", "I", "J", "1", "2", "3"];
const SUCCESS_NAME = ["K", "D", "Y", "B", "O", "4", "5"];
const WARNING_NAME = ["P", "E", "R", "S", "C", "U", "6", "7"];
const ERROR_NAME = ["V", "W", "X", "M", "Z"];

export function fallbackAvatarName(name: string) {
  return name && name.charAt(0).toUpperCase();
}

export function fallbackAvatarColor(name: string) {
  if (PRIMARY_NAME.includes(fallbackAvatarName(name))) return "bg-violet-600";
  if (INFO_NAME.includes(fallbackAvatarName(name))) return "bg-blue-600";
  if (SUCCESS_NAME.includes(fallbackAvatarName(name))) return "bg-green-600";
  if (WARNING_NAME.includes(fallbackAvatarName(name))) return "bg-yellow-600";
  if (ERROR_NAME.includes(fallbackAvatarName(name))) return "bg-red-600";
  return "bg-violet-600";
}
