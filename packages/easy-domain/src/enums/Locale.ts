import { Enum as EasyEnum } from '@thisisagile/easy/types/Enum';
import { lazyRegistry, type Registry } from '@thisisagile/easy/types/Registry';
import type { Id } from '@thisisagile/easy/types/Id';
import type { Optional } from '@thisisagile/easy/types/Types';
import { text } from '@thisisagile/easy/types/ToText';
import { equalsNormalizedId } from './NormalizedId';

export class Enum extends EasyEnum {
  constructor(
    id: Id,
    name: string,
    readonly country = text(id).lower.last(2).toString()
  ) {
    super(name, id);
  }

  equals<E extends EasyEnum>(other: E | Id): other is E {
    return equalsNormalizedId(this.id, other);
  }
}

export const create = (id: Id, name: string, country?: string): Enum => (country === undefined ? new Enum(id, name) : new Enum(id, name, country));

export const AF = /* @__PURE__ */ new Enum('af', 'Afrikaans');
export const AF_NA = /* @__PURE__ */ new Enum('af_NA', 'Afrikaans (Namibia)');
export const AF_ZA = /* @__PURE__ */ new Enum('af_ZA', 'Afrikaans (South Africa)');
export const AK = /* @__PURE__ */ new Enum('ak', 'Akan');
export const AK_GH = /* @__PURE__ */ new Enum('ak_GH', 'Akan (Ghana)');
export const SQ = /* @__PURE__ */ new Enum('sq', 'Albanian');
export const SQ_AL = /* @__PURE__ */ new Enum('sq_AL', 'Albanian (Albania)');
export const SQ_XK = /* @__PURE__ */ new Enum('sq_XK', 'Albanian (Kosovo)');
export const SQ_MK = /* @__PURE__ */ new Enum('sq_MK', 'Albanian (Macedonia)');
export const AM = /* @__PURE__ */ new Enum('am', 'Amharic');
export const AM_ET = /* @__PURE__ */ new Enum('am_ET', 'Amharic (Ethiopia)');
export const AR = /* @__PURE__ */ new Enum('ar', 'Arabic');
export const AR_DZ = /* @__PURE__ */ new Enum('ar_DZ', 'Arabic (Algeria)');
export const AR_BH = /* @__PURE__ */ new Enum('ar_BH', 'Arabic (Bahrain)');
export const AR_TD = /* @__PURE__ */ new Enum('ar_TD', 'Arabic (Chad)');
export const AR_KM = /* @__PURE__ */ new Enum('ar_KM', 'Arabic (Comoros)');
export const AR_DJ = /* @__PURE__ */ new Enum('ar_DJ', 'Arabic (Djibouti)');
export const AR_EG = /* @__PURE__ */ new Enum('ar_EG', 'Arabic (Egypt)');
export const AR_ER = /* @__PURE__ */ new Enum('ar_ER', 'Arabic (Eritrea)');
export const AR_IQ = /* @__PURE__ */ new Enum('ar_IQ', 'Arabic (Iraq)');
export const AR_IL = /* @__PURE__ */ new Enum('ar_IL', 'Arabic (Israel)');
export const AR_JO = /* @__PURE__ */ new Enum('ar_JO', 'Arabic (Jordan)');
export const AR_KW = /* @__PURE__ */ new Enum('ar_KW', 'Arabic (Kuwait)');
export const AR_LB = /* @__PURE__ */ new Enum('ar_LB', 'Arabic (Lebanon)');
export const AR_LY = /* @__PURE__ */ new Enum('ar_LY', 'Arabic (Libya)');
export const AR_MR = /* @__PURE__ */ new Enum('ar_MR', 'Arabic (Mauritania)');
export const AR_MA = /* @__PURE__ */ new Enum('ar_MA', 'Arabic (Morocco)');
export const AR_OM = /* @__PURE__ */ new Enum('ar_OM', 'Arabic (Oman)');
export const AR_PS = /* @__PURE__ */ new Enum('ar_PS', 'Arabic (Palestinian Territories)');
export const AR_QA = /* @__PURE__ */ new Enum('ar_QA', 'Arabic (Qatar)');
export const AR_SA = /* @__PURE__ */ new Enum('ar_SA', 'Arabic (Saudi Arabia)');
export const AR_SO = /* @__PURE__ */ new Enum('ar_SO', 'Arabic (Somalia)');
export const AR_SS = /* @__PURE__ */ new Enum('ar_SS', 'Arabic (South Sudan)');
export const AR_SD = /* @__PURE__ */ new Enum('ar_SD', 'Arabic (Sudan)');
export const AR_SY = /* @__PURE__ */ new Enum('ar_SY', 'Arabic (Syria)');
export const AR_TN = /* @__PURE__ */ new Enum('ar_TN', 'Arabic (Tunisia)');
export const AR_AE = /* @__PURE__ */ new Enum('ar_AE', 'Arabic (United Arab Emirates)');
export const AR_EH = /* @__PURE__ */ new Enum('ar_EH', 'Arabic (Western Sahara)');
export const AR_YE = /* @__PURE__ */ new Enum('ar_YE', 'Arabic (Yemen)');
export const HY = /* @__PURE__ */ new Enum('hy', 'Armenian');
export const HY_AM = /* @__PURE__ */ new Enum('hy_AM', 'Armenian (Armenia)');
export const AS = /* @__PURE__ */ new Enum('as', 'Assamese');
export const AS_IN = /* @__PURE__ */ new Enum('as_IN', 'Assamese (India)');
export const AZ = /* @__PURE__ */ new Enum('az', 'Azerbaijani');
export const AZ_AZ = /* @__PURE__ */ new Enum('az_AZ', 'Azerbaijani (Azerbaijan)');
export const AZ_CYRL_AZ = /* @__PURE__ */ new Enum('az_Cyrl_AZ', 'Azerbaijani (Cyrillic, Azerbaijan)');
export const AZ_CYRL = /* @__PURE__ */ new Enum('az_Cyrl', 'Azerbaijani (Cyrillic)', 'az');
export const AZ_LATN_AZ = /* @__PURE__ */ new Enum('az_Latn_AZ', 'Azerbaijani (Latin, Azerbaijan)');
export const AZ_LATN = /* @__PURE__ */ new Enum('az_Latn', 'Azerbaijani (Latin)', 'az');
export const BM = /* @__PURE__ */ new Enum('bm', 'Bambara');
export const BM_LATN_ML = /* @__PURE__ */ new Enum('bm_Latn_ML', 'Bambara (Latin, Mali)');
export const BM_LATN = /* @__PURE__ */ new Enum('bm_Latn', 'Bambara (Latin)', 'bm');
export const EU = /* @__PURE__ */ new Enum('eu', 'Basque');
export const EU_ES = /* @__PURE__ */ new Enum('eu_ES', 'Basque (Spain)');
export const BE = /* @__PURE__ */ new Enum('be', 'Belarusian');
export const BE_BY = /* @__PURE__ */ new Enum('be_BY', 'Belarusian (Belarus)');
export const BN = /* @__PURE__ */ new Enum('bn', 'Bengali');
export const BN_BD = /* @__PURE__ */ new Enum('bn_BD', 'Bengali (Bangladesh)');
export const BN_IN = /* @__PURE__ */ new Enum('bn_IN', 'Bengali (India)');
export const BS = /* @__PURE__ */ new Enum('bs', 'Bosnian');
export const BS_BA = /* @__PURE__ */ new Enum('bs_BA', 'Bosnian (Bosnia & Herzegovina)');
export const BS_CYRL_BA = /* @__PURE__ */ new Enum('bs_Cyrl_BA', 'Bosnian (Cyrillic, Bosnia & Herzegovina)');
export const BS_CYRL = /* @__PURE__ */ new Enum('bs_Cyrl', 'Bosnian (Cyrillic)', 'bs');
export const BS_LATN_BA = /* @__PURE__ */ new Enum('bs_Latn_BA', 'Bosnian (Latin, Bosnia & Herzegovina)');
export const BS_LATN = /* @__PURE__ */ new Enum('bs_Latn', 'Bosnian (Latin)', 'bs');
export const BR = /* @__PURE__ */ new Enum('br', 'Breton');
export const BR_FR = /* @__PURE__ */ new Enum('br_FR', 'Breton (France)');
export const BG = /* @__PURE__ */ new Enum('bg', 'Bulgarian');
export const BG_BG = /* @__PURE__ */ new Enum('bg_BG', 'Bulgarian (Bulgaria)');
export const MY = /* @__PURE__ */ new Enum('my', 'Burmese');
export const MY_MM = /* @__PURE__ */ new Enum('my_MM', 'Burmese (Myanmar (Burma))');
export const CA = /* @__PURE__ */ new Enum('ca', 'Catalan');
export const CA_AD = /* @__PURE__ */ new Enum('ca_AD', 'Catalan (Andorra)');
export const CA_FR = /* @__PURE__ */ new Enum('ca_FR', 'Catalan (France)');
export const CA_IT = /* @__PURE__ */ new Enum('ca_IT', 'Catalan (Italy)');
export const CA_ES = /* @__PURE__ */ new Enum('ca_ES', 'Catalan (Spain)');
export const ZH = /* @__PURE__ */ new Enum('zh', 'Chinese');
export const ZH_CN = /* @__PURE__ */ new Enum('zh_CN', 'Chinese (China)');
export const ZH_HK = /* @__PURE__ */ new Enum('zh_HK', 'Chinese (Hong Kong SAR China)');
export const ZH_MO = /* @__PURE__ */ new Enum('zh_MO', 'Chinese (Macau SAR China)');
export const ZH_HANS_CN = /* @__PURE__ */ new Enum('zh_Hans_CN', 'Chinese (Simplified, China)');
export const ZH_HANS_HK = /* @__PURE__ */ new Enum('zh_Hans_HK', 'Chinese (Simplified, Hong Kong SAR China)');
export const ZH_HANS_MO = /* @__PURE__ */ new Enum('zh_Hans_MO', 'Chinese (Simplified, Macau SAR China)');
export const ZH_HANS_SG = /* @__PURE__ */ new Enum('zh_Hans_SG', 'Chinese (Simplified, Singapore)');
export const ZH_HANS = /* @__PURE__ */ new Enum('zh_Hans', 'Chinese (Simplified)');
export const ZH_SG = /* @__PURE__ */ new Enum('zh_SG', 'Chinese (Singapore)');
export const ZH_TW = /* @__PURE__ */ new Enum('zh_TW', 'Chinese (Taiwan)');
export const ZH_HANT_HK = /* @__PURE__ */ new Enum('zh_Hant_HK', 'Chinese (Traditional, Hong Kong SAR China)');
export const ZH_HANT_MO = /* @__PURE__ */ new Enum('zh_Hant_MO', 'Chinese (Traditional, Macau SAR China)');
export const ZH_HANT_TW = /* @__PURE__ */ new Enum('zh_Hant_TW', 'Chinese (Traditional, Taiwan)');
export const ZH_HANT = /* @__PURE__ */ new Enum('zh_Hant', 'Chinese (Traditional)');
export const KW = /* @__PURE__ */ new Enum('kw', 'Cornish');
export const KW_GB = /* @__PURE__ */ new Enum('kw_GB', 'Cornish (United Kingdom)');
export const HR = /* @__PURE__ */ new Enum('hr', 'Croatian');
export const HR_BA = /* @__PURE__ */ new Enum('hr_BA', 'Croatian (Bosnia & Herzegovina)');
export const HR_HR = /* @__PURE__ */ new Enum('hr_HR', 'Croatian (Croatia)');
export const CS = /* @__PURE__ */ new Enum('cs', 'Czech');
export const CS_CZ = /* @__PURE__ */ new Enum('cs_CZ', 'Czech (Czech Republic)');
export const DA = /* @__PURE__ */ new Enum('da', 'Danish');
export const DA_DK = /* @__PURE__ */ new Enum('da_DK', 'Danish (Denmark)');
export const DA_GL = /* @__PURE__ */ new Enum('da_GL', 'Danish (Greenland)');
export const NL = /* @__PURE__ */ new Enum('nl', 'Dutch');
export const NL_AW = /* @__PURE__ */ new Enum('nl_AW', 'Dutch (Aruba)');
export const NL_BE = /* @__PURE__ */ new Enum('nl_BE', 'Dutch (Belgium)');
export const NL_BQ = /* @__PURE__ */ new Enum('nl_BQ', 'Dutch (Caribbean Netherlands)');
export const NL_CW = /* @__PURE__ */ new Enum('nl_CW', 'Dutch (Curaçao)');
export const NL_NL = /* @__PURE__ */ new Enum('nl_NL', 'Dutch (Netherlands)');
export const NL_SX = /* @__PURE__ */ new Enum('nl_SX', 'Dutch (Sint Maarten)');
export const NL_SR = /* @__PURE__ */ new Enum('nl_SR', 'Dutch (Suriname)');
export const DZ = /* @__PURE__ */ new Enum('dz', 'Dzongkha');
export const DZ_BT = /* @__PURE__ */ new Enum('dz_BT', 'Dzongkha (Bhutan)');
export const EN = /* @__PURE__ */ new Enum('en', 'English', 'gb');
export const EN_AS = /* @__PURE__ */ new Enum('en_AS', 'English (American Samoa)');
export const EN_AI = /* @__PURE__ */ new Enum('en_AI', 'English (Anguilla)');
export const EN_AG = /* @__PURE__ */ new Enum('en_AG', 'English (Antigua & Barbuda)');
export const EN_AU = /* @__PURE__ */ new Enum('en_AU', 'English (Australia)');
export const EN_BS = /* @__PURE__ */ new Enum('en_BS', 'English (Bahamas)');
export const EN_BB = /* @__PURE__ */ new Enum('en_BB', 'English (Barbados)');
export const EN_BE = /* @__PURE__ */ new Enum('en_BE', 'English (Belgium)');
export const EN_BZ = /* @__PURE__ */ new Enum('en_BZ', 'English (Belize)');
export const EN_BM = /* @__PURE__ */ new Enum('en_BM', 'English (Bermuda)');
export const EN_BW = /* @__PURE__ */ new Enum('en_BW', 'English (Botswana)');
export const EN_IO = /* @__PURE__ */ new Enum('en_IO', 'English (British Indian Ocean Territory)');
export const EN_VG = /* @__PURE__ */ new Enum('en_VG', 'English (British Virgin Islands)');
export const EN_CM = /* @__PURE__ */ new Enum('en_CM', 'English (Cameroon)');
export const EN_CA = /* @__PURE__ */ new Enum('en_CA', 'English (Canada)');
export const EN_KY = /* @__PURE__ */ new Enum('en_KY', 'English (Cayman Islands)');
export const EN_CX = /* @__PURE__ */ new Enum('en_CX', 'English (Christmas Island)');
export const EN_CC = /* @__PURE__ */ new Enum('en_CC', 'English (Cocos (Keeling) Islands)');
export const EN_CK = /* @__PURE__ */ new Enum('en_CK', 'English (Cook Islands)');
export const EN_DG = /* @__PURE__ */ new Enum('en_DG', 'English (Diego Garcia)');
export const EN_DM = /* @__PURE__ */ new Enum('en_DM', 'English (Dominica)');
export const EN_ER = /* @__PURE__ */ new Enum('en_ER', 'English (Eritrea)');
export const EN_FK = /* @__PURE__ */ new Enum('en_FK', 'English (Falkland Islands)');
export const EN_FJ = /* @__PURE__ */ new Enum('en_FJ', 'English (Fiji)');
export const EN_GM = /* @__PURE__ */ new Enum('en_GM', 'English (Gambia)');
export const EN_GH = /* @__PURE__ */ new Enum('en_GH', 'English (Ghana)');
export const EN_GI = /* @__PURE__ */ new Enum('en_GI', 'English (Gibraltar)');
export const EN_GD = /* @__PURE__ */ new Enum('en_GD', 'English (Grenada)');
export const EN_GU = /* @__PURE__ */ new Enum('en_GU', 'English (Guam)');
export const EN_GG = /* @__PURE__ */ new Enum('en_GG', 'English (Guernsey)');
export const EN_GY = /* @__PURE__ */ new Enum('en_GY', 'English (Guyana)');
export const EN_HK = /* @__PURE__ */ new Enum('en_HK', 'English (Hong Kong SAR China)');
export const EN_IN = /* @__PURE__ */ new Enum('en_IN', 'English (India)');
export const EN_IE = /* @__PURE__ */ new Enum('en_IE', 'English (Ireland)');
export const EN_IM = /* @__PURE__ */ new Enum('en_IM', 'English (Isle of Man)');
export const EN_JM = /* @__PURE__ */ new Enum('en_JM', 'English (Jamaica)');
export const EN_JE = /* @__PURE__ */ new Enum('en_JE', 'English (Jersey)');
export const EN_KE = /* @__PURE__ */ new Enum('en_KE', 'English (Kenya)');
export const EN_KI = /* @__PURE__ */ new Enum('en_KI', 'English (Kiribati)');
export const EN_LS = /* @__PURE__ */ new Enum('en_LS', 'English (Lesotho)');
export const EN_LR = /* @__PURE__ */ new Enum('en_LR', 'English (Liberia)');
export const EN_MO = /* @__PURE__ */ new Enum('en_MO', 'English (Macau SAR China)');
export const EN_MG = /* @__PURE__ */ new Enum('en_MG', 'English (Madagascar)');
export const EN_MW = /* @__PURE__ */ new Enum('en_MW', 'English (Malawi)');
export const EN_MY = /* @__PURE__ */ new Enum('en_MY', 'English (Malaysia)');
export const EN_MT = /* @__PURE__ */ new Enum('en_MT', 'English (Malta)');
export const EN_MH = /* @__PURE__ */ new Enum('en_MH', 'English (Marshall Islands)');
export const EN_MU = /* @__PURE__ */ new Enum('en_MU', 'English (Mauritius)');
export const EN_FM = /* @__PURE__ */ new Enum('en_FM', 'English (Micronesia)');
export const EN_MS = /* @__PURE__ */ new Enum('en_MS', 'English (Montserrat)');
export const EN_NA = /* @__PURE__ */ new Enum('en_NA', 'English (Namibia)');
export const EN_NR = /* @__PURE__ */ new Enum('en_NR', 'English (Nauru)');
export const EN_NZ = /* @__PURE__ */ new Enum('en_NZ', 'English (New Zealand)');
export const EN_NG = /* @__PURE__ */ new Enum('en_NG', 'English (Nigeria)');
export const EN_NU = /* @__PURE__ */ new Enum('en_NU', 'English (Niue)');
export const EN_NF = /* @__PURE__ */ new Enum('en_NF', 'English (Norfolk Island)');
export const EN_MP = /* @__PURE__ */ new Enum('en_MP', 'English (Northern Mariana Islands)');
export const EN_PK = /* @__PURE__ */ new Enum('en_PK', 'English (Pakistan)');
export const EN_PW = /* @__PURE__ */ new Enum('en_PW', 'English (Palau)');
export const EN_PG = /* @__PURE__ */ new Enum('en_PG', 'English (Papua New Guinea)');
export const EN_PH = /* @__PURE__ */ new Enum('en_PH', 'English (Philippines)');
export const EN_PN = /* @__PURE__ */ new Enum('en_PN', 'English (Pitcairn Islands)');
export const EN_PR = /* @__PURE__ */ new Enum('en_PR', 'English (Puerto Rico)');
export const EN_RW = /* @__PURE__ */ new Enum('en_RW', 'English (Rwanda)');
export const EN_WS = /* @__PURE__ */ new Enum('en_WS', 'English (Samoa)');
export const EN_SC = /* @__PURE__ */ new Enum('en_SC', 'English (Seychelles)');
export const EN_SL = /* @__PURE__ */ new Enum('en_SL', 'English (Sierra Leone)');
export const EN_SG = /* @__PURE__ */ new Enum('en_SG', 'English (Singapore)');
export const EN_SX = /* @__PURE__ */ new Enum('en_SX', 'English (Sint Maarten)');
export const EN_SB = /* @__PURE__ */ new Enum('en_SB', 'English (Solomon Islands)');
export const EN_ZA = /* @__PURE__ */ new Enum('en_ZA', 'English (South Africa)');
export const EN_SS = /* @__PURE__ */ new Enum('en_SS', 'English (South Sudan)');
export const EN_SH = /* @__PURE__ */ new Enum('en_SH', 'English (St. Helena)');
export const EN_KN = /* @__PURE__ */ new Enum('en_KN', 'English (St. Kitts & Nevis)');
export const EN_LC = /* @__PURE__ */ new Enum('en_LC', 'English (St. Lucia)');
export const EN_VC = /* @__PURE__ */ new Enum('en_VC', 'English (St. Vincent & Grenadines)');
export const EN_SD = /* @__PURE__ */ new Enum('en_SD', 'English (Sudan)');
export const EN_SZ = /* @__PURE__ */ new Enum('en_SZ', 'English (Swaziland)');
export const EN_TZ = /* @__PURE__ */ new Enum('en_TZ', 'English (Tanzania)');
export const EN_TK = /* @__PURE__ */ new Enum('en_TK', 'English (Tokelau)');
export const EN_TO = /* @__PURE__ */ new Enum('en_TO', 'English (Tonga)');
export const EN_TT = /* @__PURE__ */ new Enum('en_TT', 'English (Trinidad & Tobago)');
export const EN_TC = /* @__PURE__ */ new Enum('en_TC', 'English (Turks & Caicos Islands)');
export const EN_TV = /* @__PURE__ */ new Enum('en_TV', 'English (Tuvalu)');
export const EN_UM = /* @__PURE__ */ new Enum('en_UM', 'English (U.S. Outlying Islands)');
export const EN_VI = /* @__PURE__ */ new Enum('en_VI', 'English (U.S. Virgin Islands)');
export const EN_UG = /* @__PURE__ */ new Enum('en_UG', 'English (Uganda)');
export const EN_GB = /* @__PURE__ */ new Enum('en_GB', 'English (United Kingdom)');
export const EN_US = /* @__PURE__ */ new Enum('en_US', 'English (United States)');
export const EN_VU = /* @__PURE__ */ new Enum('en_VU', 'English (Vanuatu)');
export const EN_ZM = /* @__PURE__ */ new Enum('en_ZM', 'English (Zambia)');
export const EN_ZW = /* @__PURE__ */ new Enum('en_ZW', 'English (Zimbabwe)');
export const EO = /* @__PURE__ */ new Enum('eo', 'Esperanto');
export const ET = /* @__PURE__ */ new Enum('et', 'Estonian');
export const ET_EE = /* @__PURE__ */ new Enum('et_EE', 'Estonian (Estonia)');
export const EE = /* @__PURE__ */ new Enum('ee', 'Ewe');
export const EE_GH = /* @__PURE__ */ new Enum('ee_GH', 'Ewe (Ghana)');
export const EE_TG = /* @__PURE__ */ new Enum('ee_TG', 'Ewe (Togo)');
export const FO = /* @__PURE__ */ new Enum('fo', 'Faroese');
export const FO_FO = /* @__PURE__ */ new Enum('fo_FO', 'Faroese (Faroe Islands)');
export const FI = /* @__PURE__ */ new Enum('fi', 'Finnish');
export const FI_FI = /* @__PURE__ */ new Enum('fi_FI', 'Finnish (Finland)');
export const FR = /* @__PURE__ */ new Enum('fr', 'French');
export const FR_DZ = /* @__PURE__ */ new Enum('fr_DZ', 'French (Algeria)');
export const FR_BE = /* @__PURE__ */ new Enum('fr_BE', 'French (Belgium)');
export const FR_BJ = /* @__PURE__ */ new Enum('fr_BJ', 'French (Benin)');
export const FR_BF = /* @__PURE__ */ new Enum('fr_BF', 'French (Burkina Faso)');
export const FR_BI = /* @__PURE__ */ new Enum('fr_BI', 'French (Burundi)');
export const FR_CM = /* @__PURE__ */ new Enum('fr_CM', 'French (Cameroon)');
export const FR_CA = /* @__PURE__ */ new Enum('fr_CA', 'French (Canada)');
export const FR_CF = /* @__PURE__ */ new Enum('fr_CF', 'French (Central African Republic)');
export const FR_TD = /* @__PURE__ */ new Enum('fr_TD', 'French (Chad)');
export const FR_KM = /* @__PURE__ */ new Enum('fr_KM', 'French (Comoros)');
export const FR_CG = /* @__PURE__ */ new Enum('fr_CG', 'French (Congo - Brazzaville)');
export const FR_CD = /* @__PURE__ */ new Enum('fr_CD', 'French (Congo - Kinshasa)');
export const FR_CI = /* @__PURE__ */ new Enum('fr_CI', 'French (Côte d’Ivoire)');
export const FR_DJ = /* @__PURE__ */ new Enum('fr_DJ', 'French (Djibouti)');
export const FR_GQ = /* @__PURE__ */ new Enum('fr_GQ', 'French (Equatorial Guinea)');
export const FR_FR = /* @__PURE__ */ new Enum('fr_FR', 'French (France)');
export const FR_GF = /* @__PURE__ */ new Enum('fr_GF', 'French (French Guiana)');
export const FR_PF = /* @__PURE__ */ new Enum('fr_PF', 'French (French Polynesia)');
export const FR_GA = /* @__PURE__ */ new Enum('fr_GA', 'French (Gabon)');
export const FR_GP = /* @__PURE__ */ new Enum('fr_GP', 'French (Guadeloupe)');
export const FR_GN = /* @__PURE__ */ new Enum('fr_GN', 'French (Guinea)');
export const FR_HT = /* @__PURE__ */ new Enum('fr_HT', 'French (Haiti)');
export const FR_LU = /* @__PURE__ */ new Enum('fr_LU', 'French (Luxembourg)');
export const FR_MG = /* @__PURE__ */ new Enum('fr_MG', 'French (Madagascar)');
export const FR_ML = /* @__PURE__ */ new Enum('fr_ML', 'French (Mali)');
export const FR_MQ = /* @__PURE__ */ new Enum('fr_MQ', 'French (Martinique)');
export const FR_MR = /* @__PURE__ */ new Enum('fr_MR', 'French (Mauritania)');
export const FR_MU = /* @__PURE__ */ new Enum('fr_MU', 'French (Mauritius)');
export const FR_YT = /* @__PURE__ */ new Enum('fr_YT', 'French (Mayotte)');
export const FR_MC = /* @__PURE__ */ new Enum('fr_MC', 'French (Monaco)');
export const FR_MA = /* @__PURE__ */ new Enum('fr_MA', 'French (Morocco)');
export const FR_NC = /* @__PURE__ */ new Enum('fr_NC', 'French (New Caledonia)');
export const FR_NE = /* @__PURE__ */ new Enum('fr_NE', 'French (Niger)');
export const FR_RE = /* @__PURE__ */ new Enum('fr_RE', 'French (Réunion)');
export const FR_RW = /* @__PURE__ */ new Enum('fr_RW', 'French (Rwanda)');
export const FR_SN = /* @__PURE__ */ new Enum('fr_SN', 'French (Senegal)');
export const FR_SC = /* @__PURE__ */ new Enum('fr_SC', 'French (Seychelles)');
export const FR_BL = /* @__PURE__ */ new Enum('fr_BL', 'French (St. Barthélemy)');
export const FR_MF = /* @__PURE__ */ new Enum('fr_MF', 'French (St. Martin)');
export const FR_PM = /* @__PURE__ */ new Enum('fr_PM', 'French (St. Pierre & Miquelon)');
export const FR_CH = /* @__PURE__ */ new Enum('fr_CH', 'French (Switzerland)');
export const FR_SY = /* @__PURE__ */ new Enum('fr_SY', 'French (Syria)');
export const FR_TG = /* @__PURE__ */ new Enum('fr_TG', 'French (Togo)');
export const FR_TN = /* @__PURE__ */ new Enum('fr_TN', 'French (Tunisia)');
export const FR_VU = /* @__PURE__ */ new Enum('fr_VU', 'French (Vanuatu)');
export const FR_WF = /* @__PURE__ */ new Enum('fr_WF', 'French (Wallis & Futuna)');
export const FF = /* @__PURE__ */ new Enum('ff', 'Fulah');
export const FF_CM = /* @__PURE__ */ new Enum('ff_CM', 'Fulah (Cameroon)');
export const FF_GN = /* @__PURE__ */ new Enum('ff_GN', 'Fulah (Guinea)');
export const FF_MR = /* @__PURE__ */ new Enum('ff_MR', 'Fulah (Mauritania)');
export const FF_SN = /* @__PURE__ */ new Enum('ff_SN', 'Fulah (Senegal)');
export const GL = /* @__PURE__ */ new Enum('gl', 'Galician');
export const GL_ES = /* @__PURE__ */ new Enum('gl_ES', 'Galician (Spain)');
export const LG = /* @__PURE__ */ new Enum('lg', 'Ganda');
export const LG_UG = /* @__PURE__ */ new Enum('lg_UG', 'Ganda (Uganda)');
export const KA = /* @__PURE__ */ new Enum('ka', 'Georgian');
export const KA_GE = /* @__PURE__ */ new Enum('ka_GE', 'Georgian (Georgia)');
export const DE = /* @__PURE__ */ new Enum('de', 'German');
export const DE_AT = /* @__PURE__ */ new Enum('de_AT', 'German (Austria)');
export const DE_BE = /* @__PURE__ */ new Enum('de_BE', 'German (Belgium)');
export const DE_DE = /* @__PURE__ */ new Enum('de_DE', 'German (Germany)');
export const DE_LI = /* @__PURE__ */ new Enum('de_LI', 'German (Liechtenstein)');
export const DE_LU = /* @__PURE__ */ new Enum('de_LU', 'German (Luxembourg)');
export const DE_CH = /* @__PURE__ */ new Enum('de_CH', 'German (Switzerland)');
export const EL = /* @__PURE__ */ new Enum('el', 'Greek');
export const EL_CY = /* @__PURE__ */ new Enum('el_CY', 'Greek (Cyprus)');
export const EL_GR = /* @__PURE__ */ new Enum('el_GR', 'Greek (Greece)');
export const GU = /* @__PURE__ */ new Enum('gu', 'Gujarati');
export const GU_IN = /* @__PURE__ */ new Enum('gu_IN', 'Gujarati (India)');
export const HA = /* @__PURE__ */ new Enum('ha', 'Hausa');
export const HA_GH = /* @__PURE__ */ new Enum('ha_GH', 'Hausa (Ghana)');
export const HA_LATN_GH = /* @__PURE__ */ new Enum('ha_Latn_GH', 'Hausa (Latin, Ghana)');
export const HA_LATN_NE = /* @__PURE__ */ new Enum('ha_Latn_NE', 'Hausa (Latin, Niger)');
export const HA_LATN_NG = /* @__PURE__ */ new Enum('ha_Latn_NG', 'Hausa (Latin, Nigeria)');
export const HA_LATN = /* @__PURE__ */ new Enum('ha_Latn', 'Hausa (Latin)');
export const HA_NE = /* @__PURE__ */ new Enum('ha_NE', 'Hausa (Niger)');
export const HA_NG = /* @__PURE__ */ new Enum('ha_NG', 'Hausa (Nigeria)');
export const HE = /* @__PURE__ */ new Enum('he', 'Hebrew');
export const HE_IL = /* @__PURE__ */ new Enum('he_IL', 'Hebrew (Israel)');
export const HI = /* @__PURE__ */ new Enum('hi', 'Hindi');
export const HI_IN = /* @__PURE__ */ new Enum('hi_IN', 'Hindi (India)');
export const HU = /* @__PURE__ */ new Enum('hu', 'Hungarian');
export const HU_HU = /* @__PURE__ */ new Enum('hu_HU', 'Hungarian (Hungary)');
export const IS = /* @__PURE__ */ new Enum('is', 'Icelandic');
export const IS_IS = /* @__PURE__ */ new Enum('is_IS', 'Icelandic (Iceland)');
export const IG = /* @__PURE__ */ new Enum('ig', 'Igbo');
export const IG_NG = /* @__PURE__ */ new Enum('ig_NG', 'Igbo (Nigeria)');
export const ID = /* @__PURE__ */ new Enum('id', 'Indonesian');
export const ID_ID = /* @__PURE__ */ new Enum('id_ID', 'Indonesian (Indonesia)');
export const GA = /* @__PURE__ */ new Enum('ga', 'Irish');
export const GA_IE = /* @__PURE__ */ new Enum('ga_IE', 'Irish (Ireland)');
export const IT = /* @__PURE__ */ new Enum('it', 'Italian');
export const IT_IT = /* @__PURE__ */ new Enum('it_IT', 'Italian (Italy)');
export const IT_SM = /* @__PURE__ */ new Enum('it_SM', 'Italian (San Marino)');
export const IT_CH = /* @__PURE__ */ new Enum('it_CH', 'Italian (Switzerland)');
export const JA = /* @__PURE__ */ new Enum('ja', 'Japanese');
export const JA_JP = /* @__PURE__ */ new Enum('ja_JP', 'Japanese (Japan)');
export const KL = /* @__PURE__ */ new Enum('kl', 'Kalaallisut');
export const KL_GL = /* @__PURE__ */ new Enum('kl_GL', 'Kalaallisut (Greenland)');
export const KN = /* @__PURE__ */ new Enum('kn', 'Kannada');
export const KN_IN = /* @__PURE__ */ new Enum('kn_IN', 'Kannada (India)');
export const KS = /* @__PURE__ */ new Enum('ks', 'Kashmiri');
export const KS_ARAB_IN = /* @__PURE__ */ new Enum('ks_Arab_IN', 'Kashmiri (Arabic, India)');
export const KS_ARAB = /* @__PURE__ */ new Enum('ks_Arab', 'Kashmiri (Arabic)', 'ks');
export const KS_IN = /* @__PURE__ */ new Enum('ks_IN', 'Kashmiri (India)');
export const KK = /* @__PURE__ */ new Enum('kk', 'Kazakh');
export const KK_CYRL_KZ = /* @__PURE__ */ new Enum('kk_Cyrl_KZ', 'Kazakh (Cyrillic, Kazakhstan)');
export const KK_CYRL = /* @__PURE__ */ new Enum('kk_Cyrl', 'Kazakh (Cyrillic)', 'kk');
export const KK_KZ = /* @__PURE__ */ new Enum('kk_KZ', 'Kazakh (Kazakhstan)');
export const KM = /* @__PURE__ */ new Enum('km', 'Khmer');
export const KM_KH = /* @__PURE__ */ new Enum('km_KH', 'Khmer (Cambodia)');
export const KI = /* @__PURE__ */ new Enum('ki', 'Kikuyu');
export const KI_KE = /* @__PURE__ */ new Enum('ki_KE', 'Kikuyu (Kenya)');
export const RW = /* @__PURE__ */ new Enum('rw', 'Kinyarwanda');
export const RW_RW = /* @__PURE__ */ new Enum('rw_RW', 'Kinyarwanda (Rwanda)');
export const KO = /* @__PURE__ */ new Enum('ko', 'Korean');
export const KO_KP = /* @__PURE__ */ new Enum('ko_KP', 'Korean (North Korea)');
export const KO_KR = /* @__PURE__ */ new Enum('ko_KR', 'Korean (South Korea)');
export const KY = /* @__PURE__ */ new Enum('ky', 'Kyrgyz');
export const KY_CYRL_KG = /* @__PURE__ */ new Enum('ky_Cyrl_KG', 'Kyrgyz (Cyrillic, Kyrgyzstan)');
export const KY_CYRL = /* @__PURE__ */ new Enum('ky_Cyrl', 'Kyrgyz (Cyrillic)', 'ky');
export const KY_KG = /* @__PURE__ */ new Enum('ky_KG', 'Kyrgyz (Kyrgyzstan)');
export const LO = /* @__PURE__ */ new Enum('lo', 'Lao');
export const LO_LA = /* @__PURE__ */ new Enum('lo_LA', 'Lao (Laos)');
export const LV = /* @__PURE__ */ new Enum('lv', 'Latvian');
export const LV_LV = /* @__PURE__ */ new Enum('lv_LV', 'Latvian (Latvia)');
export const LN = /* @__PURE__ */ new Enum('ln', 'Lingala');
export const LN_AO = /* @__PURE__ */ new Enum('ln_AO', 'Lingala (Angola)');
export const LN_CF = /* @__PURE__ */ new Enum('ln_CF', 'Lingala (Central African Republic)');
export const LN_CG = /* @__PURE__ */ new Enum('ln_CG', 'Lingala (Congo - Brazzaville)');
export const LN_CD = /* @__PURE__ */ new Enum('ln_CD', 'Lingala (Congo - Kinshasa)');
export const LT = /* @__PURE__ */ new Enum('lt', 'Lithuanian');
export const LT_LT = /* @__PURE__ */ new Enum('lt_LT', 'Lithuanian (Lithuania)');
export const LU = /* @__PURE__ */ new Enum('lu', 'Luba-Katanga');
export const LU_CD = /* @__PURE__ */ new Enum('lu_CD', 'Luba-Katanga (Congo - Kinshasa)');
export const LB = /* @__PURE__ */ new Enum('lb', 'Luxembourgish');
export const LB_LU = /* @__PURE__ */ new Enum('lb_LU', 'Luxembourgish (Luxembourg)');
export const MK = /* @__PURE__ */ new Enum('mk', 'Macedonian');
export const MK_MK = /* @__PURE__ */ new Enum('mk_MK', 'Macedonian (Macedonia)');
export const MG = /* @__PURE__ */ new Enum('mg', 'Malagasy');
export const MG_MG = /* @__PURE__ */ new Enum('mg_MG', 'Malagasy (Madagascar)');
export const MS = /* @__PURE__ */ new Enum('ms', 'Malay');
export const MS_BN = /* @__PURE__ */ new Enum('ms_BN', 'Malay (Brunei)');
export const MS_LATN_BN = /* @__PURE__ */ new Enum('ms_Latn_BN', 'Malay (Latin, Brunei)');
export const MS_LATN_MY = /* @__PURE__ */ new Enum('ms_Latn_MY', 'Malay (Latin, Malaysia)');
export const MS_LATN_SG = /* @__PURE__ */ new Enum('ms_Latn_SG', 'Malay (Latin, Singapore)');
export const MS_LATN = /* @__PURE__ */ new Enum('ms_Latn', 'Malay (Latin)', 'ms');
export const MS_MY = /* @__PURE__ */ new Enum('ms_MY', 'Malay (Malaysia)');
export const MS_SG = /* @__PURE__ */ new Enum('ms_SG', 'Malay (Singapore)');
export const ML = /* @__PURE__ */ new Enum('ml', 'Malayalam');
export const ML_IN = /* @__PURE__ */ new Enum('ml_IN', 'Malayalam (India)');
export const MT = /* @__PURE__ */ new Enum('mt', 'Maltese');
export const MT_MT = /* @__PURE__ */ new Enum('mt_MT', 'Maltese (Malta)');
export const GV = /* @__PURE__ */ new Enum('gv', 'Manx');
export const GV_IM = /* @__PURE__ */ new Enum('gv_IM', 'Manx (Isle of Man)');
export const MR = /* @__PURE__ */ new Enum('mr', 'Marathi');
export const MR_IN = /* @__PURE__ */ new Enum('mr_IN', 'Marathi (India)');
export const MN = /* @__PURE__ */ new Enum('mn', 'Mongolian');
export const MN_CYRL_MN = /* @__PURE__ */ new Enum('mn_Cyrl_MN', 'Mongolian (Cyrillic, Mongolia)');
export const MN_CYRL = /* @__PURE__ */ new Enum('mn_Cyrl', 'Mongolian (Cyrillic)', 'mn');
export const MN_MN = /* @__PURE__ */ new Enum('mn_MN', 'Mongolian (Mongolia)');
export const NE = /* @__PURE__ */ new Enum('ne', 'Nepali');
export const NE_IN = /* @__PURE__ */ new Enum('ne_IN', 'Nepali (India)');
export const NE_NP = /* @__PURE__ */ new Enum('ne_NP', 'Nepali (Nepal)');
export const ND = /* @__PURE__ */ new Enum('nd', 'North Ndebele');
export const ND_ZW = /* @__PURE__ */ new Enum('nd_ZW', 'North Ndebele (Zimbabwe)');
export const SE = /* @__PURE__ */ new Enum('se', 'Northern Sami');
export const SE_FI = /* @__PURE__ */ new Enum('se_FI', 'Northern Sami (Finland)');
export const SE_NO = /* @__PURE__ */ new Enum('se_NO', 'Northern Sami (Norway)');
export const SE_SE = /* @__PURE__ */ new Enum('se_SE', 'Northern Sami (Sweden)');
export const NO = /* @__PURE__ */ new Enum('no', 'Norwegian');
export const NO_NO = /* @__PURE__ */ new Enum('no_NO', 'Norwegian (Norway)');
export const NB = /* @__PURE__ */ new Enum('nb', 'Norwegian Bokmål');
export const NB_NO = /* @__PURE__ */ new Enum('nb_NO', 'Norwegian Bokmål (Norway)');
export const NB_SJ = /* @__PURE__ */ new Enum('nb_SJ', 'Norwegian Bokmål (Svalbard & Jan Mayen)');
export const NN = /* @__PURE__ */ new Enum('nn', 'Norwegian Nynorsk');
export const NN_NO = /* @__PURE__ */ new Enum('nn_NO', 'Norwegian Nynorsk (Norway)');
export const OR = /* @__PURE__ */ new Enum('or', 'Oriya');
export const OR_IN = /* @__PURE__ */ new Enum('or_IN', 'Oriya (India)');
export const OM = /* @__PURE__ */ new Enum('om', 'Oromo');
export const OM_ET = /* @__PURE__ */ new Enum('om_ET', 'Oromo (Ethiopia)');
export const OM_KE = /* @__PURE__ */ new Enum('om_KE', 'Oromo (Kenya)');
export const OS = /* @__PURE__ */ new Enum('os', 'Ossetic');
export const OS_GE = /* @__PURE__ */ new Enum('os_GE', 'Ossetic (Georgia)');
export const OS_RU = /* @__PURE__ */ new Enum('os_RU', 'Ossetic (Russia)');
export const PS = /* @__PURE__ */ new Enum('ps', 'Pashto');
export const PS_AF = /* @__PURE__ */ new Enum('ps_AF', 'Pashto (Afghanistan)');
export const FA = /* @__PURE__ */ new Enum('fa', 'Persian');
export const FA_AF = /* @__PURE__ */ new Enum('fa_AF', 'Persian (Afghanistan)');
export const FA_IR = /* @__PURE__ */ new Enum('fa_IR', 'Persian (Iran)');
export const PL = /* @__PURE__ */ new Enum('pl', 'Polish');
export const PL_PL = /* @__PURE__ */ new Enum('pl_PL', 'Polish (Poland)');
export const PT = /* @__PURE__ */ new Enum('pt', 'Portuguese');
export const PT_AO = /* @__PURE__ */ new Enum('pt_AO', 'Portuguese (Angola)');
export const PT_BR = /* @__PURE__ */ new Enum('pt_BR', 'Portuguese (Brazil)');
export const PT_CV = /* @__PURE__ */ new Enum('pt_CV', 'Portuguese (Cape Verde)');
export const PT_GW = /* @__PURE__ */ new Enum('pt_GW', 'Portuguese (Guinea-Bissau)');
export const PT_MO = /* @__PURE__ */ new Enum('pt_MO', 'Portuguese (Macau SAR China)');
export const PT_MZ = /* @__PURE__ */ new Enum('pt_MZ', 'Portuguese (Mozambique)');
export const PT_PT = /* @__PURE__ */ new Enum('pt_PT', 'Portuguese (Portugal)');
export const PT_ST = /* @__PURE__ */ new Enum('pt_ST', 'Portuguese (São Tomé & Príncipe)');
export const PT_TL = /* @__PURE__ */ new Enum('pt_TL', 'Portuguese (Timor-Leste)');
export const PA = /* @__PURE__ */ new Enum('pa', 'Punjabi');
export const PA_ARAB_PK = /* @__PURE__ */ new Enum('pa_Arab_PK', 'Punjabi (Arabic, Pakistan)');
export const PA_ARAB = /* @__PURE__ */ new Enum('pa_Arab', 'Punjabi (Arabic)', 'pa');
export const PA_GURU_IN = /* @__PURE__ */ new Enum('pa_Guru_IN', 'Punjabi (Gurmukhi, India)');
export const PA_GURU = /* @__PURE__ */ new Enum('pa_Guru', 'Punjabi (Gurmukhi)', 'pa');
export const PA_IN = /* @__PURE__ */ new Enum('pa_IN', 'Punjabi (India)');
export const PA_PK = /* @__PURE__ */ new Enum('pa_PK', 'Punjabi (Pakistan)');
export const QU = /* @__PURE__ */ new Enum('qu', 'Quechua');
export const QU_BO = /* @__PURE__ */ new Enum('qu_BO', 'Quechua (Bolivia)');
export const QU_EC = /* @__PURE__ */ new Enum('qu_EC', 'Quechua (Ecuador)');
export const QU_PE = /* @__PURE__ */ new Enum('qu_PE', 'Quechua (Peru)');
export const RO = /* @__PURE__ */ new Enum('ro', 'Romanian');
export const RO_MD = /* @__PURE__ */ new Enum('ro_MD', 'Romanian (Moldova)');
export const RO_RO = /* @__PURE__ */ new Enum('ro_RO', 'Romanian (Romania)');
export const RM = /* @__PURE__ */ new Enum('rm', 'Romansh');
export const RM_CH = /* @__PURE__ */ new Enum('rm_CH', 'Romansh (Switzerland)');
export const RN = /* @__PURE__ */ new Enum('rn', 'Rundi');
export const RN_BI = /* @__PURE__ */ new Enum('rn_BI', 'Rundi (Burundi)');
export const RU = /* @__PURE__ */ new Enum('ru', 'Russian');
export const RU_BY = /* @__PURE__ */ new Enum('ru_BY', 'Russian (Belarus)');
export const RU_KZ = /* @__PURE__ */ new Enum('ru_KZ', 'Russian (Kazakhstan)');
export const RU_KG = /* @__PURE__ */ new Enum('ru_KG', 'Russian (Kyrgyzstan)');
export const RU_MD = /* @__PURE__ */ new Enum('ru_MD', 'Russian (Moldova)');
export const RU_RU = /* @__PURE__ */ new Enum('ru_RU', 'Russian (Russia)');
export const RU_UA = /* @__PURE__ */ new Enum('ru_UA', 'Russian (Ukraine)');
export const SG = /* @__PURE__ */ new Enum('sg', 'Sango');
export const SG_CF = /* @__PURE__ */ new Enum('sg_CF', 'Sango (Central African Republic)');
export const GD = /* @__PURE__ */ new Enum('gd', 'Scottish Gaelic');
export const GD_GB = /* @__PURE__ */ new Enum('gd_GB', 'Scottish Gaelic (United Kingdom)');
export const SR = /* @__PURE__ */ new Enum('sr', 'Serbian');
export const SR_BA = /* @__PURE__ */ new Enum('sr_BA', 'Serbian (Bosnia & Herzegovina)');
export const SR_CYRL_BA = /* @__PURE__ */ new Enum('sr_Cyrl_BA', 'Serbian (Cyrillic, Bosnia & Herzegovina)');
export const SR_CYRL_XK = /* @__PURE__ */ new Enum('sr_Cyrl_XK', 'Serbian (Cyrillic, Kosovo)');
export const SR_CYRL_ME = /* @__PURE__ */ new Enum('sr_Cyrl_ME', 'Serbian (Cyrillic, Montenegro)');
export const SR_CYRL_RS = /* @__PURE__ */ new Enum('sr_Cyrl_RS', 'Serbian (Cyrillic, Serbia)');
export const SR_CYRL = /* @__PURE__ */ new Enum('sr_Cyrl', 'Serbian (Cyrillic)', 'sr');
export const SR_XK = /* @__PURE__ */ new Enum('sr_XK', 'Serbian (Kosovo)');
export const SR_LATN_BA = /* @__PURE__ */ new Enum('sr_Latn_BA', 'Serbian (Latin, Bosnia & Herzegovina)');
export const SR_LATN_XK = /* @__PURE__ */ new Enum('sr_Latn_XK', 'Serbian (Latin, Kosovo)');
export const SR_LATN_ME = /* @__PURE__ */ new Enum('sr_Latn_ME', 'Serbian (Latin, Montenegro)');
export const SR_LATN_RS = /* @__PURE__ */ new Enum('sr_Latn_RS', 'Serbian (Latin, Serbia)');
export const SR_LATN = /* @__PURE__ */ new Enum('sr_Latn', 'Serbian (Latin)', 'sr');
export const SR_ME = /* @__PURE__ */ new Enum('sr_ME', 'Serbian (Montenegro)');
export const SR_RS = /* @__PURE__ */ new Enum('sr_RS', 'Serbian (Serbia)');
export const SH = /* @__PURE__ */ new Enum('sh', 'Serbo-Croatian');
export const SH_BA = /* @__PURE__ */ new Enum('sh_BA', 'Serbo-Croatian (Bosnia & Herzegovina)');
export const SN = /* @__PURE__ */ new Enum('sn', 'Shona');
export const SN_ZW = /* @__PURE__ */ new Enum('sn_ZW', 'Shona (Zimbabwe)');
export const II = /* @__PURE__ */ new Enum('ii', 'Sichuan Yi');
export const II_CN = /* @__PURE__ */ new Enum('ii_CN', 'Sichuan Yi (China)');
export const SI = /* @__PURE__ */ new Enum('si', 'Sinhala');
export const SI_LK = /* @__PURE__ */ new Enum('si_LK', 'Sinhala (Sri Lanka)');
export const SK = /* @__PURE__ */ new Enum('sk', 'Slovak');
export const SK_SK = /* @__PURE__ */ new Enum('sk_SK', 'Slovak (Slovakia)');
export const SL = /* @__PURE__ */ new Enum('sl', 'Slovenian');
export const SL_SI = /* @__PURE__ */ new Enum('sl_SI', 'Slovenian (Slovenia)');
export const SO = /* @__PURE__ */ new Enum('so', 'Somali');
export const SO_DJ = /* @__PURE__ */ new Enum('so_DJ', 'Somali (Djibouti)');
export const SO_ET = /* @__PURE__ */ new Enum('so_ET', 'Somali (Ethiopia)');
export const SO_KE = /* @__PURE__ */ new Enum('so_KE', 'Somali (Kenya)');
export const SO_SO = /* @__PURE__ */ new Enum('so_SO', 'Somali (Somalia)');
export const ES = /* @__PURE__ */ new Enum('es', 'Spanish');
export const ES_AR = /* @__PURE__ */ new Enum('es_AR', 'Spanish (Argentina)');
export const ES_BO = /* @__PURE__ */ new Enum('es_BO', 'Spanish (Bolivia)');
export const ES_IC = /* @__PURE__ */ new Enum('es_IC', 'Spanish (Canary Islands)');
export const ES_EA = /* @__PURE__ */ new Enum('es_EA', 'Spanish (Ceuta & Melilla)');
export const ES_CL = /* @__PURE__ */ new Enum('es_CL', 'Spanish (Chile)');
export const ES_CO = /* @__PURE__ */ new Enum('es_CO', 'Spanish (Colombia)');
export const ES_CR = /* @__PURE__ */ new Enum('es_CR', 'Spanish (Costa Rica)');
export const ES_CU = /* @__PURE__ */ new Enum('es_CU', 'Spanish (Cuba)');
export const ES_DO = /* @__PURE__ */ new Enum('es_DO', 'Spanish (Dominican Republic)');
export const ES_EC = /* @__PURE__ */ new Enum('es_EC', 'Spanish (Ecuador)');
export const ES_SV = /* @__PURE__ */ new Enum('es_SV', 'Spanish (El Salvador)');
export const ES_GQ = /* @__PURE__ */ new Enum('es_GQ', 'Spanish (Equatorial Guinea)');
export const ES_GT = /* @__PURE__ */ new Enum('es_GT', 'Spanish (Guatemala)');
export const ES_HN = /* @__PURE__ */ new Enum('es_HN', 'Spanish (Honduras)');
export const ES_MX = /* @__PURE__ */ new Enum('es_MX', 'Spanish (Mexico)');
export const ES_NI = /* @__PURE__ */ new Enum('es_NI', 'Spanish (Nicaragua)');
export const ES_PA = /* @__PURE__ */ new Enum('es_PA', 'Spanish (Panama)');
export const ES_PY = /* @__PURE__ */ new Enum('es_PY', 'Spanish (Paraguay)');
export const ES_PE = /* @__PURE__ */ new Enum('es_PE', 'Spanish (Peru)');
export const ES_PH = /* @__PURE__ */ new Enum('es_PH', 'Spanish (Philippines)');
export const ES_PR = /* @__PURE__ */ new Enum('es_PR', 'Spanish (Puerto Rico)');
export const ES_ES = /* @__PURE__ */ new Enum('es_ES', 'Spanish (Spain)');
export const ES_US = /* @__PURE__ */ new Enum('es_US', 'Spanish (United States)');
export const ES_UY = /* @__PURE__ */ new Enum('es_UY', 'Spanish (Uruguay)');
export const ES_VE = /* @__PURE__ */ new Enum('es_VE', 'Spanish (Venezuela)');
export const SW = /* @__PURE__ */ new Enum('sw', 'Swahili');
export const SW_KE = /* @__PURE__ */ new Enum('sw_KE', 'Swahili (Kenya)');
export const SW_TZ = /* @__PURE__ */ new Enum('sw_TZ', 'Swahili (Tanzania)');
export const SW_UG = /* @__PURE__ */ new Enum('sw_UG', 'Swahili (Uganda)');
export const SV = /* @__PURE__ */ new Enum('sv', 'Swedish');
export const SV_AX = /* @__PURE__ */ new Enum('sv_AX', 'Swedish (Åland Islands)');
export const SV_FI = /* @__PURE__ */ new Enum('sv_FI', 'Swedish (Finland)');
export const SV_SE = /* @__PURE__ */ new Enum('sv_SE', 'Swedish (Sweden)');
export const TL = /* @__PURE__ */ new Enum('tl', 'Tagalog');
export const TL_PH = /* @__PURE__ */ new Enum('tl_PH', 'Tagalog (Philippines)');
export const TA = /* @__PURE__ */ new Enum('ta', 'Tamil');
export const TA_IN = /* @__PURE__ */ new Enum('ta_IN', 'Tamil (India)');
export const TA_MY = /* @__PURE__ */ new Enum('ta_MY', 'Tamil (Malaysia)');
export const TA_SG = /* @__PURE__ */ new Enum('ta_SG', 'Tamil (Singapore)');
export const TA_LK = /* @__PURE__ */ new Enum('ta_LK', 'Tamil (Sri Lanka)');
export const TE = /* @__PURE__ */ new Enum('te', 'Telugu');
export const TE_IN = /* @__PURE__ */ new Enum('te_IN', 'Telugu (India)');
export const TH = /* @__PURE__ */ new Enum('th', 'Thai');
export const TH_TH = /* @__PURE__ */ new Enum('th_TH', 'Thai (Thailand)');
export const BO = /* @__PURE__ */ new Enum('bo', 'Tibetan');
export const BO_CN = /* @__PURE__ */ new Enum('bo_CN', 'Tibetan (China)');
export const BO_IN = /* @__PURE__ */ new Enum('bo_IN', 'Tibetan (India)');
export const TI = /* @__PURE__ */ new Enum('ti', 'Tigrinya');
export const TI_ER = /* @__PURE__ */ new Enum('ti_ER', 'Tigrinya (Eritrea)');
export const TI_ET = /* @__PURE__ */ new Enum('ti_ET', 'Tigrinya (Ethiopia)');
export const TO = /* @__PURE__ */ new Enum('to', 'Tongan');
export const TO_TO = /* @__PURE__ */ new Enum('to_TO', 'Tongan (Tonga)');
export const TR = /* @__PURE__ */ new Enum('tr', 'Turkish');
export const TR_CY = /* @__PURE__ */ new Enum('tr_CY', 'Turkish (Cyprus)');
export const TR_TR = /* @__PURE__ */ new Enum('tr_TR', 'Turkish (Turkey)');
export const UK = /* @__PURE__ */ new Enum('uk', 'Ukrainian');
export const UK_UA = /* @__PURE__ */ new Enum('uk_UA', 'Ukrainian (Ukraine)');
export const UR = /* @__PURE__ */ new Enum('ur', 'Urdu');
export const UR_IN = /* @__PURE__ */ new Enum('ur_IN', 'Urdu (India)');
export const UR_PK = /* @__PURE__ */ new Enum('ur_PK', 'Urdu (Pakistan)');
export const UG = /* @__PURE__ */ new Enum('ug', 'Uyghur');
export const UG_ARAB_CN = /* @__PURE__ */ new Enum('ug_Arab_CN', 'Uyghur (Arabic, China)');
export const UG_ARAB = /* @__PURE__ */ new Enum('ug_Arab', 'Uyghur (Arabic)');
export const UG_CN = /* @__PURE__ */ new Enum('ug_CN', 'Uyghur (China)');
export const UZ = /* @__PURE__ */ new Enum('uz', 'Uzbek');
export const UZ_AF = /* @__PURE__ */ new Enum('uz_AF', 'Uzbek (Afghanistan)');
export const UZ_ARAB_AF = /* @__PURE__ */ new Enum('uz_Arab_AF', 'Uzbek (Arabic, Afghanistan)');
export const UZ_ARAB = /* @__PURE__ */ new Enum('uz_Arab', 'Uzbek (Arabic)', 'uz');
export const UZ_CYRL_UZ = /* @__PURE__ */ new Enum('uz_Cyrl_UZ', 'Uzbek (Cyrillic, Uzbekistan)');
export const UZ_CYRL = /* @__PURE__ */ new Enum('uz_Cyrl', 'Uzbek (Cyrillic)', 'uz');
export const UZ_LATN_UZ = /* @__PURE__ */ new Enum('uz_Latn_UZ', 'Uzbek (Latin, Uzbekistan)');
export const UZ_LATN = /* @__PURE__ */ new Enum('uz_Latn', 'Uzbek (Latin)', 'uz');
export const UZ_UZ = /* @__PURE__ */ new Enum('uz_UZ', 'Uzbek (Uzbekistan)');
export const VI = /* @__PURE__ */ new Enum('vi', 'Vietnamese');
export const VI_VN = /* @__PURE__ */ new Enum('vi_VN', 'Vietnamese (Vietnam)');
export const CY = /* @__PURE__ */ new Enum('cy', 'Welsh');
export const CY_GB = /* @__PURE__ */ new Enum('cy_GB', 'Welsh (United Kingdom)');
export const FY = /* @__PURE__ */ new Enum('fy', 'Western Frisian');
export const FY_NL = /* @__PURE__ */ new Enum('fy_NL', 'Western Frisian (Netherlands)');
export const YI = /* @__PURE__ */ new Enum('yi', 'Yiddish');
export const YO = /* @__PURE__ */ new Enum('yo', 'Yoruba');
export const YO_BJ = /* @__PURE__ */ new Enum('yo_BJ', 'Yoruba (Benin)');
export const YO_NG = /* @__PURE__ */ new Enum('yo_NG', 'Yoruba (Nigeria)');
export const ZU = /* @__PURE__ */ new Enum('zu', 'Zulu');
export const ZU_ZA = /* @__PURE__ */ new Enum('zu_ZA', 'Zulu (South Africa)');

const registry = /* @__PURE__ */ lazyRegistry(() => ({
  AF,
  AF_NA,
  AF_ZA,
  AK,
  AK_GH,
  SQ,
  SQ_AL,
  SQ_XK,
  SQ_MK,
  AM,
  AM_ET,
  AR,
  AR_DZ,
  AR_BH,
  AR_TD,
  AR_KM,
  AR_DJ,
  AR_EG,
  AR_ER,
  AR_IQ,
  AR_IL,
  AR_JO,
  AR_KW,
  AR_LB,
  AR_LY,
  AR_MR,
  AR_MA,
  AR_OM,
  AR_PS,
  AR_QA,
  AR_SA,
  AR_SO,
  AR_SS,
  AR_SD,
  AR_SY,
  AR_TN,
  AR_AE,
  AR_EH,
  AR_YE,
  HY,
  HY_AM,
  AS,
  AS_IN,
  AZ,
  AZ_AZ,
  AZ_CYRL_AZ,
  AZ_CYRL,
  AZ_LATN_AZ,
  AZ_LATN,
  BM,
  BM_LATN_ML,
  BM_LATN,
  EU,
  EU_ES,
  BE,
  BE_BY,
  BN,
  BN_BD,
  BN_IN,
  BS,
  BS_BA,
  BS_CYRL_BA,
  BS_CYRL,
  BS_LATN_BA,
  BS_LATN,
  BR,
  BR_FR,
  BG,
  BG_BG,
  MY,
  MY_MM,
  CA,
  CA_AD,
  CA_FR,
  CA_IT,
  CA_ES,
  ZH,
  ZH_CN,
  ZH_HK,
  ZH_MO,
  ZH_HANS_CN,
  ZH_HANS_HK,
  ZH_HANS_MO,
  ZH_HANS_SG,
  ZH_HANS,
  ZH_SG,
  ZH_TW,
  ZH_HANT_HK,
  ZH_HANT_MO,
  ZH_HANT_TW,
  ZH_HANT,
  KW,
  KW_GB,
  HR,
  HR_BA,
  HR_HR,
  CS,
  CS_CZ,
  DA,
  DA_DK,
  DA_GL,
  NL,
  NL_AW,
  NL_BE,
  NL_BQ,
  NL_CW,
  NL_NL,
  NL_SX,
  NL_SR,
  DZ,
  DZ_BT,
  EN,
  EN_AS,
  EN_AI,
  EN_AG,
  EN_AU,
  EN_BS,
  EN_BB,
  EN_BE,
  EN_BZ,
  EN_BM,
  EN_BW,
  EN_IO,
  EN_VG,
  EN_CM,
  EN_CA,
  EN_KY,
  EN_CX,
  EN_CC,
  EN_CK,
  EN_DG,
  EN_DM,
  EN_ER,
  EN_FK,
  EN_FJ,
  EN_GM,
  EN_GH,
  EN_GI,
  EN_GD,
  EN_GU,
  EN_GG,
  EN_GY,
  EN_HK,
  EN_IN,
  EN_IE,
  EN_IM,
  EN_JM,
  EN_JE,
  EN_KE,
  EN_KI,
  EN_LS,
  EN_LR,
  EN_MO,
  EN_MG,
  EN_MW,
  EN_MY,
  EN_MT,
  EN_MH,
  EN_MU,
  EN_FM,
  EN_MS,
  EN_NA,
  EN_NR,
  EN_NZ,
  EN_NG,
  EN_NU,
  EN_NF,
  EN_MP,
  EN_PK,
  EN_PW,
  EN_PG,
  EN_PH,
  EN_PN,
  EN_PR,
  EN_RW,
  EN_WS,
  EN_SC,
  EN_SL,
  EN_SG,
  EN_SX,
  EN_SB,
  EN_ZA,
  EN_SS,
  EN_SH,
  EN_KN,
  EN_LC,
  EN_VC,
  EN_SD,
  EN_SZ,
  EN_TZ,
  EN_TK,
  EN_TO,
  EN_TT,
  EN_TC,
  EN_TV,
  EN_UM,
  EN_VI,
  EN_UG,
  EN_GB,
  EN_US,
  EN_VU,
  EN_ZM,
  EN_ZW,
  EO,
  ET,
  ET_EE,
  EE,
  EE_GH,
  EE_TG,
  FO,
  FO_FO,
  FI,
  FI_FI,
  FR,
  FR_DZ,
  FR_BE,
  FR_BJ,
  FR_BF,
  FR_BI,
  FR_CM,
  FR_CA,
  FR_CF,
  FR_TD,
  FR_KM,
  FR_CG,
  FR_CD,
  FR_CI,
  FR_DJ,
  FR_GQ,
  FR_FR,
  FR_GF,
  FR_PF,
  FR_GA,
  FR_GP,
  FR_GN,
  FR_HT,
  FR_LU,
  FR_MG,
  FR_ML,
  FR_MQ,
  FR_MR,
  FR_MU,
  FR_YT,
  FR_MC,
  FR_MA,
  FR_NC,
  FR_NE,
  FR_RE,
  FR_RW,
  FR_SN,
  FR_SC,
  FR_BL,
  FR_MF,
  FR_PM,
  FR_CH,
  FR_SY,
  FR_TG,
  FR_TN,
  FR_VU,
  FR_WF,
  FF,
  FF_CM,
  FF_GN,
  FF_MR,
  FF_SN,
  GL,
  GL_ES,
  LG,
  LG_UG,
  KA,
  KA_GE,
  DE,
  DE_AT,
  DE_BE,
  DE_DE,
  DE_LI,
  DE_LU,
  DE_CH,
  EL,
  EL_CY,
  EL_GR,
  GU,
  GU_IN,
  HA,
  HA_GH,
  HA_LATN_GH,
  HA_LATN_NE,
  HA_LATN_NG,
  HA_LATN,
  HA_NE,
  HA_NG,
  HE,
  HE_IL,
  HI,
  HI_IN,
  HU,
  HU_HU,
  IS,
  IS_IS,
  IG,
  IG_NG,
  ID,
  ID_ID,
  GA,
  GA_IE,
  IT,
  IT_IT,
  IT_SM,
  IT_CH,
  JA,
  JA_JP,
  KL,
  KL_GL,
  KN,
  KN_IN,
  KS,
  KS_ARAB_IN,
  KS_ARAB,
  KS_IN,
  KK,
  KK_CYRL_KZ,
  KK_CYRL,
  KK_KZ,
  KM,
  KM_KH,
  KI,
  KI_KE,
  RW,
  RW_RW,
  KO,
  KO_KP,
  KO_KR,
  KY,
  KY_CYRL_KG,
  KY_CYRL,
  KY_KG,
  LO,
  LO_LA,
  LV,
  LV_LV,
  LN,
  LN_AO,
  LN_CF,
  LN_CG,
  LN_CD,
  LT,
  LT_LT,
  LU,
  LU_CD,
  LB,
  LB_LU,
  MK,
  MK_MK,
  MG,
  MG_MG,
  MS,
  MS_BN,
  MS_LATN_BN,
  MS_LATN_MY,
  MS_LATN_SG,
  MS_LATN,
  MS_MY,
  MS_SG,
  ML,
  ML_IN,
  MT,
  MT_MT,
  GV,
  GV_IM,
  MR,
  MR_IN,
  MN,
  MN_CYRL_MN,
  MN_CYRL,
  MN_MN,
  NE,
  NE_IN,
  NE_NP,
  ND,
  ND_ZW,
  SE,
  SE_FI,
  SE_NO,
  SE_SE,
  NO,
  NO_NO,
  NB,
  NB_NO,
  NB_SJ,
  NN,
  NN_NO,
  OR,
  OR_IN,
  OM,
  OM_ET,
  OM_KE,
  OS,
  OS_GE,
  OS_RU,
  PS,
  PS_AF,
  FA,
  FA_AF,
  FA_IR,
  PL,
  PL_PL,
  PT,
  PT_AO,
  PT_BR,
  PT_CV,
  PT_GW,
  PT_MO,
  PT_MZ,
  PT_PT,
  PT_ST,
  PT_TL,
  PA,
  PA_ARAB_PK,
  PA_ARAB,
  PA_GURU_IN,
  PA_GURU,
  PA_IN,
  PA_PK,
  QU,
  QU_BO,
  QU_EC,
  QU_PE,
  RO,
  RO_MD,
  RO_RO,
  RM,
  RM_CH,
  RN,
  RN_BI,
  RU,
  RU_BY,
  RU_KZ,
  RU_KG,
  RU_MD,
  RU_RU,
  RU_UA,
  SG,
  SG_CF,
  GD,
  GD_GB,
  SR,
  SR_BA,
  SR_CYRL_BA,
  SR_CYRL_XK,
  SR_CYRL_ME,
  SR_CYRL_RS,
  SR_CYRL,
  SR_XK,
  SR_LATN_BA,
  SR_LATN_XK,
  SR_LATN_ME,
  SR_LATN_RS,
  SR_LATN,
  SR_ME,
  SR_RS,
  SH,
  SH_BA,
  SN,
  SN_ZW,
  II,
  II_CN,
  SI,
  SI_LK,
  SK,
  SK_SK,
  SL,
  SL_SI,
  SO,
  SO_DJ,
  SO_ET,
  SO_KE,
  SO_SO,
  ES,
  ES_AR,
  ES_BO,
  ES_IC,
  ES_EA,
  ES_CL,
  ES_CO,
  ES_CR,
  ES_CU,
  ES_DO,
  ES_EC,
  ES_SV,
  ES_GQ,
  ES_GT,
  ES_HN,
  ES_MX,
  ES_NI,
  ES_PA,
  ES_PY,
  ES_PE,
  ES_PH,
  ES_PR,
  ES_ES,
  ES_US,
  ES_UY,
  ES_VE,
  SW,
  SW_KE,
  SW_TZ,
  SW_UG,
  SV,
  SV_AX,
  SV_FI,
  SV_SE,
  TL,
  TL_PH,
  TA,
  TA_IN,
  TA_MY,
  TA_SG,
  TA_LK,
  TE,
  TE_IN,
  TH,
  TH_TH,
  BO,
  BO_CN,
  BO_IN,
  TI,
  TI_ER,
  TI_ET,
  TO,
  TO_TO,
  TR,
  TR_CY,
  TR_TR,
  UK,
  UK_UA,
  UR,
  UR_IN,
  UR_PK,
  UG,
  UG_ARAB_CN,
  UG_ARAB,
  UG_CN,
  UZ,
  UZ_AF,
  UZ_ARAB_AF,
  UZ_ARAB,
  UZ_CYRL_UZ,
  UZ_CYRL,
  UZ_LATN_UZ,
  UZ_LATN,
  UZ_UZ,
  VI,
  VI_VN,
  CY,
  CY_GB,
  FY,
  FY_NL,
  YI,
  YO,
  YO_BJ,
  YO_NG,
  ZU,
  ZU_ZA,
}));
export const all: Registry<Enum>['all'] = () => registry.all();
export const byId: Registry<Enum>['byId'] = (id, alt) => registry.byId(id, alt);
export const byIds: Registry<Enum>['byIds'] = ids => registry.byIds(ids);
export const filter: Registry<Enum>['filter'] = (predicate, params) => registry.filter(predicate, params);
export const first: Registry<Enum>['first'] = (predicate, params) => registry.first(predicate, params);
export const lookup = (other: string): Optional<Enum> => first(value => value.equals(other));
