// src/services/geoService.js
// Extracts geolocation and user-agent data from incoming requests

const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

/**
 * Parse visitor metadata from an Express request object.
 * @param {import('express').Request} req
 * @returns {{ browser, device, os, ip, country, city }}
 */
const http = require('http');

const countryNameMap = {
  AF: 'Afghanistan', AX: 'Aland Islands', AL: 'Albania', DZ: 'Algeria', AS: 'American Samoa',
  AD: 'Andorra', AO: 'Angola', AI: 'Anguilla', AQ: 'Antarctica', AG: 'Antigua & Barbuda',
  AR: 'Argentina', AM: 'Armenia', AW: 'Aruba', AU: 'Australia', AT: 'Austria', AZ: 'Azerbaijan',
  BS: 'Bahamas', BH: 'Bahrain', BD: 'Bangladesh', BB: 'Barbados', BY: 'Belarus', BE: 'Belgium',
  BZ: 'Belize', BJ: 'Benin', BM: 'Bermuda', BT: 'Bhutan', BO: 'Bolivia', BQ: 'Bonaire',
  BA: 'Bosnia & Herzegovina', BW: 'Botswana', BV: 'Bouvet Island', BR: 'Brazil', IO: 'British Indian Ocean Territory',
  BN: 'Brunei', BG: 'Bulgaria', BF: 'Burkina Faso', BI: 'Burundi', KH: 'Cambodia',
  CM: 'Cameroon', CA: 'Canada', CV: 'Cape Verde', KY: 'Cayman Islands', CF: 'Central African Republic',
  TD: 'Chad', CL: 'Chile', CN: 'China', CX: 'Christmas Island', CC: 'Cocos Islands',
  CO: 'Colombia', KM: 'Comoros', CG: 'Congo', CD: 'DR Congo', CK: 'Cook Islands',
  CR: 'Costa Rica', CI: 'Cote d\'Ivoire', HR: 'Croatia', CU: 'Cuba', CW: 'Curaçao', CY: 'Cyprus',
  CZ: 'Czech Republic', DK: 'Denmark', DJ: 'Djibouti', DM: 'Dominica', DO: 'Dominican Republic',
  EC: 'Ecuador', EG: 'Egypt', SV: 'El Salvador', GQ: 'Equatorial Guinea', ER: 'Eritrea', EE: 'Estonia',
  ET: 'Ethiopia', FK: 'Falkland Islands', FO: 'Faroe Islands', FJ: 'Fiji', FI: 'Finland', FR: 'France',
  GF: 'French Guiana', PF: 'French Polynesia', TF: 'French Southern Territories', GA: 'Gabon', GM: 'Gambia',
  GE: 'Georgia', DE: 'Germany', GH: 'Ghana', GI: 'Gibraltar', GR: 'Greece', GL: 'Greenland', GD: 'Grenada',
  GP: 'Guadeloupe', GU: 'Guam', GT: 'Guatemala', GG: 'Guernsey', GN: 'Guinea', GW: 'Guinea-Bissau', GY: 'Guyana',
  HT: 'Haiti', HM: 'Heard & McDonald Islands', VA: 'Vatican City', HN: 'Honduras',
  HK: 'Hong Kong', HU: 'Hungary', IS: 'Iceland', IN: 'India', ID: 'Indonesia', IR: 'Iran', IQ: 'Iraq',
  IE: 'Ireland', IM: 'Isle of Man', IL: 'Israel', IT: 'Italy', JM: 'Jamaica', JP: 'Japan', JE: 'Jersey',
  JO: 'Jordan', KZ: 'Kazakhstan', KE: 'Kenya', KI: 'Kiribati', KP: 'North Korea',
  KR: 'South Korea', KW: 'Kuwait', KG: 'Kyrgyzstan', LA: 'Laos',
  LV: 'Latvia', LB: 'Lebanon', LS: 'Lesotho', LR: 'Liberia', LY: 'Libya', LI: 'Liechtenstein', LT: 'Lithuania',
  LU: 'Luxembourg', MO: 'Macao', MK: 'Macedonia', MG: 'Madagascar', MW: 'Malawi', MY: 'Malaysia', MV: 'Maldives',
  ML: 'Mali', MT: 'Malta', MH: 'Marshall Islands', MQ: 'Martinique', MR: 'Mauritania', MU: 'Mauritius',
  YT: 'Mayotte', MX: 'Mexico', FM: 'Micronesia', MD: 'Moldova', MC: 'Monaco', MN: 'Mongolia', ME: 'Montenegro',
  MS: 'Montserrat', MA: 'Morocco', MZ: 'Mozambique', MM: 'Myanmar', NA: 'Namibia', NR: 'Nauru', NP: 'Nepal',
  NL: 'Netherlands', NC: 'New Caledonia', NZ: 'New Zealand', NI: 'Nicaragua', NE: 'Niger', NG: 'Nigeria',
  NU: 'Niue', NF: 'Norfolk Island', MP: 'Northern Mariana Islands', NO: 'Norway', OM: 'Oman', PK: 'Pakistan',
  PW: 'Palau', PS: 'Palestine', PA: 'Panama', PG: 'Papua New Guinea', PY: 'Paraguay', PE: 'Peru', PH: 'Philippines',
  PN: 'Pitcairn', PL: 'Poland', PT: 'Portugal', PR: 'Puerto Rico', QA: 'Qatar', RE: 'Reunion', RO: 'Romania',
  RU: 'Russia', RW: 'Rwanda', BL: 'Saint Barthélemy', SH: 'Saint Helena', KN: 'Saint Kitts & Nevis',
  LC: 'Saint Lucia', MF: 'Saint Martin', PM: 'Saint Pierre & Miquelon', VC: 'Saint Vincent & Grenadines',
  WS: 'Samoa', SM: 'San Marino', ST: 'Sao Tome & Principe', SA: 'Saudi Arabia', SN: 'Senegal', RS: 'Serbia',
  SC: 'Seychelles', SL: 'Sierra Leone', SG: 'Singapore', SX: 'Sint Maarten', SK: 'Slovakia', SI: 'Slovenia',
  SB: 'Solomon Islands', SO: 'Somalia', ZA: 'South Africa', GS: 'South Georgia & Sandwich Islands',
  SS: 'South Sudan', ES: 'Spain', LK: 'Sri Lanka', SD: 'Sudan', SR: 'Suriname', SJ: 'Svalbard & Jan Mayen',
  SZ: 'Swaziland', SE: 'Sweden', CH: 'Switzerland', SY: 'Syria', TW: 'Taiwan', TJ: 'Tajikistan',
  TZ: 'Tanzania', TH: 'Thailand', TL: 'Timor-Leste', TG: 'Togo', TK: 'Tokelau', TO: 'Tonga', TT: 'Trinidad & Tobago',
  TN: 'Tunisia', TR: 'Turkey', TM: 'Turkmenistan', TC: 'Turks & Caicos Islands', TV: 'Tuvalu', UG: 'Uganda',
  UA: 'Ukraine', AE: 'United Arab Emirates', GB: 'United Kingdom', US: 'United States', UM: 'US Minor Outlying Islands',
  UY: 'Uruguay', UZ: 'Uzbekistan', VU: 'Vanuatu', VE: 'Venezuela', VN: 'Vietnam', VG: 'British Virgin Islands',
  VI: 'US Virgin Islands', WF: 'Wallis & Futuna', EH: 'Western Sahara', YE: 'Yemen', ZM: 'Zambia', ZW: 'Zimbabwe'
};

const fetchLocalGeo = () => {
  return new Promise((resolve) => {
    http.get('http://ip-api.com/json/', { timeout: 2500 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.status === 'success') {
            resolve({
              country: parsed.country || 'Unknown',
              city: parsed.city || 'Unknown',
              ip: parsed.query || null,
              latitude: parsed.lat || null,
              longitude: parsed.lon || null
            });
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => {
      resolve(null);
    });
  });
};

const parseVisitorData = async (req) => {
  // Get real IP (handle proxies / load balancers)
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    '0.0.0.0';

  // Parse user agent string
  const uaString = req.headers['user-agent'] || '';
  const parser = new UAParser(uaString);
  const ua = parser.getResult();

  const browser = ua.browser?.name || 'Unknown';
  const os = ua.os?.name || 'Unknown';
  const deviceType = ua.device?.type || 'desktop'; // mobile, tablet, desktop

  // Normalize device type label
  const device =
    deviceType === 'mobile'
      ? 'Mobile'
      : deviceType === 'tablet'
      ? 'Tablet'
      : 'Desktop';

  let country = 'Unknown';
  let city = 'Unknown';
  let latitude = null;
  let longitude = null;
  let cleanIp = ip;

  const isLocal = ip === '::1' || ip === '127.0.0.1' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.16.') || ip.startsWith('172.17.');

  if (isLocal) {
    const localGeo = await fetchLocalGeo();
    if (localGeo) {
      country = localGeo.country;
      city = localGeo.city;
      latitude = localGeo.latitude;
      longitude = localGeo.longitude;
      if (localGeo.ip) cleanIp = localGeo.ip;
    } else {
      const fallbackGeo = geoip.lookup('8.8.8.8');
      const code = fallbackGeo?.country || 'US';
      country = countryNameMap[code] || code;
      city = fallbackGeo?.city || 'Mountain View';
      latitude = fallbackGeo?.ll ? fallbackGeo.ll[0] : null;
      longitude = fallbackGeo?.ll ? fallbackGeo.ll[1] : null;
    }
  } else {
    const geo = geoip.lookup(cleanIp);
    const code = geo?.country || 'Unknown';
    country = countryNameMap[code] || code;
    city = geo?.city || 'Unknown';
    latitude = geo?.ll ? geo.ll[0] : null;
    longitude = geo?.ll ? geo.ll[1] : null;
  }

  return { browser, device, os, ip: cleanIp, country, city, latitude, longitude };
};

module.exports = { parseVisitorData };
