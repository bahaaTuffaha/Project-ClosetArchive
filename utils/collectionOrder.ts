export const COLLECTION_SORT_VALUES = {
  CUSTOM: "CUSTOM",
  NAME_ASC: "NA",
  NAME_DESC: "ND",
} as const;

export type CollectionSortValue =
  (typeof COLLECTION_SORT_VALUES)[keyof typeof COLLECTION_SORT_VALUES];

type CollectionLike = {
  label?: string;
  value?: string;
  color?: string;
  isOpen?: boolean;
  arrangement?: number;
  [key: string]: unknown;
};

const compareCollectionLabels = (a: CollectionLike, b: CollectionLike) => {
  return (a.label ?? a.value ?? "").localeCompare(b.label ?? b.value ?? "", undefined, {
    sensitivity: "base",
  });
};

export const normalizeCollectionTags = <T extends CollectionLike>(collections: T[] = []) => {
  const safeCollections = Array.isArray(collections) ? collections : [];
  const shouldFallbackToAlphabetical = safeCollections.some(
    collection =>
      typeof collection.arrangement !== "number" ||
      !Number.isFinite(collection.arrangement),
  );

  const orderedCollections = shouldFallbackToAlphabetical
    ? [...safeCollections].sort(compareCollectionLabels)
    : [...safeCollections].sort(
        (a, b) =>
          (a.arrangement ?? 0) - (b.arrangement ?? 0) ||
          compareCollectionLabels(a, b),
      );

  return orderedCollections.map((collection, index) => ({
    ...collection,
    label: collection.label ?? collection.value ?? "",
    value: collection.value ?? collection.label ?? `collection-${index}`,
    isOpen: collection.isOpen ?? true,
    arrangement: index,
  }));
};

export const getOrderedCollectionTags = <T extends CollectionLike>(
  collections: T[] = [],
  sortValue: CollectionSortValue = COLLECTION_SORT_VALUES.CUSTOM,
) => {
  const normalizedCollections = normalizeCollectionTags(collections);

  switch (sortValue) {
    case COLLECTION_SORT_VALUES.NAME_ASC:
      return [...normalizedCollections].sort(compareCollectionLabels);
    case COLLECTION_SORT_VALUES.NAME_DESC:
      return [...normalizedCollections].sort(
        (a, b) => compareCollectionLabels(b, a),
      );
    default:
      return normalizedCollections;
  }
};

export const getCollectionSortValue = (
  sortValue: CollectionSortValue | null | undefined,
) => {
  return sortValue ?? COLLECTION_SORT_VALUES.CUSTOM;
};

export const moveCollectionTag = <T extends CollectionLike>(
  collections: T[] = [],
  value: string,
  direction: "up" | "down",
) => {
  const normalizedCollections = normalizeCollectionTags(collections);
  const currentIndex = normalizedCollections.findIndex(
    collection => collection.value === value,
  );

  if (currentIndex < 0) {
    return normalizedCollections;
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= normalizedCollections.length) {
    return normalizedCollections;
  }

  const reorderedCollections = [...normalizedCollections];
  const [movedCollection] = reorderedCollections.splice(currentIndex, 1);
  reorderedCollections.splice(targetIndex, 0, movedCollection);

  return reorderedCollections.map((collection, index) => ({
    ...collection,
    arrangement: index,
  }));
};