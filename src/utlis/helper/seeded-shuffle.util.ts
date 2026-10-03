/**
 * Linear Congruential Generator (LCG) based pseudo-random generator
 */
export function createSeededRandom(seedStr: string) {
  let h = 0;
  const str = String(seedStr);
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  let randomVal = Math.abs(h);

  return function () {
    randomVal = (randomVal * 9301 + 49297) % 233280;
    return randomVal / 233280;
  };
}

/**
 * Shuffles an array using a seeded random generator (Fisher-Yates)
 */
export function seededShuffle<T>(array: T[], seed: string): T[] {
  const random = createSeededRandom(seed);
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

interface LocationPriorityOptions {
  studentLocation?: {
    thana?: string;
    upazila?: string;
    district?: string;
  };
  useLocationBased?: boolean;
}

/**
 * Shuffles and prioritizes data based on location matches and seeded random shuffle
 */
export function shuffleAndPrioritizeData<T>(
  data: T[],
  seed: string,
  options?: LocationPriorityOptions,
): T[] {
  const { studentLocation, useLocationBased = false } = options || {};

  if (!useLocationBased || !studentLocation) {
    return seededShuffle(data, seed);
  }

  const { thana, upazila, district } = studentLocation;

  if (!thana && !upazila && !district) {
    return seededShuffle(data, seed);
  }

  const thanaMatches: T[] = [];
  const upazilaMatches: T[] = [];
  const districtMatches: T[] = [];
  const otherMatches: T[] = [];

  data.forEach((item: any) => {
    // Check for populated location _id string or plain string code comparison
    const itemThana =
      item.thana && typeof item.thana === 'object'
        ? (item.thana._id || item.thana.code || '').toString()
        : (item.thana || '').toString();

    const itemUpazila =
      item.upazila && typeof item.upazila === 'object'
        ? (item.upazila._id || item.upazila.code || '').toString()
        : (item.upazila || '').toString();

    const itemDistrict =
      item.district && typeof item.district === 'object'
        ? (item.district._id || item.district.code || '').toString()
        : (item.district || '').toString();

    if (thana && itemThana === thana.toString()) {
      thanaMatches.push(item);
    } else if (upazila && itemUpazila === upazila.toString()) {
      upazilaMatches.push(item);
    } else if (district && itemDistrict === district.toString()) {
      districtMatches.push(item);
    } else {
      otherMatches.push(item);
    }
  });

  const shuffledThana = seededShuffle(thanaMatches, seed + '-thana');
  const shuffledUpazila = seededShuffle(upazilaMatches, seed + '-upazila');
  const shuffledDistrict = seededShuffle(districtMatches, seed + '-district');
  const shuffledOthers = seededShuffle(otherMatches, seed + '-others');

  return [
    ...shuffledThana,
    ...shuffledUpazila,
    ...shuffledDistrict,
    ...shuffledOthers,
  ];
}
