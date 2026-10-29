import { Enum as EasyEnum } from '@thisisagile/easy/types/Enum';
import type { Id } from '@thisisagile/easy/types/Id';
import { lazyRegistry, type Registry } from '@thisisagile/easy/types/Registry';
import { text } from '@thisisagile/easy/types/ToText';
import type { Optional } from '@thisisagile/easy/types/Types';
import { equalsNormalizedId } from './NormalizedId';

export class Enum extends EasyEnum {
  constructor(name: string, id: string) {
    super(name, id);
  }

  equals<E extends EasyEnum>(other: E | Id): other is E {
    return equalsNormalizedId(this.id, other);
  }
}

export const create = (name: string, id: string): Enum => new Enum(name, id);

export const AF = /* @__PURE__ */ new Enum('Afghanistan', 'AF');
export const AX = /* @__PURE__ */ new Enum('Åland Islands', 'AX');
export const AL = /* @__PURE__ */ new Enum('Albania', 'AL');
export const DZ = /* @__PURE__ */ new Enum('Algeria', 'DZ');
export const AS = /* @__PURE__ */ new Enum('American Samoa', 'AS');
export const AD = /* @__PURE__ */ new Enum('Andorra', 'AD');
export const AO = /* @__PURE__ */ new Enum('Angola', 'AO');
export const AI = /* @__PURE__ */ new Enum('Anguilla', 'AI');
export const AQ = /* @__PURE__ */ new Enum('Antarctica', 'AQ');
export const AG = /* @__PURE__ */ new Enum('Antigua & Barbuda', 'AG');
export const AR = /* @__PURE__ */ new Enum('Argentina', 'AR');
export const AM = /* @__PURE__ */ new Enum('Armenia', 'AM');
export const AW = /* @__PURE__ */ new Enum('Aruba', 'AW');
export const AU = /* @__PURE__ */ new Enum('Australia', 'AU');
export const AT = /* @__PURE__ */ new Enum('Austria', 'AT');
export const AZ = /* @__PURE__ */ new Enum('Azerbaijan', 'AZ');
export const BS = /* @__PURE__ */ new Enum('Bahamas', 'BS');
export const BH = /* @__PURE__ */ new Enum('Bahrain', 'BH');
export const BD = /* @__PURE__ */ new Enum('Bangladesh', 'BD');
export const BB = /* @__PURE__ */ new Enum('Barbados', 'BB');
export const BY = /* @__PURE__ */ new Enum('Belarus', 'BY');
export const BE = /* @__PURE__ */ new Enum('Belgium', 'BE');
export const BZ = /* @__PURE__ */ new Enum('Belize', 'BZ');
export const BJ = /* @__PURE__ */ new Enum('Benin', 'BJ');
export const BM = /* @__PURE__ */ new Enum('Bermuda', 'BM');
export const BT = /* @__PURE__ */ new Enum('Bhutan', 'BT');
export const BO = /* @__PURE__ */ new Enum('Bolivia', 'BO');
export const BA = /* @__PURE__ */ new Enum('Bosnia & Herzegovina', 'BA');
export const BW = /* @__PURE__ */ new Enum('Botswana', 'BW');
export const BV = /* @__PURE__ */ new Enum('Bouvet Island', 'BV');
export const BR = /* @__PURE__ */ new Enum('Brazil', 'BR');
export const IO = /* @__PURE__ */ new Enum('British Indian Ocean Territory', 'IO');
export const VG = /* @__PURE__ */ new Enum('British Virgin Islands', 'VG');
export const BN = /* @__PURE__ */ new Enum('Brunei', 'BN');
export const BG = /* @__PURE__ */ new Enum('Bulgaria', 'BG');
export const BF = /* @__PURE__ */ new Enum('Burkina Faso', 'BF');
export const BI = /* @__PURE__ */ new Enum('Burundi', 'BI');
export const KH = /* @__PURE__ */ new Enum('Cambodia', 'KH');
export const CM = /* @__PURE__ */ new Enum('Cameroon', 'CM');
export const CA = /* @__PURE__ */ new Enum('Canada', 'CA');
export const CV = /* @__PURE__ */ new Enum('Cape Verde', 'CV');
export const BQ = /* @__PURE__ */ new Enum('Caribbean Netherlands', 'BQ');
export const KY = /* @__PURE__ */ new Enum('Cayman Islands', 'KY');
export const CF = /* @__PURE__ */ new Enum('Central African Republic', 'CF');
export const TD = /* @__PURE__ */ new Enum('Chad', 'TD');
export const CL = /* @__PURE__ */ new Enum('Chile', 'CL');
export const CN = /* @__PURE__ */ new Enum('China', 'CN');
export const CX = /* @__PURE__ */ new Enum('Christmas Island', 'CX');
export const CC = /* @__PURE__ */ new Enum('Cocos (Keeling) Islands', 'CC');
export const CO = /* @__PURE__ */ new Enum('Colombia', 'CO');
export const KM = /* @__PURE__ */ new Enum('Comoros', 'KM');
export const CG = /* @__PURE__ */ new Enum('Congo - Brazzaville', 'CG');
export const CD = /* @__PURE__ */ new Enum('Congo - Kinshasa', 'CD');
export const CK = /* @__PURE__ */ new Enum('Cook Islands', 'CK');
export const CR = /* @__PURE__ */ new Enum('Costa Rica', 'CR');
export const CI = /* @__PURE__ */ new Enum('Côte d’Ivoire', 'CI');
export const HR = /* @__PURE__ */ new Enum('Croatia', 'HR');
export const CU = /* @__PURE__ */ new Enum('Cuba', 'CU');
export const CW = /* @__PURE__ */ new Enum('Curaçao', 'CW');
export const CY = /* @__PURE__ */ new Enum('Cyprus', 'CY');
export const CZ = /* @__PURE__ */ new Enum('Czechia', 'CZ');
export const DK = /* @__PURE__ */ new Enum('Denmark', 'DK');
export const DJ = /* @__PURE__ */ new Enum('Djibouti', 'DJ');
export const DM = /* @__PURE__ */ new Enum('Dominica', 'DM');
export const DO = /* @__PURE__ */ new Enum('Dominican Republic', 'DO');
export const EC = /* @__PURE__ */ new Enum('Ecuador', 'EC');
export const EG = /* @__PURE__ */ new Enum('Egypt', 'EG');
export const SV = /* @__PURE__ */ new Enum('El Salvador', 'SV');
export const GQ = /* @__PURE__ */ new Enum('Equatorial Guinea', 'GQ');
export const ER = /* @__PURE__ */ new Enum('Eritrea', 'ER');
export const EE = /* @__PURE__ */ new Enum('Estonia', 'EE');
export const SZ = /* @__PURE__ */ new Enum('Eswatini', 'SZ');
export const ET = /* @__PURE__ */ new Enum('Ethiopia', 'ET');
export const FK = /* @__PURE__ */ new Enum('Falkland Islands', 'FK');
export const FO = /* @__PURE__ */ new Enum('Faroe Islands', 'FO');
export const FJ = /* @__PURE__ */ new Enum('Fiji', 'FJ');
export const FI = /* @__PURE__ */ new Enum('Finland', 'FI');
export const FR = /* @__PURE__ */ new Enum('France', 'FR');
export const GF = /* @__PURE__ */ new Enum('French Guiana', 'GF');
export const PF = /* @__PURE__ */ new Enum('French Polynesia', 'PF');
export const TF = /* @__PURE__ */ new Enum('French Southern Territories', 'TF');
export const GA = /* @__PURE__ */ new Enum('Gabon', 'GA');
export const GM = /* @__PURE__ */ new Enum('Gambia', 'GM');
export const GE = /* @__PURE__ */ new Enum('Georgia', 'GE');
export const DE = /* @__PURE__ */ new Enum('Germany', 'DE');
export const GH = /* @__PURE__ */ new Enum('Ghana', 'GH');
export const GI = /* @__PURE__ */ new Enum('Gibraltar', 'GI');
export const GR = /* @__PURE__ */ new Enum('Greece', 'GR');
export const GL = /* @__PURE__ */ new Enum('Greenland', 'GL');
export const GD = /* @__PURE__ */ new Enum('Grenada', 'GD');
export const GP = /* @__PURE__ */ new Enum('Guadeloupe', 'GP');
export const GU = /* @__PURE__ */ new Enum('Guam', 'GU');
export const GT = /* @__PURE__ */ new Enum('Guatemala', 'GT');
export const GG = /* @__PURE__ */ new Enum('Guernsey', 'GG');
export const GN = /* @__PURE__ */ new Enum('Guinea', 'GN');
export const GW = /* @__PURE__ */ new Enum('Guinea-Bissau', 'GW');
export const GY = /* @__PURE__ */ new Enum('Guyana', 'GY');
export const HT = /* @__PURE__ */ new Enum('Haiti', 'HT');
export const HM = /* @__PURE__ */ new Enum('Heard & McDonald Islands', 'HM');
export const HN = /* @__PURE__ */ new Enum('Honduras', 'HN');
export const HK = /* @__PURE__ */ new Enum('Hong Kong SAR China', 'HK');
export const HU = /* @__PURE__ */ new Enum('Hungary', 'HU');
export const IS = /* @__PURE__ */ new Enum('Iceland', 'IS');
export const IN = /* @__PURE__ */ new Enum('India', 'IN');
export const ID = /* @__PURE__ */ new Enum('Indonesia', 'ID');
export const IR = /* @__PURE__ */ new Enum('Iran', 'IR');
export const IQ = /* @__PURE__ */ new Enum('Iraq', 'IQ');
export const IE = /* @__PURE__ */ new Enum('Ireland', 'IE');
export const IM = /* @__PURE__ */ new Enum('Isle of Man', 'IM');
export const IL = /* @__PURE__ */ new Enum('Israel', 'IL');
export const IT = /* @__PURE__ */ new Enum('Italy', 'IT');
export const JM = /* @__PURE__ */ new Enum('Jamaica', 'JM');
export const JP = /* @__PURE__ */ new Enum('Japan', 'JP');
export const JE = /* @__PURE__ */ new Enum('Jersey', 'JE');
export const JO = /* @__PURE__ */ new Enum('Jordan', 'JO');
export const KZ = /* @__PURE__ */ new Enum('Kazakhstan', 'KZ');
export const KE = /* @__PURE__ */ new Enum('Kenya', 'KE');
export const KI = /* @__PURE__ */ new Enum('Kiribati', 'KI');
export const KW = /* @__PURE__ */ new Enum('Kuwait', 'KW');
export const KG = /* @__PURE__ */ new Enum('Kyrgyzstan', 'KG');
export const LA = /* @__PURE__ */ new Enum('Laos', 'LA');
export const LV = /* @__PURE__ */ new Enum('Latvia', 'LV');
export const LB = /* @__PURE__ */ new Enum('Lebanon', 'LB');
export const LS = /* @__PURE__ */ new Enum('Lesotho', 'LS');
export const LR = /* @__PURE__ */ new Enum('Liberia', 'LR');
export const LY = /* @__PURE__ */ new Enum('Libya', 'LY');
export const LI = /* @__PURE__ */ new Enum('Liechtenstein', 'LI');
export const LT = /* @__PURE__ */ new Enum('Lithuania', 'LT');
export const LU = /* @__PURE__ */ new Enum('Luxembourg', 'LU');
export const MO = /* @__PURE__ */ new Enum('Macao SAR China', 'MO');
export const MG = /* @__PURE__ */ new Enum('Madagascar', 'MG');
export const MW = /* @__PURE__ */ new Enum('Malawi', 'MW');
export const MY = /* @__PURE__ */ new Enum('Malaysia', 'MY');
export const MV = /* @__PURE__ */ new Enum('Maldives', 'MV');
export const ML = /* @__PURE__ */ new Enum('Mali', 'ML');
export const MT = /* @__PURE__ */ new Enum('Malta', 'MT');
export const MH = /* @__PURE__ */ new Enum('Marshall Islands', 'MH');
export const MQ = /* @__PURE__ */ new Enum('Martinique', 'MQ');
export const MR = /* @__PURE__ */ new Enum('Mauritania', 'MR');
export const MU = /* @__PURE__ */ new Enum('Mauritius', 'MU');
export const YT = /* @__PURE__ */ new Enum('Mayotte', 'YT');
export const MX = /* @__PURE__ */ new Enum('Mexico', 'MX');
export const FM = /* @__PURE__ */ new Enum('Micronesia', 'FM');
export const MD = /* @__PURE__ */ new Enum('Moldova', 'MD');
export const MC = /* @__PURE__ */ new Enum('Monaco', 'MC');
export const MN = /* @__PURE__ */ new Enum('Mongolia', 'MN');
export const ME = /* @__PURE__ */ new Enum('Montenegro', 'ME');
export const MS = /* @__PURE__ */ new Enum('Montserrat', 'MS');
export const MA = /* @__PURE__ */ new Enum('Morocco', 'MA');
export const MZ = /* @__PURE__ */ new Enum('Mozambique', 'MZ');
export const MM = /* @__PURE__ */ new Enum('Myanmar (Burma)', 'MM');
export const NA = /* @__PURE__ */ new Enum('Namibia', 'NA');
export const NR = /* @__PURE__ */ new Enum('Nauru', 'NR');
export const NP = /* @__PURE__ */ new Enum('Nepal', 'NP');
export const NL = /* @__PURE__ */ new Enum('Netherlands', 'NL');
export const NC = /* @__PURE__ */ new Enum('New Caledonia', 'NC');
export const NZ = /* @__PURE__ */ new Enum('New Zealand', 'NZ');
export const NI = /* @__PURE__ */ new Enum('Nicaragua', 'NI');
export const NE = /* @__PURE__ */ new Enum('Niger', 'NE');
export const NG = /* @__PURE__ */ new Enum('Nigeria', 'NG');
export const NU = /* @__PURE__ */ new Enum('Niue', 'NU');
export const NF = /* @__PURE__ */ new Enum('Norfolk Island', 'NF');
export const KP = /* @__PURE__ */ new Enum('North Korea', 'KP');
export const MK = /* @__PURE__ */ new Enum('North Macedonia', 'MK');
export const MP = /* @__PURE__ */ new Enum('Northern Mariana Islands', 'MP');
export const NO = /* @__PURE__ */ new Enum('Norway', 'NO');
export const OM = /* @__PURE__ */ new Enum('Oman', 'OM');
export const PK = /* @__PURE__ */ new Enum('Pakistan', 'PK');
export const PW = /* @__PURE__ */ new Enum('Palau', 'PW');
export const PS = /* @__PURE__ */ new Enum('Palestinian Territories', 'PS');
export const PA = /* @__PURE__ */ new Enum('Panama', 'PA');
export const PG = /* @__PURE__ */ new Enum('Papua New Guinea', 'PG');
export const PY = /* @__PURE__ */ new Enum('Paraguay', 'PY');
export const PE = /* @__PURE__ */ new Enum('Peru', 'PE');
export const PH = /* @__PURE__ */ new Enum('Philippines', 'PH');
export const PN = /* @__PURE__ */ new Enum('Pitcairn Islands', 'PN');
export const PL = /* @__PURE__ */ new Enum('Poland', 'PL');
export const PT = /* @__PURE__ */ new Enum('Portugal', 'PT');
export const PR = /* @__PURE__ */ new Enum('Puerto Rico', 'PR');
export const QA = /* @__PURE__ */ new Enum('Qatar', 'QA');
export const RE = /* @__PURE__ */ new Enum('Réunion', 'RE');
export const RO = /* @__PURE__ */ new Enum('Romania', 'RO');
export const RU = /* @__PURE__ */ new Enum('Russia', 'RU');
export const RW = /* @__PURE__ */ new Enum('Rwanda', 'RW');
export const WS = /* @__PURE__ */ new Enum('Samoa', 'WS');
export const SM = /* @__PURE__ */ new Enum('San Marino', 'SM');
export const ST = /* @__PURE__ */ new Enum('São Tomé & Príncipe', 'ST');
export const SA = /* @__PURE__ */ new Enum('Saudi Arabia', 'SA');
export const SN = /* @__PURE__ */ new Enum('Senegal', 'SN');
export const RS = /* @__PURE__ */ new Enum('Serbia', 'RS');
export const SC = /* @__PURE__ */ new Enum('Seychelles', 'SC');
export const SL = /* @__PURE__ */ new Enum('Sierra Leone', 'SL');
export const SG = /* @__PURE__ */ new Enum('Singapore', 'SG');
export const SX = /* @__PURE__ */ new Enum('Sint Maarten', 'SX');
export const SK = /* @__PURE__ */ new Enum('Slovakia', 'SK');
export const SI = /* @__PURE__ */ new Enum('Slovenia', 'SI');
export const SB = /* @__PURE__ */ new Enum('Solomon Islands', 'SB');
export const SO = /* @__PURE__ */ new Enum('Somalia', 'SO');
export const ZA = /* @__PURE__ */ new Enum('South Africa', 'ZA');
export const GS = /* @__PURE__ */ new Enum('South Georgia & South Sandwich Islands', 'GS');
export const KR = /* @__PURE__ */ new Enum('South Korea', 'KR');
export const SS = /* @__PURE__ */ new Enum('South Sudan', 'SS');
export const ES = /* @__PURE__ */ new Enum('Spain', 'ES');
export const LK = /* @__PURE__ */ new Enum('Sri Lanka', 'LK');
export const BL = /* @__PURE__ */ new Enum('St. Barthélemy', 'BL');
export const SH = /* @__PURE__ */ new Enum('St. Helena', 'SH');
export const KN = /* @__PURE__ */ new Enum('St. Kitts & Nevis', 'KN');
export const LC = /* @__PURE__ */ new Enum('St. Lucia', 'LC');
export const MF = /* @__PURE__ */ new Enum('St. Martin', 'MF');
export const PM = /* @__PURE__ */ new Enum('St. Pierre & Miquelon', 'PM');
export const VC = /* @__PURE__ */ new Enum('St. Vincent & Grenadines', 'VC');
export const SD = /* @__PURE__ */ new Enum('Sudan', 'SD');
export const SR = /* @__PURE__ */ new Enum('Suriname', 'SR');
export const SJ = /* @__PURE__ */ new Enum('Svalbard & Jan Mayen', 'SJ');
export const SE = /* @__PURE__ */ new Enum('Sweden', 'SE');
export const CH = /* @__PURE__ */ new Enum('Switzerland', 'CH');
export const SY = /* @__PURE__ */ new Enum('Syria', 'SY');
export const TW = /* @__PURE__ */ new Enum('Taiwan', 'TW');
export const TJ = /* @__PURE__ */ new Enum('Tajikistan', 'TJ');
export const TZ = /* @__PURE__ */ new Enum('Tanzania', 'TZ');
export const TH = /* @__PURE__ */ new Enum('Thailand', 'TH');
export const TL = /* @__PURE__ */ new Enum('Timor-Leste', 'TL');
export const TG = /* @__PURE__ */ new Enum('Togo', 'TG');
export const TK = /* @__PURE__ */ new Enum('Tokelau', 'TK');
export const TO = /* @__PURE__ */ new Enum('Tonga', 'TO');
export const TT = /* @__PURE__ */ new Enum('Trinidad & Tobago', 'TT');
export const TN = /* @__PURE__ */ new Enum('Tunisia', 'TN');
export const TR = /* @__PURE__ */ new Enum('Turkey', 'TR');
export const TM = /* @__PURE__ */ new Enum('Turkmenistan', 'TM');
export const TC = /* @__PURE__ */ new Enum('Turks & Caicos Islands', 'TC');
export const TV = /* @__PURE__ */ new Enum('Tuvalu', 'TV');
export const UM = /* @__PURE__ */ new Enum('U.S. Outlying Islands', 'UM');
export const VI = /* @__PURE__ */ new Enum('U.S. Virgin Islands', 'VI');
export const UG = /* @__PURE__ */ new Enum('Uganda', 'UG');
export const UA = /* @__PURE__ */ new Enum('Ukraine', 'UA');
export const AE = /* @__PURE__ */ new Enum('United Arab Emirates', 'AE');
export const GB = /* @__PURE__ */ new Enum('United Kingdom', 'GB');
export const US = /* @__PURE__ */ new Enum('United States', 'US');
export const UY = /* @__PURE__ */ new Enum('Uruguay', 'UY');
export const UZ = /* @__PURE__ */ new Enum('Uzbekistan', 'UZ');
export const VU = /* @__PURE__ */ new Enum('Vanuatu', 'VU');
export const VA = /* @__PURE__ */ new Enum('Vatican City', 'VA');
export const VE = /* @__PURE__ */ new Enum('Venezuela', 'VE');
export const VN = /* @__PURE__ */ new Enum('Vietnam', 'VN');
export const WF = /* @__PURE__ */ new Enum('Wallis & Futuna', 'WF');
export const EH = /* @__PURE__ */ new Enum('Western Sahara', 'EH');
export const YE = /* @__PURE__ */ new Enum('Yemen', 'YE');
export const ZM = /* @__PURE__ */ new Enum('Zambia', 'ZM');
export const ZW = /* @__PURE__ */ new Enum('Zimbabwe', 'ZW');

const registry = /* @__PURE__ */ lazyRegistry(() => ({
  AF,
  AX,
  AL,
  DZ,
  AS,
  AD,
  AO,
  AI,
  AQ,
  AG,
  AR,
  AM,
  AW,
  AU,
  AT,
  AZ,
  BS,
  BH,
  BD,
  BB,
  BY,
  BE,
  BZ,
  BJ,
  BM,
  BT,
  BO,
  BA,
  BW,
  BV,
  BR,
  IO,
  VG,
  BN,
  BG,
  BF,
  BI,
  KH,
  CM,
  CA,
  CV,
  BQ,
  KY,
  CF,
  TD,
  CL,
  CN,
  CX,
  CC,
  CO,
  KM,
  CG,
  CD,
  CK,
  CR,
  CI,
  HR,
  CU,
  CW,
  CY,
  CZ,
  DK,
  DJ,
  DM,
  DO,
  EC,
  EG,
  SV,
  GQ,
  ER,
  EE,
  SZ,
  ET,
  FK,
  FO,
  FJ,
  FI,
  FR,
  GF,
  PF,
  TF,
  GA,
  GM,
  GE,
  DE,
  GH,
  GI,
  GR,
  GL,
  GD,
  GP,
  GU,
  GT,
  GG,
  GN,
  GW,
  GY,
  HT,
  HM,
  HN,
  HK,
  HU,
  IS,
  IN,
  ID,
  IR,
  IQ,
  IE,
  IM,
  IL,
  IT,
  JM,
  JP,
  JE,
  JO,
  KZ,
  KE,
  KI,
  KW,
  KG,
  LA,
  LV,
  LB,
  LS,
  LR,
  LY,
  LI,
  LT,
  LU,
  MO,
  MG,
  MW,
  MY,
  MV,
  ML,
  MT,
  MH,
  MQ,
  MR,
  MU,
  YT,
  MX,
  FM,
  MD,
  MC,
  MN,
  ME,
  MS,
  MA,
  MZ,
  MM,
  NA,
  NR,
  NP,
  NL,
  NC,
  NZ,
  NI,
  NE,
  NG,
  NU,
  NF,
  KP,
  MK,
  MP,
  NO,
  OM,
  PK,
  PW,
  PS,
  PA,
  PG,
  PY,
  PE,
  PH,
  PN,
  PL,
  PT,
  PR,
  QA,
  RE,
  RO,
  RU,
  RW,
  WS,
  SM,
  ST,
  SA,
  SN,
  RS,
  SC,
  SL,
  SG,
  SX,
  SK,
  SI,
  SB,
  SO,
  ZA,
  GS,
  KR,
  SS,
  ES,
  LK,
  BL,
  SH,
  KN,
  LC,
  MF,
  PM,
  VC,
  SD,
  SR,
  SJ,
  SE,
  CH,
  SY,
  TW,
  TJ,
  TZ,
  TH,
  TL,
  TG,
  TK,
  TO,
  TT,
  TN,
  TR,
  TM,
  TC,
  TV,
  UM,
  VI,
  UG,
  UA,
  AE,
  GB,
  US,
  UY,
  UZ,
  VU,
  VA,
  VE,
  VN,
  WF,
  EH,
  YE,
  ZM,
  ZW,
}));
export const all: Registry<Enum>['all'] = () => registry.all();
export const byId: Registry<Enum>['byId'] = (id, alt) => registry.byId(id, alt);
export const byIds: Registry<Enum>['byIds'] = ids => registry.byIds(ids);
export const filter: Registry<Enum>['filter'] = (predicate, params) => registry.filter(predicate, params);
export const first: Registry<Enum>['first'] = (predicate, params) => registry.first(predicate, params);
export const lookup = (other: string): Optional<Enum> => first(value => value.equals(other));

export const inEurope = (c: Enum | string): boolean => {
  const country = c instanceof Enum ? c : lookup(c);
  if (!country) {
    return false;
  }
  const euCountries = [AT, BE, BG, HR, CY, CZ, DK, EE, FI, FR, DE, GR, HU, IE, IT, LV, LT, LU, MT, NL, PL, PT, RO, SK, SI, ES, SE];
  return euCountries.some(euCountry => euCountry.equals(country));
};
