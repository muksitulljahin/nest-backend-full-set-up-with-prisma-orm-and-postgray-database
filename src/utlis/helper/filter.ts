type InsensitiveContains = { contains: string; mode: 'insensitive' };

const containsInsensitive = (value: string): InsensitiveContains => ({
  contains: value,
  mode: 'insensitive',
});

/**
 * Builds a Prisma `where` search filter: AND of per-word matches, or a simple OR match against the specified fields.
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
      AND: words.map((word) => ({
        OR: fields.map((field) => ({ [field]: containsInsensitive(word) })),
      })),
    };
  } else {
    return {
      OR: fields.map((field) => ({ [field]: containsInsensitive(search) })),
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
 * Merges search filter and location filter into a single Prisma `where` object
 */
export function buildQueryFilter(
  query: {
    search?: string;
    district?: string;
    upazila?: string;
    thana?: string;
  },
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
