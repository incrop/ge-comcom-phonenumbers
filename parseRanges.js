const parseRangeString = (range) => {
  range = range.replaceAll(/\s/g, '')
  if (range.length < 9) {
    return null
  }
  // 1-6-1-0-0
  if (/^\d-\d-\d-\d-\d$/.test(range)) {
    return null
  }
  // 95300-95329
  if (/^[\dX]{5,8}-[\dX]{5,8}$/.test(range)) {
    return null
  }
  // 706040XXX-706044XXX
  {
    let match = /^([\dX]{9})[-\u2013]([\dX]{9}),?$/.exec(range)
    if (match) {
      return {
        from: parseInt(match[1].replaceAll('X', '0'), 10),
        to: parseInt(match[2].replaceAll('X', '9'), 10),
      }
    }
  }
  // 995411220XXX
  {
    let match = /^(?:995)?(\d{1,9}X{1,9})$/.exec(range)
    if (match && match[1].length === 9) {
      return {
        from: parseInt(match[1].replaceAll('X', '0'), 10),
        to: parseInt(match[1].replaceAll('X', '9'), 10),
      }
    }
  }
  // manual handling for weird cases
  switch (range) {
    case '2110XXX-2112XXX,2114XXX':
    case '2510XXX,2512XXX-2519XXX':
    case 'სულ150032სააბონენტონომერი':
    case '220XXXდა4361სააბონენტონომერი':
    case '240XXXდა4600სააბონენტონომერი':
    case '91200-91209(სულათისააბონენტონომერი)':
    case '250XXX.251XXX,252XXX,253XXX,254XXXდა255XXX':
      return null
    case '901-121210-901121219':
      return {from: 901121210, to: 901121219}
    case '90150051X-დან-90150059X-ისჩათვლით':
      return {from: 901500510, to: 901500599}
    case '903000000-903000-903000009':
      return {from: 903000000, to: 903000009}
    default:
      throw Error(`Unexpected range ${range}`)
  }
}

const parseNumberCount = (numberCount) => {
  numberCount = numberCount.replaceAll(/\s/g, '')
  if (/^\d+$/.test(numberCount)) {
    return parseInt(numberCount, 10)
  }
  if (numberCount === '') {
    return null
  }
  throw Error(`Unexpected numberCount ${numberCount}`)
}

const parseSigleRange = (permission, range) => {
  const fromTo = parseRangeString(range.range)
  if (!fromTo) {
    return null
  }
  return {
    ...fromTo,
    numberCount: parseNumberCount(range.numberCount),
    rawPermission: permission,
    rawRange: range,
  }
}

const parseRanges = (permissions, permissionRanges) =>
  permissions.flatMap(permission => 
    permissionRanges[permission.id].map(range => 
      parseSigleRange(permission, range)
    )
  ).filter(range => range !== null)

export default parseRanges;