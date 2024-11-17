import libphonenumber from 'google-libphonenumber'
import parsePhoneNumber from 'libphonenumber-js/max'

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

const checkSingleRangeGoogleLibphonenumber = (range) => {
  for (let localNumber = range.from; localNumber <= range.to; localNumber++) {
    const parsedNumber = phoneUtil.parse(`+995${localNumber}`, 'GE')
    if (!phoneUtil.isValidNumberForRegion(parsedNumber, 'GE')) {
      return false
    }
  }
  return true
}

const checkSingleRangeLibphonenumberJs = (range) => {
  for (let localNumber = range.from; localNumber <= range.to; localNumber++) {
    const parsedNumber = parsePhoneNumber(`+995${localNumber}`, 'GE')
    if (parsedNumber.isValid() !== true) {
      return false
    }
  }
  return true
}

const checkLipbphonenumberRanges = (ranges) => {
  ranges.filter(range => range.numberCount === range.to - range.from + 1)
    .sort((a,b) => a.from - b.from)
    .forEach(range => {
      console.log(
        `Validating from=${range.from} to=${range.to}: google-libphonenumber=${
          checkSingleRangeGoogleLibphonenumber(range) ? 'VALID  ' : '\x1b[41mINVALID\x1b[0m'
        } libphonenumber-js=${
          checkSingleRangeLibphonenumberJs(range) ? 'VALID  ' : '\x1b[41mINVALID\x1b[0m'
        }`)
      console.log(
        `  Permission id=${
          range.rawPermission.id
        } number=${
          range.rawPermission.number
        } operator=${
          operatorNames[range.rawPermission.operator] || range.rawPermission.operator
        }`)
    })
}

const operatorNames = {
  'შპს სელფი მობაილ': 'Cellfie',
  'სს სილქნეტი': 'Silknet',
  'შპს მაგთიკომი': 'MagtiCom',
  'შპს ეკლეკტიკ': 'Eclectic',
  'შპს ალფაკომი': 'Alphacom',
  'შპს დათაჰაუს გლობალ': 'DataHouse Global',
  'შპს გლობალ სელ': 'Globalcell',
  'შპს სითი ტელეკომი': 'City Telecom',
  'შპს ტელეკომ 1': 'Telecom 1',
}

export default checkLipbphonenumberRanges;