export const getLocal = key => {
    return JSON?.parse(localStorage.getItem(key));
  };
  export const setLocal = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  export const removeLocal = key => {
    localStorage.removeItem(key);
  };
  export const clearLocal = () => {
    localStorage.clear();
  };
  