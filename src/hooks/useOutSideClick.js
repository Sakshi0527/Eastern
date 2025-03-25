import { useEffect } from "react";

const useOutsideClick = (refs, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refs.every((ref) => ref.current && !ref.current.contains(event.target))) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
};

export default useOutsideClick;
