// in utils.js

export const capitialize = (str) => {
  // 👇 Add this guard clause
  // If the string is null, undefined, or empty, return an empty string safely.
  if (!str) return ""; 

  return str.charAt(0).toUpperCase() + str.slice(1);
};