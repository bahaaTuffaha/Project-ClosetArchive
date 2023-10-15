import { logsType } from "../redux/itemsSlice";

export function LogFilter(
  sortValue: string,
  array: logsType[],
  search: string,
) {
  let newArray = array.filter((x) =>
    x.eventName.toLowerCase().includes(search.toLowerCase()),
  );
  switch (sortValue) {
    case "LA":
      newArray.sort((a, b) => {
        if (a.logTime > b.logTime) {
          return -1;
        }
        if (a.logTime < b.logTime) {
          return 1;
        }
        return 0;
      });
      break;
    case "NA":
      newArray.sort((a, b) => {
        const nameA = a.eventName.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
        const nameB = b.eventName.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      break;
    case "ND":
      newArray.sort((a, b) => {
        const nameA = a.eventName.toUpperCase();
        const nameB = b.eventName.toUpperCase();

        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        return 0;
      });

      break;
    case "DA":
      newArray.sort((a, b) => {
        if (a.eventDate < b.eventDate) {
          return -1;
        }
        if (a.eventDate > b.eventDate) {
          return 1;
        }
        return 0;
      });

      break;
    case "DD":
      newArray.sort((a, b) => {
        if (a.eventDate > b.eventDate) {
          return -1;
        }
        if (a.eventDate < b.eventDate) {
          return 1;
        }
        return 0;
      });
      break;
  }
  return newArray;
}

export function HomeFilter(
  sortValues: string[],
  array: logsType[],
  search: string,
) {
  let newArray = array.filter((x) =>
    x.eventName.toLowerCase().includes(search.toLowerCase()),
  );

  if (sortValues.includes("LA")) {
    newArray.sort((a, b) => {
      if (a.logTime > b.logTime) {
        return -1;
      }
      if (a.logTime < b.logTime) {
        return 1;
      }
      return 0;
    });
  }
  if (sortValues.includes("NA")) {
    newArray.sort((a, b) => {
      const nameA = a.eventName.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
      const nameB = b.eventName.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  if (sortValues.includes("ND")) {
    newArray.sort((a, b) => {
      const nameA = a.eventName.toUpperCase();
      const nameB = b.eventName.toUpperCase();

      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
  }
  if (sortValues.includes("DA")) {
    newArray.sort((a, b) => {
      if (a.eventDate < b.eventDate) {
        return -1;
      }
      if (a.eventDate > b.eventDate) {
        return 1;
      }
      return 0;
    });
  }
  if (sortValues.includes("DD")) {
    newArray.sort((a, b) => {
      if (a.eventDate > b.eventDate) {
        return -1;
      }
      if (a.eventDate < b.eventDate) {
        return 1;
      }
      return 0;
    });
  }
  return newArray;
}
