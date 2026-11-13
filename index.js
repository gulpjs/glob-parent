import path from "node:path";

import { Minimatch } from "minimatch";

const slash = "/";

/**
 * @param {string} str
 */
export default function globParent(str) {
  const mm = new Minimatch(str, { optimizationLevel: 0 });

  const longest = Math.max(...mm.set.map((segments) => segments.length));
  const segmentSets = Array.from({ length: longest }, () => new Set());

  const matchingSegments = [];
  for (const [idx, set] of segmentSets.entries()) {
    // Add the separator between the last segment and this segment
    // which ensures the path will have a trailing slash once we find
    // the glob magic
    if (idx !== 0) {
      matchingSegments.push(slash);
    }

    // Compare the same index from each minimatch set
    for (const segments of mm.set) {
      if (typeof segments[idx] === "string") {
        set.add(segments[idx]);
      }
    }

    // If there is not exactly 1 item, that means the patterns diverged
    if (set.size !== 1) {
      break;
    }

    matchingSegments.push(...set.values());
  }

  let matchedStr = matchingSegments.join("");

  // preserves full path in case of trailing path separator
  matchedStr += "a";

  // We have to use platform-dependent `path.dirname` because only the Windows
  // one knows how to handle drive letter roots (and presumably UNC volumes)
  // Luckily, if you provided it with a path using `/` as the path separators,
  // it does not change them, so our Minimatch iterator always uses that separator
  matchedStr = path.dirname(matchedStr);

  // remove last single dot
  if (matchedStr.endsWith("/.")) {
    matchedStr = matchedStr.slice(0, -1);
  }
  // remove last './'
  while (matchedStr.endsWith("/./")) {
    matchedStr = matchedStr.slice(0, -2);
  }
  // remove last '.' if only remaining is drive letter
  if (matchedStr.endsWith(":.")) {
    matchedStr = matchedStr.slice(0, -1);
  }
  // remove last './' if only remaining is drive letter
  if (matchedStr.endsWith(":./")) {
    matchedStr = matchedStr.slice(0, -2);
  }

  return matchedStr;
}
