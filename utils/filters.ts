import { item, logsType } from "../redux/itemsSlice";

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

export type SortValuesType = {
  sortValue: string;
  categories: number[];
  types: string[];
};
export function HomeFilter(
  filters: SortValuesType,
  array: item[] | item[][],
  is2D: boolean,
) {
  if (is2D) {
    let newArray: item[][] = array;
    for (let i in array) {
      switch (filters.sortValue) {
        case "LA":
          newArray = array;
          break;
        case "NA":
          newArray[i].sort((a, b) => {
            const nameA = a.name.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
            const nameB = b.name.toUpperCase();

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
          newArray[i].sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();

            if (nameA > nameB) {
              return -1;
            }
            if (nameA < nameB) {
              return 1;
            }
            return 0;
          });

          break;
        case "PDA":
          newArray[i].sort((a, b) => {
            if (a.purchaseDate < b.purchaseDate) {
              return -1;
            }
            if (a.purchaseDate > b.purchaseDate) {
              return 1;
            }
            return 0;
          });

          break;
        case "PDD":
          newArray[i].sort((a, b) => {
            if (a.purchaseDate > b.purchaseDate) {
              return -1;
            }
            if (a.purchaseDate < b.purchaseDate) {
              return 1;
            }
            return 0;
          });
          break;
      }

      if (filters.categories.length > 0) {
        newArray = newArray.filter((item) =>
          filters.categories.includes(item.category),
        );
      }

      if (filters.types.length > 0) {
        newArray = newArray.filter((item) => filters.types.includes(item.type));
      }
    }
    return newArray;
  } else {
    let newArray: item[] = array;
    switch (filters.sortValue) {
      case "LA":
        break;
      case "NA":
        newArray.sort((a, b) => {
          const nameA = a.name.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
          const nameB = b.name.toUpperCase();

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
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();

          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        });

        break;
      case "PDA":
        newArray.sort((a, b) => {
          if (a.purchaseDate < b.purchaseDate) {
            return -1;
          }
          if (a.purchaseDate > b.purchaseDate) {
            return 1;
          }
          return 0;
        });

        break;
      case "PDD":
        newArray.sort((a, b) => {
          if (a.purchaseDate > b.purchaseDate) {
            return -1;
          }
          if (a.purchaseDate < b.purchaseDate) {
            return 1;
          }
          return 0;
        });
        break;
    }

    if (filters.categories.length > 0) {
      newArray = newArray.filter((item) =>
        filters.categories.includes(item.category),
      );
    }

    if (filters.types.length > 0) {
      newArray = newArray.filter((item) => filters.types.includes(item.type));
    }
    return newArray;
  }
}
