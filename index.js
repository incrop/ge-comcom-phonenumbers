import fetchValidPermissions from "./fetchValidPermissions.js"
import fetchRangesForPermissions from "./fetchRangesForPermissions.js"
import parseRanges from "./parseRanges.js"
import checkLibphonenumberRanges from "./checkLibphonenumberRanges.js"

const validPermissions = await fetchValidPermissions()
console.log("Valid permissions count:", validPermissions.length)

const permissionRanges = await fetchRangesForPermissions(validPermissions)
console.log("Allocated number ranges count:", Object.values(permissionRanges).reduce((count, ranges) => count + ranges.length, 0))

const parsedRanges = parseRanges(validPermissions, permissionRanges)
console.log("Parsed 9-digit number ranges count:", parsedRanges.length)
console.log("Ranges with numberCount provide:", parsedRanges.filter(range => range.numberCount).length)
console.log("Fully allocated ranges:", parsedRanges.filter(range => range.numberCount === range.to - range.from + 1).length)

checkLibphonenumberRanges(parsedRanges)