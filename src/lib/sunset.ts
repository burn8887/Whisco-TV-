/**
 * Sunset for Bahrain, to about a minute. NOAA's simplified algorithm.
 *
 * Why here and not a library: it is ~25 lines, it is the only astronomy this
 * product needs, and a dependency for one sunset would be a dependency
 * forever. Fixed coordinates are correct — the brand is a Bahrain household.
 */
const LAT = 26.2285;
const LON = 50.586;

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

export function sunsetBahrain(now: Date): Date {
  const start = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dayOfYear = Math.floor((start - Date.UTC(now.getUTCFullYear(), 0, 0)) / 86400000);

  const lngHour = LON / 15;
  // 18 = sunset (6 = sunrise) in NOAA's convention
  const t = dayOfYear + (18 - lngHour) / 24;

  const M = 0.9856 * t - 3.289;
  let L = M + 1.916 * Math.sin(M * RAD) + 0.020 * Math.sin(2 * M * RAD) + 282.634;
  L = ((L % 360) + 360) % 360;

  let RA = Math.atan(0.91764 * Math.tan(L * RAD)) * DEG;
  RA = ((RA % 360) + 360) % 360;

  // right ascension must sit in the same quadrant as the ecliptic longitude
  const Lquadrant = Math.floor(L / 90) * 90;
  const RAquadrant = Math.floor(RA / 90) * 90;
  RA = (RA + (Lquadrant - RAquadrant)) / 15;

  const sinDec = 0.39782 * Math.sin(L * RAD);
  const cosDec = Math.cos(Math.asin(sinDec));

  const zenith = 90.833 * RAD; // official sunset: 90°50', not 90°
  const cosH = (Math.cos(zenith) - sinDec * Math.sin(LAT * RAD)) / (cosDec * Math.cos(LAT * RAD));
  if (cosH > 1) return new Date(start); // sun never rises (not Bahrain, but be honest)
  if (cosH < -1) return new Date(start + 86400000);

  const H = Math.acos(cosH) * DEG / 15;
  const T = H + RA - 0.06571 * t - 6.622;
  const UT = ((T - lngHour) % 24 + 24) % 24;

  return new Date(start + UT * 3600000);
}

export const MAGHRIB_WINDOW_MINUTES = 90;

/** True from sunset until 90 minutes after it. */
export function isMaghrib(now: Date): boolean {
  const elapsed = now.getTime() - sunsetBahrain(now).getTime();
  return elapsed >= 0 && elapsed <= MAGHRIB_WINDOW_MINUTES * 60000;
}
