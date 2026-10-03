/**
 * Builds a search filter using $and of word matches or simple $or matches against the specified fields.
 */
export function buildSearchFilter(
  search?: string,
  fields: string[] = [],
  options: { splitWords?: boolean } = {},
): any {
  if (!search || fields.length === 0) {
    return {};
  }

  const { splitWords = true } = options;

  if (splitWords) {
    const words = search.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return {};
    }
    return {
      $and: words.map((word) => {
        const wordRegex = { $regex: word, $options: 'i' };
        return {
          $or: fields.map((field) => ({ [field]: wordRegex })),
        };
      }),
    };
  } else {
    const wordRegex = { $regex: search, $options: 'i' };
    return {
      $or: fields.map((field) => ({ [field]: wordRegex })),
    };
  }
}

/**
 * Builds location filters (district, upazila, thana)
 */
export function buildLocationFilter(locationQuery: {
  district?: string;
  upazila?: string;
  thana?: string;
}): any {
  const filter: any = {};
  const { district, upazila, thana } = locationQuery;
  if (district) filter.district = district;
  if (upazila) filter.upazila = upazila;
  if (thana) filter.thana = thana;
  return filter;
}

/**
 * Merges search filter and location filter into a single query object
 */
export function buildQueryFilter(
  query: { search?: string; district?: string; upazila?: string; thana?: string },
  searchFields: string[],
  options: { splitWords?: boolean } = {},
): any {
  const locationFilter = buildLocationFilter(query);
  const searchFilter = buildSearchFilter(query.search, searchFields, options);

  return {
    ...locationFilter,
    ...searchFilter,
  };
}
