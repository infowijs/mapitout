export const determineLanguage = () => {
  // First check if a language is set by the user
  if (window.localStorage && window.localStorage.userLanguage) {
    return window.localStorage.userLanguage;
  }

  // Determine default language on navigator.language - if that exists
  // Note: navigator.language can be undefined or nonexistent on IE<11, same goes for Array.includes...
  if (
    window.navigator.language &&
    ["nl", "nl-NL"].indexOf(window.navigator.language) >= 0
  ) {
    return "nl";
  }

  // Default to English
  return "en";
};

export const setLanguage = (language: string) => {
  // Store language in localStorage
  window.localStorage.userLanguage = language;

  // Reload page
  window.location.reload();
};
