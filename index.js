"use strict";

const os = require("node:os");
const path = require("node:path");

const { Minimatch } = require("minimatch");
const isWin32 = os.platform() === "win32";

const slash = "/";
const backslash = /\\/g;

/**
 * @param {string} str
 * @param {Object} opts
 * @param {boolean} [opts.flipBackslashes=true]
 */
module.exports = function globParent(str, opts) {
  const options = Object.assign({ flipBackslashes: true }, opts);

  // flip windows path separators
  if (options.flipBackslashes && isWin32 && !str.includes(slash)) {
    str = str.replace(backslash, slash);
  }

  const parsed = path.parse(str);

  const mm = new Minimatch(str, { magicalBraces: true, optimizationLevel: 0 });

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

  matchedStr = path.posix.dirname(matchedStr);

  // remove last single dot
  if (matchedStr.endsWith("/.")) {
    matchedStr = matchedStr.slice(0, -1);
  }
  // remove last './'
  while (matchedStr.endsWith("/./")) {
    matchedStr = matchedStr.slice(0, -2);
  }
  // remove last './' if only remaining is drive letter
  if (matchedStr.endsWith(":./")) {
    matchedStr = matchedStr.slice(0, -2);
  }

  // If the `matchedStr` is empty string, fallback to path root, if that is also empty, use `.`
  return matchedStr || parsed.root || ".";
};
