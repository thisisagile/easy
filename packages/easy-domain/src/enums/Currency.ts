import { Enum as EasyEnum } from '@thisisagile/easy/types/Enum';
import { lazyRegistry } from '@thisisagile/easy/types/Registry';

export class Enum extends EasyEnum {
  constructor(
    id: string,
    name: string,
    readonly digits: number,
    code: string
  ) {
    super(name, id, code);
  }
}

export const create = (id: string, name: string, digits: number, code: string): Enum => new Enum(id, name, digits, code);

export const EUR = /* @__PURE__ */ new Enum('EUR', 'Euro', 2, '€');
export const USD = /* @__PURE__ */ new Enum('USD', 'US Dollar', 2, '$');
export const AED = /* @__PURE__ */ new Enum('AED', 'United Arab Emirates Dirham', 2, 'AED');
export const AFN = /* @__PURE__ */ new Enum('AFN', 'Afghan Afghani', 0, 'Af');
export const ALL = /* @__PURE__ */ new Enum('ALL', 'Albanian Lek', 0, 'ALL');
export const AMD = /* @__PURE__ */ new Enum('AMD', 'Armenian Dram', 0, 'AMD');
export const ARS = /* @__PURE__ */ new Enum('ARS', 'Argentine Peso', 2, 'AR$');
export const AUD = /* @__PURE__ */ new Enum('AUD', 'Australian Dollar', 2, 'AU$');
export const AZN = /* @__PURE__ */ new Enum('AZN', 'Azerbaijani Manat', 2, 'man.');
export const BAM = /* @__PURE__ */ new Enum('BAM', 'Bosnia-Herzegovina Convertible Mark', 2, 'KM');
export const BDT = /* @__PURE__ */ new Enum('BDT', 'Bangladeshi Taka', 2, 'Tk');
export const BGN = /* @__PURE__ */ new Enum('BGN', 'Bulgarian Lev', 2, 'BGN');
export const BHD = /* @__PURE__ */ new Enum('BHD', 'Bahraini Dinar', 3, 'BD');
export const BIF = /* @__PURE__ */ new Enum('BIF', 'Burundian Franc', 0, 'FBu');
export const BND = /* @__PURE__ */ new Enum('BND', 'Brunei Dollar', 2, 'BN$');
export const BOB = /* @__PURE__ */ new Enum('BOB', 'Bolivian Boliviano', 2, 'Bs');
export const BRL = /* @__PURE__ */ new Enum('BRL', 'Brazilian Real', 2, 'R$');
export const BWP = /* @__PURE__ */ new Enum('BWP', 'Botswanan Pula', 2, 'BWP');
export const BYN = /* @__PURE__ */ new Enum('BYN', 'Belarusian Ruble', 2, 'Br');
export const BZD = /* @__PURE__ */ new Enum('BZD', 'Belize Dollar', 2, 'BZ$');
export const CAD = /* @__PURE__ */ new Enum('CAD', 'Canadian Dollar', 2, 'CA$');
export const CDF = /* @__PURE__ */ new Enum('CDF', 'Congolese Franc', 2, 'CDF');
export const CHF = /* @__PURE__ */ new Enum('CHF', 'Swiss Franc', 2, 'CHF');
export const CLP = /* @__PURE__ */ new Enum('CLP', 'Chilean Peso', 0, 'CL$');
export const CNY = /* @__PURE__ */ new Enum('CNY', 'Chinese Yuan', 2, 'CN¥');
export const COP = /* @__PURE__ */ new Enum('COP', 'Colombian Peso', 0, 'CO$');
export const CRC = /* @__PURE__ */ new Enum('CRC', 'Costa Rican Colón', 0, '₡');
export const CVE = /* @__PURE__ */ new Enum('CVE', 'Cape Verdean Escudo', 2, 'CV$');
export const CZK = /* @__PURE__ */ new Enum('CZK', 'Czech Republic Koruna', 2, 'Kč');
export const DJF = /* @__PURE__ */ new Enum('DJF', 'Djiboutian Franc', 0, 'Fdj');
export const DKK = /* @__PURE__ */ new Enum('DKK', 'Danish Krone', 2, 'Dkr');
export const DOP = /* @__PURE__ */ new Enum('DOP', 'Dominican Peso', 2, 'RD$');
export const DZD = /* @__PURE__ */ new Enum('DZD', 'Algerian Dinar', 2, 'DA');
export const EEK = /* @__PURE__ */ new Enum('EEK', 'Estonian Kroon', 2, 'Ekr');
export const EGP = /* @__PURE__ */ new Enum('EGP', 'Egyptian Pound', 2, 'EGP');
export const ERN = /* @__PURE__ */ new Enum('ERN', 'Eritrean Nakfa', 2, 'Nfk');
export const ETB = /* @__PURE__ */ new Enum('ETB', 'Ethiopian Birr', 2, 'Br');
export const GBP = /* @__PURE__ */ new Enum('GBP', 'British Pound Sterling', 2, '£');
export const GEL = /* @__PURE__ */ new Enum('GEL', 'Georgian Lari', 2, 'GEL');
export const GHS = /* @__PURE__ */ new Enum('GHS', 'Ghanaian Cedi', 2, 'GH₵');
export const GNF = /* @__PURE__ */ new Enum('GNF', 'Guinean Franc', 0, 'FG');
export const GTQ = /* @__PURE__ */ new Enum('GTQ', 'Guatemalan Quetzal', 2, 'GTQ');
export const HKD = /* @__PURE__ */ new Enum('HKD', 'Hong Kong Dollar', 2, 'HK$');
export const HNL = /* @__PURE__ */ new Enum('HNL', 'Honduran Lempira', 2, 'HNL');
export const HRK = /* @__PURE__ */ new Enum('HRK', 'Croatian Kuna', 2, 'kn');
export const HUF = /* @__PURE__ */ new Enum('HUF', 'Hungarian Forint', 0, 'Ft');
export const IDR = /* @__PURE__ */ new Enum('IDR', 'Indonesian Rupiah', 0, 'Rp');
export const ILS = /* @__PURE__ */ new Enum('ILS', 'Israeli New Sheqel', 2, '₪');
export const INR = /* @__PURE__ */ new Enum('INR', 'Indian Rupee', 2, 'Rs');
export const IQD = /* @__PURE__ */ new Enum('IQD', 'Iraqi Dinar', 0, 'IQD');
export const IRR = /* @__PURE__ */ new Enum('IRR', 'Iranian Rial', 0, 'IRR');
export const ISK = /* @__PURE__ */ new Enum('ISK', 'Icelandic Króna', 0, 'Ikr');
export const JMD = /* @__PURE__ */ new Enum('JMD', 'Jamaican Dollar', 2, 'J$');
export const JOD = /* @__PURE__ */ new Enum('JOD', 'Jordanian Dinar', 3, 'JD');
export const JPY = /* @__PURE__ */ new Enum('JPY', 'Japanese Yen', 0, '¥');
export const KES = /* @__PURE__ */ new Enum('KES', 'Kenyan Shilling', 2, 'Ksh');
export const KHR = /* @__PURE__ */ new Enum('KHR', 'Cambodian Riel', 2, 'KHR');
export const KMF = /* @__PURE__ */ new Enum('KMF', 'Comorian Franc', 0, 'CF');
export const KRW = /* @__PURE__ */ new Enum('KRW', 'South Korean Won', 0, '₩');
export const KWD = /* @__PURE__ */ new Enum('KWD', 'Kuwaiti Dinar', 3, 'KD');
export const KZT = /* @__PURE__ */ new Enum('KZT', 'Kazakhstani Tenge', 2, 'KZT');
export const LBP = /* @__PURE__ */ new Enum('LBP', 'Lebanese Pound', 0, 'L.L.');
export const LKR = /* @__PURE__ */ new Enum('LKR', 'Sri Lankan Rupee', 2, 'SLRs');
export const LTL = /* @__PURE__ */ new Enum('LTL', 'Lithuanian Litas', 2, 'Lt');
export const LVL = /* @__PURE__ */ new Enum('LVL', 'Latvian Lats', 2, 'Ls');
export const LYD = /* @__PURE__ */ new Enum('LYD', 'Libyan Dinar', 3, 'LD');
export const MAD = /* @__PURE__ */ new Enum('MAD', 'Moroccan Dirham', 2, 'MAD');
export const MDL = /* @__PURE__ */ new Enum('MDL', 'Moldovan Leu', 2, 'MDL');
export const MGA = /* @__PURE__ */ new Enum('MGA', 'Malagasy Ariary', 0, 'MGA');
export const MKD = /* @__PURE__ */ new Enum('MKD', 'Macedonian Denar', 2, 'MKD');
export const MMK = /* @__PURE__ */ new Enum('MMK', 'Myanma Kyat', 0, 'MMK');
export const MOP = /* @__PURE__ */ new Enum('MOP', 'Macanese Pataca', 2, 'MOP$');
export const MUR = /* @__PURE__ */ new Enum('MUR', 'Mauritian Rupee', 0, 'MURs');
export const MXN = /* @__PURE__ */ new Enum('MXN', 'Mexican Peso', 2, 'MX$');
export const MYR = /* @__PURE__ */ new Enum('MYR', 'Malaysian Ringgit', 2, 'RM');
export const MZN = /* @__PURE__ */ new Enum('MZN', 'Mozambican Metical', 2, 'MTn');
export const NAD = /* @__PURE__ */ new Enum('NAD', 'Namibian Dollar', 2, 'N$');
export const NGN = /* @__PURE__ */ new Enum('NGN', 'Nigerian Naira', 2, '₦');
export const NIO = /* @__PURE__ */ new Enum('NIO', 'Nicaraguan Córdoba', 2, 'C$');
export const NOK = /* @__PURE__ */ new Enum('NOK', 'Norwegian Krone', 2, 'Nkr');
export const NPR = /* @__PURE__ */ new Enum('NPR', 'Nepalese Rupee', 2, 'NPRs');
export const NZD = /* @__PURE__ */ new Enum('NZD', 'New Zealand Dollar', 2, 'NZ$');
export const OMR = /* @__PURE__ */ new Enum('OMR', 'Omani Rial', 3, 'OMR');
export const PAB = /* @__PURE__ */ new Enum('PAB', 'Panamanian Balboa', 2, 'B/.');
export const PEN = /* @__PURE__ */ new Enum('PEN', 'Peruvian Nuevo Sol', 2, 'S/.');
export const PHP = /* @__PURE__ */ new Enum('PHP', 'Philippine Peso', 2, '₱');
export const PKR = /* @__PURE__ */ new Enum('PKR', 'Pakistani Rupee', 0, 'PKRs');
export const PLN = /* @__PURE__ */ new Enum('PLN', 'Polish Zloty', 2, 'zł');
export const PYG = /* @__PURE__ */ new Enum('PYG', 'Paraguayan Guarani', 0, '₲');
export const QAR = /* @__PURE__ */ new Enum('QAR', 'Qatari Rial', 2, 'QR');
export const RON = /* @__PURE__ */ new Enum('RON', 'Romanian Leu', 2, 'RON');
export const RSD = /* @__PURE__ */ new Enum('RSD', 'Serbian Dinar', 0, 'din.');
export const RUB = /* @__PURE__ */ new Enum('RUB', 'Russian Ruble', 2, 'RUB');
export const RWF = /* @__PURE__ */ new Enum('RWF', 'Rwandan Franc', 0, 'RWF');
export const SAR = /* @__PURE__ */ new Enum('SAR', 'Saudi Riyal', 2, 'SR');
export const SDG = /* @__PURE__ */ new Enum('SDG', 'Sudanese Pound', 2, 'SDG');
export const SEK = /* @__PURE__ */ new Enum('SEK', 'Swedish Krona', 2, 'Skr');
export const SGD = /* @__PURE__ */ new Enum('SGD', 'Singapore Dollar', 2, 'S$');
export const SOS = /* @__PURE__ */ new Enum('SOS', 'Somali Shilling', 0, 'Ssh');
export const SYP = /* @__PURE__ */ new Enum('SYP', 'Syrian Pound', 0, 'SY£');
export const THB = /* @__PURE__ */ new Enum('THB', 'Thai Baht', 2, '฿');
export const TND = /* @__PURE__ */ new Enum('TND', 'Tunisian Dinar', 3, 'DT');
export const TOP = /* @__PURE__ */ new Enum('TOP', 'Tongan Paʻanga', 2, 'T$');
export const TRY = /* @__PURE__ */ new Enum('TRY', 'Turkish Lira', 2, 'TL');
export const TTD = /* @__PURE__ */ new Enum('TTD', 'Trinidad and Tobago Dollar', 2, 'TT$');
export const TWD = /* @__PURE__ */ new Enum('TWD', 'New Taiwan Dollar', 2, 'NT$');
export const TZS = /* @__PURE__ */ new Enum('TZS', 'Tanzanian Shilling', 0, 'TSh');
export const UAH = /* @__PURE__ */ new Enum('UAH', 'Ukrainian Hryvnia', 2, '₴');
export const UGX = /* @__PURE__ */ new Enum('UGX', 'Ugandan Shilling', 0, 'USh');
export const UYU = /* @__PURE__ */ new Enum('UYU', 'Uruguayan Peso', 2, '$U');
export const UZS = /* @__PURE__ */ new Enum('UZS', 'Uzbekistan Som', 0, 'UZS');
export const VEF = /* @__PURE__ */ new Enum('VEF', 'Venezuelan Bolívar', 2, 'Bs.F.');
export const VND = /* @__PURE__ */ new Enum('VND', 'Vietnamese Dong', 0, '₫');
export const XAF = /* @__PURE__ */ new Enum('XAF', 'CFA Franc BEAC', 0, 'FCFA');
export const XOF = /* @__PURE__ */ new Enum('XOF', 'CFA Franc BCEAO', 0, 'CFA');
export const YER = /* @__PURE__ */ new Enum('YER', 'Yemeni Rial', 0, 'YR');
export const ZAR = /* @__PURE__ */ new Enum('ZAR', 'South African Rand', 2, 'R');
export const ZMK = /* @__PURE__ */ new Enum('ZMK', 'Zambian Kwacha', 0, 'ZK');
export const ZWL = /* @__PURE__ */ new Enum('ZWL', 'Zimbabwean Dollar', 0, 'ZWL$');

export const { all, byId, byIds, filter, first } = /* @__PURE__ */ lazyRegistry(() => ({
  EUR,
  USD,
  AED,
  AFN,
  ALL,
  AMD,
  ARS,
  AUD,
  AZN,
  BAM,
  BDT,
  BGN,
  BHD,
  BIF,
  BND,
  BOB,
  BRL,
  BWP,
  BYN,
  BZD,
  CAD,
  CDF,
  CHF,
  CLP,
  CNY,
  COP,
  CRC,
  CVE,
  CZK,
  DJF,
  DKK,
  DOP,
  DZD,
  EEK,
  EGP,
  ERN,
  ETB,
  GBP,
  GEL,
  GHS,
  GNF,
  GTQ,
  HKD,
  HNL,
  HRK,
  HUF,
  IDR,
  ILS,
  INR,
  IQD,
  IRR,
  ISK,
  JMD,
  JOD,
  JPY,
  KES,
  KHR,
  KMF,
  KRW,
  KWD,
  KZT,
  LBP,
  LKR,
  LTL,
  LVL,
  LYD,
  MAD,
  MDL,
  MGA,
  MKD,
  MMK,
  MOP,
  MUR,
  MXN,
  MYR,
  MZN,
  NAD,
  NGN,
  NIO,
  NOK,
  NPR,
  NZD,
  OMR,
  PAB,
  PEN,
  PHP,
  PKR,
  PLN,
  PYG,
  QAR,
  RON,
  RSD,
  RUB,
  RWF,
  SAR,
  SDG,
  SEK,
  SGD,
  SOS,
  SYP,
  THB,
  TND,
  TOP,
  TRY,
  TTD,
  TWD,
  TZS,
  UAH,
  UGX,
  UYU,
  UZS,
  VEF,
  VND,
  XAF,
  XOF,
  YER,
  ZAR,
  ZMK,
  ZWL,
}));
