const BEACH_TAGS = {
  _CALIDAD_: {
    parent: {
      name: "_CALIDAD_",
      text: "Estado agua de baño",
      value: null
    },
    params: [
      { name: "_ESTADO_BUENAS_CONDICIONES_", text: "Buenas condiciones", value: "_EXCEL_LENT_", color: "brightness(0) saturate(100%) invert(52%) sepia(53%) saturate(672%) hue-rotate(82deg) brightness(92%) contrast(86%)"},
      { name: "_PRECAUCI_", text: "Precaución", value: "_PRECAUCI_", color: "brightness(0) saturate(100%) invert(88%) sepia(16%) saturate(6760%) hue-rotate(350deg) brightness(99%) contrast(104%)"},
      { name: "_NO_CONTROLADA_", text: "No controlada", value: "_NO_CONTROLADA_", color: "brightness(0) saturate(100%) invert(22%) sepia(0%) saturate(5%) hue-rotate(159deg) brightness(91%) contrast(81%)"}
    ]
  },

  _MEDUSES_: {
    parent: {
      name: "_MEDUSES_",
      text: "Medusas",
      value: null
    },
    params: [
      { name: "_SENSE_PRES_NCIA_DE_MEDUSES_", text: "Sin presencia de medusas", value: "_SENSE_PRES_NCIA_DE_MEDUSES_", color: "brightness(0) saturate(100%) invert(60%) sepia(83%) saturate(6058%) hue-rotate(183deg) brightness(89%) contrast(101%)"},
      { name: "_PRES_NCIA_DE_MEDUSES_SENSE_PERILL_", text: "Presencia de medusas sin peligro", value: "_PRES_NCIA_DE_MEDUSES_SENSE_PERILL_", color: "brightness(0) saturate(100%) invert(52%) sepia(53%) saturate(672%) hue-rotate(82deg) brightness(92%) contrast(86%)"},
      { name: "_PRES_NCIA_DE_MEDUSES_AMB_PERILL_", text: "Presencia de medusas peligrosas", value: "_PRES_NCIA_DE_MEDUSES_AMB_PERILL_", color: "brightness(0) saturate(100%) invert(88%) sepia(16%) saturate(6760%) hue-rotate(350deg) brightness(99%) contrast(104%)"},
      { name: "_PRES_NCIA_DE_MEDUSES_D_ALT_PERILL_", text: "Presencia de medusas muy peligrosas", value: "_PRES_NCIA_DE_MEDUSES_D_ALT_PERILL_", color: "brightness(0) saturate(100%) invert(19%) sepia(92%) saturate(1855%) hue-rotate(334deg) brightness(121%) contrast(89%)"},
      { name: "_NO_INFO_", text: "Sin información", value: "_SENSE_INFORMACI_", color: "brightness(0) saturate(100%) invert(73%) sepia(13%) saturate(246%) hue-rotate(179deg) brightness(87%) contrast(89%)"}
    ]
  },

  _TIPOARENA_: {
    parent: {
      name: "_TIPOARENA_",
      text: "Tipo de arena",
      value: null
    },
    params: [
      { name: "_CODOL_", text: "Guijarros", value: "_CODOL_"},
      { name: "_SORRA_MOLT_GRUIXUDA_", text: "Muy gruesa", value: "_SORRA_MOLT_GRUIXUDA_"},
      { name: "_SORRA_GRUIXUDA_", text: "Gruesa", value: "_SORRA_GRUIXUDA_"},
      { name: "_SORRA_FINA_", text: "Fina", value: "_SORRA_FINA_"},
      { name: "_NO_CIMENT_", text: "No (cemento)", value: "_NO_CIMENT_"},
      { name: "_HERBA_", text: "Hierba", value: "_HERBA_"},
      { name: "_TERRA_", text: "Tierra", value: "_TERRA_"},
      { name: "_TERRA_CODOLS_", text: "Tierra y guijarros", value: "_TERRA_CODOLS_"}
    ]
  },

  _TEMPERATURAAGUA_: {
    parent: {
      name: "_TEMPERATURAAGUA_",
      text: "Temperatura agua de baño",
      value: null
    },
    params: [
      { name: "_TEMPERATURAAGUA_MENOS15_", text: "Menor a 15ºC", value: "14,99999", valueMin: null, valueMax: null, color: "brightness(0) saturate(100%) invert(100%) sepia(32%) saturate(4606%) hue-rotate(175deg) brightness(111%) contrast(96%)" },
      { name: "_TEMPERATURAAGUA_MENOS18_", text: "Entre 15ºC y 18ºC", value: null, valueMin: 15, valueMax: 18, color: "brightness(0) saturate(100%) invert(88%) sepia(77%) saturate(1809%) hue-rotate(170deg) brightness(101%) contrast(98%)" },
      { name: "_TEMPERATURAAGUA_MENOS21_", text: "Entre 18ºC y 21ºC", value: null, valueMin: 18, valueMax: 21, color: "brightness(0) saturate(100%) invert(73%) sepia(54%) saturate(450%) hue-rotate(169deg) brightness(100%) contrast(97%)" },
      { name: "_TEMPERATURAAGUA_MENOS24_", text: "Entre 21ºC y 24ºC", value: null, valueMin: 21, valueMax: 24, color: "brightness(0) saturate(100%) invert(68%) sepia(59%) saturate(802%) hue-rotate(169deg) brightness(96%) contrast(102%)" },
      { name: "_TEMPERATURAAGUA_MENOS27_", text: "Entre 24ºC y 27ºC", value: null, valueMin: 24, valueMax: 27, color: "brightness(0) saturate(100%) invert(71%) sepia(68%) saturate(490%) hue-rotate(336deg) brightness(102%) contrast(101%)" },
      { name: "_TEMPERATURAAGUA_MAS27_", text: "Más de 27ºC", value: "27", valueMin: null, valueMax: null, color: "brightness(0) saturate(100%) invert(40%) sepia(44%) saturate(5471%) hue-rotate(353deg) brightness(93%) contrast(93%)" }
    ]
  },

  _ESTADOCIELO_: {
    parent: {
      name: "_ESTADOCIELO_",
      text: "Tiempo previsto",
      value: null
    },
    params: [
      { name: "_ESTADOCIELO_1_", text: "Sol", value: "_1_", icon: "sunny.png" },
      { name: "_ESTADOCIELO_22_", text: "Calima", value: "_22_", icon: "haze.png" },
      { name: "_ESTADOCIELO_2_", text: "Sol y nubes altas", value: "_2_", icon: "cloudy.png" },
      { name: "_ESTADOCIELO_11_", text: "Niebla", value: "_11_", icon: "fog.png" },
      { name: "_ESTADOCIELO_12_", text: "Neblina", value: "_12_", icon: "fog.png" },
      { name: "_ESTADOCIELO_4_", text: "Cubierto", value: "_4_", icon: "fullClouds.png" },
      { name: "_ESTADOCIELO_21_", text: "Cubierto", value: "_21_", icon: "fullClouds.png" },
      { name: "_ESTADOCIELO_3_", text: "Entre poco y medio nublado", value: "_3_", icon: "cloudy.png" },
      { name: "_ESTADOCIELO_20_", text: "Entre medio y muy nublado", value: "_20_", icon: "cloudy.png" },
      { name: "_ESTADOCIELO_6_", text: "Lluvia", value: "_6_", icon: "rainy.png" },
      { name: "_ESTADOCIELO_5_", text: "Llovizna", value: "_5_", icon: "rainy.png" },
      { name: "_ESTADOCIELO_7_", text: "Aguacero", value: "_7_", icon: "rainy.png" },
      { name: "_ESTADOCIELO_24_", text: "Aguacero con tormenta", value: "_24_", icon: "storm.png" },
      { name: "_ESTADOCIELO_13_", text: "Aguacero nieve", value: "_13_", icon: "snow.png" },
      { name: "_ESTADOCIELO_8_", text: "Tormenta", value: "_8_", icon: "storm.png" },
      { name: "_ESTADOCIELO_9_", text: "Tormenta granizo", value: "_9_", icon: "stormHail.png" },
      { name: "_ESTADOCIELO_10_", text: "Nieve", value: "_10_", icon: "snow.png" },
      { name: "_ESTADOCIELO_27_", text: "Nieve débil", value: "_27_", icon: "snow.png" },
      { name: "_ESTADOCIELO_23_", text: "Chubasco", value: "_23_", icon: "rainy.png" },
      { name: "_ESTADOCIELO_30_", text: "Aguanieve", value: "_30_", icon: "sleet.png" }
    ]
  },

  _VIGILANCIAYSOCORRISMO_: {
    parent: {
      name: "_VIGILANCIAYSOCORRISMO_",
      text: "Vigilancia y socorrismo",
      value: null
    },
    params: [
      { name: "_SI_", text: "Sí", value: "_SI_"},
      { name: "_NO_", text: "No", value: "_NO_"}
    ]
  }
};

export function randomizeValue(parent, id) {
  id = Number(id);
  
  const category = BEACH_TAGS[parent];
  if (!category) {
    return null;
  }

  const seed = getDailySeed() + id;

  const random = mulberry32(seed + parent.length);

  const params = category.params;
  const index = Math.floor(random() * params.length);

  return params[index]

}

function getDailySeed() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() +1;
  const d = today.getDate();

  return parseInt(`${y}${m}${d}`);
}

function mulberry32(seed) {
    return function() {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export function searchBeachTag(parent, value) {
  const category = BEACH_TAGS[parent];
  if (!category) {
    return null;
  }

  const result = category.params.find(p => p.value === value);

  return result || null;
}

export function searchTemperature(temperature) {
  const category = BEACH_TAGS["_TEMPERATURAAGUA_"];
  if (!category) {
    return null;
  }

  const temp = Number(temperature);

  const clamped = Math.min(Math.max(temp, 15), 27)

  const param = category.params.find(p=> {
    if (p.value !== null && p.value !== undefined) {
      return Number(p.value) === clamped;
    }

    if (p.valueMin !== null && p.valueMax !== null) {
      return clamped >= p.valueMin && clamped < p.valueMax;
    }

    return false;
  });

  return param ? param.color : null;
}