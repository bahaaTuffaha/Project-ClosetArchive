import { item, logsType } from "../redux/itemsSlice";

function desc(array: any[], sub: string) {
  array.sort((a, b) => {
    if (a[`${sub}`] > b[`${sub}`]) {
      return -1;
    }
    if (a[`${sub}`] < b[`${sub}`]) {
      return 1;
    }
    return 0;
  });
}
function asc(array: any[], sub: string) {
  array.sort((a, b) => {
    if (a[`${sub}`] < b[`${sub}`]) {
      return -1;
    }
    if (a[`${sub}`] > b[`${sub}`]) {
      return 1;
    }
    return 0;
  });
}

function nameAsc(array: any[], sub: string) {
  array.sort((a, b) => {
    const nameA = a[`${sub}`].toUpperCase(); // Convert names to uppercase for case-insensitive sorting
    const nameB = b[`${sub}`].toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}
function nameDesc(array: any[], sub: string) {
  array.sort((a, b) => {
    const nameA = a[`${sub}`].toUpperCase();
    const nameB = b[`${sub}`].toUpperCase();

    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
  });
}

export function LogFilter(
  sortValue: string,
  array: logsType[],
  search: string,
) {
  let newArray = array.filter((x) =>
    x.eventName.toLowerCase().includes(search.toLowerCase()),
  );
  switch (sortValue) {
    //lastAdded
    case "LA":
      desc(newArray, "logTime");
      break;
    case "NA":
      nameAsc(newArray, "eventName");
      break;
    case "ND":
      nameDesc(newArray, "eventName");
      break;
    case "DA":
      asc(newArray, "eventDate");
      break;
    case "DD":
      desc(newArray, "eventDate");
      break;
  }
  return newArray;
}

export type SortValuesType = {
  sortValue: string;
  categories: number[];
  types: string[];
  season: string;
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
          nameAsc(newArray[i], "name");
          break;
        case "ND":
          nameDesc(newArray[i], "name");
          break;
        case "PDA":
          asc(newArray[i], "purchaseDate");
          break;
        case "PDD":
          desc(newArray[i], "purchaseDate");
          break;
      }

      if (filters.categories.length > 0) {
        newArray[i] = newArray[i].filter((item) =>
          filters.categories.includes(item.category),
        );
      }

      if (filters.types.length > 0) {
        newArray[i] = newArray[i].filter((item) =>
          filters.types.includes(item.type),
        );
      }
      if (filters.season != "") {
        newArray[i] = newArray[i].filter(
          (item) => filters.season == item.season,
        );
      }
    }
    return newArray;
  } else {
    let newArray: item[] = array;
    switch (filters.sortValue) {
      case "LA":
        break;
      case "NA":
        nameAsc(newArray, "name");
        break;
      case "ND":
        nameDesc(newArray, "name");
        break;
      case "PDA":
        asc(newArray, "purchaseDate");
        break;
      case "PDD":
        desc(newArray, "purchaseDate");
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
    if (filters.season != "") {
      newArray = newArray.filter((item) => filters.season == item.season);
    }
    return newArray;
  }
}
