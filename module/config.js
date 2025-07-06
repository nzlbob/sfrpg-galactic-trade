// Namespace SFRPG Configuration Values
export const SFRPG_GT = {};

/**
 * The set of ability scores used with the system
 * @type {Object}
 */

/*d100A.weaponTypes = {
   
   "meleeW": "d100A.WeaponTypesMelee",
   "rangedW": "d100A.WeaponTypesRanged",
   "explos": "d100A.WeaponTypesExplosive",
   "heavy": "d100A.WeaponTypesHeavy",

};

*/
SFRPG_GT.skills = {
    "acr": "SFRPG.SkillAcr",
    "ath": "SFRPG.SkillAth",
    "blu": "SFRPG.SkillBlu",
    "com": "SFRPG.SkillCom",
    "cul": "SFRPG.SkillCul",
    "dip": "SFRPG.SkillDip",
    "dis": "SFRPG.SkillDis",
    "eng": "SFRPG.SkillEng",
    "int": "SFRPG.SkillInt",
    "lsc": "SFRPG.SkillLsc",
    "med": "SFRPG.SkillMed",
    "mys": "SFRPG.SkillMys",
    "per": "SFRPG.SkillPer",
    "pro": "SFRPG.SkillPro",
    "phs": "SFRPG.SkillPsc",
    "pil": "SFRPG.SkillPil",
    "sen": "SFRPG.SkillSen",
    "sle": "SFRPG.SkillSle",
    "ste": "SFRPG.SkillSte",
    "sur": "SFRPG.SkillSur"
},

SFRPG_GT.planets = {
    space: {
        pact: "SFRPG_GT.Planets.Space.Pact",
        near: "SFRPG_GT.Planets.Space.Near",
        vast: "SFRPG_GT.Planets.Space.Vast",
        mobile: "SFRPG_GT.Planets.Space.Mobile",
        drift: "SFRPG_GT.Planets.Space.Drift"
    },
    government: {
        anarchy: "SFRPG_GT.Planets.Government.Anarchy",
        feudal: "SFRPG_GT.Planets.Government.Feudal",
        multigovernment: "SFRPG_GT.Planets.Government.Multi-government",
        dictatorship: "SFRPG_GT.Planets.Government.Dictatorship",
        communist: "SFRPG_GT.Planets.Government.Communist",
        confederacy: "SFRPG_GT.Planets.Government.Confederacy",
        democracy: "SFRPG_GT.Planets.Government.Democracy",
        corporate: "SFRPG_GT.Planets.Government.CorporateState"
    },

    governmentData: {
        anarchy: 0,
        feudal: 1,
        multigovernment: 2,
        dictatorship: 3,
        communist: 4,
        confederacy: 5,
        democracy: 6,
        corporate: 7

    },
    affluence: {
        rich: "SFRPG_GT.Planets.Affluence.Rich",
        aboveaverage: "SFRPG_GT.Planets.Affluence.AboveAverage",
        average: "SFRPG_GT.Planets.Affluence.Average",
        belowaverage: "SFRPG_GT.Planets.Affluence.BelowAverage",
        poor: "SFRPG_GT.Planets.Affluence.Poor"
    },
    affluenceData: {
        rich: 1,
        aboveaverage: 1.5,
        average: 2,
        belowaverage: 2.5,
        poor: 3
    },
    productionType: {
        hightech: "SFRPG_GT.Planets.ProductionType.HighTech",
        techind: "SFRPG_GT.Planets.ProductionType.TechInd",
        industrial: "SFRPG_GT.Planets.ProductionType.Industrial",
        trade: "SFRPG_GT.Planets.ProductionType.Trade",
        indagri: "SFRPG_GT.Planets.ProductionType.IndAgri",
        agri: "SFRPG_GT.Planets.ProductionType.Agri",
        penalcolony: "SFRPG_GT.Planets.ProductionType.Penal"
    },
    productionTypeData: {
        hightech: 2,
        techind: 2.5,
        industrial: 3,
        trade: 3,
        indagri: 3.5,
        agri: 4,
        penalcolony: 5
    },


    "biomes": {
        "airborne": "SFRPG_GT.Planets.Biome.Airborne",
        "aquáti": "SFRPG_GT.Planets.Biome.Aquáti",
        "arctic": "SFRPG_GT.Planets.Biome.Arctic",
        "desert": "SFRPG_GT.Planets.Biome.Desert",
        "forest": "SFRPG_GT.Planets.Biome.Forest",
        "marsh": "SFRPG_GT.Planets.Biome.Marsh",
        "mountain": "SFRPG_GT.Planets.Biome.Mountain",
        "plains": "SFRPG_GT.Planets.Biome.Plains",
        "space": "SFRPG_GT.Planets.Biome.Space",
        "subterranean": "SFRPG_GT.Planets.Biome.Subterranean",
        "urban": "SFRPG_GT.Planets.Biome.Urban",
        "weird": "SFRPG_GT.Planets.Biome.Weird",
    }
    ,
    "atmosphere": {
        "normal": "SFRPG_GT.Planets.Atmosphere.Normal",
        "none": "SFRPG_GT.Planets.Atmosphere.None",
        "thin": "SFRPG_GT.Planets.Atmosphere.Thin",
        "thick": "SFRPG_GT.Planets.Atmosphere.Thick",
        "corrosiveortoxic": "SFRPG_GT.Planets.Atmosphere.Corrosiveortoxic"

    },
    "gravity": {
        "standard": "SFRPG_GT.Planets.Gravity.Standard",
        "zerogravity": "SFRPG_GT.Planets.Gravity.ZeroGravity",
        "low": "SFRPG_GT.Planets.Gravity.Low",
        "high": "SFRPG_GT.Planets.Gravity.High",
        "extreme": "SFRPG_GT.Planets.Gravity.Extreme"

    },
    "types": {
        "terrestrial": "SFRPG_GT.Planets.Type.Terrestrial",
        "gasgiant": "SFRPG_GT.Planets.Type.Gasgiant",
        "irregular": "SFRPG_GT.Planets.Type.Irregular",
        "satellite": "SFRPG_GT.Planets.Type.Satellite",
        "asteroid": "SFRPG_GT.Planets.Type.Asteroid",
        "colonyship": "SFRPG_GT.Planets.Type.Colonyship",
        "spacestation": "SFRPG_GT.Planets.Type.Spacestation",

    }


};

SFRPG_GT.goods = {
    "alienitems": "SFRPG_GT.Goods.Alien items",
    "artorantiques": "SFRPG_GT.Goods.Art or antiques",
    "basemetals": "SFRPG_GT.Goods.Base metals",
    "ceramicsorglassware": "SFRPG_GT.Goods.Ceramics or glassware",
    "chemicals": "SFRPG_GT.Goods.Chemicals",
    "convicts": "SFRPG_GT.Goods.Convicts",
    "electronics": "SFRPG_GT.Goods.Electronics",
    "gemstones": "SFRPG_GT.Goods.Gemstones",
    "furniture": "SFRPG_GT.Goods.Furniture",
    "hidesorleather": "SFRPG_GT.Goods.Hides or leather",
    "liveanimals": "SFRPG_GT.Goods.Live animals",
    "luxuries": "SFRPG_GT.Goods.Luxuries",
    "machinery": "SFRPG_GT.Goods.Machinery",
    "mineralsorbyproducts": "SFRPG_GT.Goods.Minerals or byproducts",
    "narcotics": "SFRPG_GT.Goods.Narcotics",
    "paperproductsorbooks": "SFRPG_GT.Goods.Paper products or books",
    "plastics": "SFRPG_GT.Goods.Plastics",
    "precisionequipment": "SFRPG_GT.Goods.Precision equipment",
    "preciousmetals": "SFRPG_GT.Goods.Precious metals",
    "preparedfood": "SFRPG_GT.Goods.Prepared food",
    "radioactives": "SFRPG_GT.Goods.Radioactives",
    "refugees": "SFRPG_GT.Goods.Refugees",
    "robots": "SFRPG_GT.Goods.Robots",
    "textiles": "SFRPG_GT.Goods.Textiles",
    "toysorgames": "SFRPG_GT.Goods.Toys or games",
    "vegetableproducts": "SFRPG_GT.Goods.Vegetable products",
    "vehicles": "SFRPG_GT.Goods.Vehicles",
    "weaponsorammo": "SFRPG_GT.Goods.Weapons or ammo",
    "wood": "SFRPG_GT.Goods.Wood"


}
// n^F - 1
SFRPG_GT.trade = {
    stabilityFactors: [
        1, 3, 7, 15, 31, 63, 127
    ]


}
SFRPG_GT.goodsTypeData = {
    luxuries : 20,
    tech : 10,
    minerals : 0,
    organics : -7,
    sentient  : -15
}



SFRPG_GT.goodsData = {
    alienitems: { basePrice: 350, baseQuantity: 70, economicFactor: 25, priceStability: 31, type: "luxuries" },
    artorantiques: { basePrice: 83, baseQuantity: 54, economicFactor: 8, priceStability: 15, type: "luxuries" },
    basemetals: { basePrice: 78, baseQuantity: 17, economicFactor: 1, priceStability: 31, type: "minerals" },
    ceramicsorglassware: { basePrice: 125, baseQuantity: 25, economicFactor: 8, priceStability: 31, type: "minerals" },
    chemicals: { basePrice: 83, baseQuantity: 251, economicFactor: -5, priceStability: 15, type: "minerals" },
    convicts: { basePrice: 40, baseQuantity: 100, economicFactor: -5, priceStability: 31, type: "sentient" },
    electronics: { basePrice: 154, baseQuantity: 56, economicFactor: 14, priceStability: 3, type: "tech" },
    gemstones: { basePrice: 45, baseQuantity: 250, economicFactor: -2, priceStability: 15, type: "minerals" },
    hidesorleather: { basePrice: 176, baseQuantity: 220, economicFactor: -9, priceStability: 63, type: "organics" },
    liveanimals: { basePrice: 130, baseQuantity: 90, economicFactor: -7, priceStability: 63, type: "organics" },
    luxuries: { basePrice: 196, baseQuantity: 54, economicFactor: 8, priceStability: 3, type: "luxuries" },
    machinery: { basePrice: 117, baseQuantity: 40, economicFactor: 6, priceStability: 7, type: "tech" },
    mineralsorbyproducts: { basePrice: 32, baseQuantity: 53, economicFactor: -1, priceStability: 3, type: "minerals" },
    narcotics: { basePrice: 235, baseQuantity: 8, economicFactor: 29, priceStability: 120, type: "luxuries" },
    plastics: { basePrice: 60, baseQuantity: 17, economicFactor: 5, priceStability: 31, type: "organics" },
    preciousmetals: { basePrice: 97, baseQuantity: 66, economicFactor: -1, priceStability: 7, type: "minerals" },
    precisionequipment: { basePrice: 171, baseQuantity: 55, economicFactor: -2, priceStability: 31, type: "tech" },
    preparedfood: { basePrice: 19, baseQuantity: 6, economicFactor: -2, priceStability: 1, type: "organics" },
    radioactives: { basePrice: 65, baseQuantity: 2, economicFactor: -3, priceStability: 7, type: "tech" },
    refugees: { basePrice: 90, baseQuantity: 130, economicFactor: -5, priceStability: 31, type: "sentient" },
    robots: { basePrice: 171, baseQuantity: 50, economicFactor: 8, priceStability: 15, type: "sentient" },
    textiles: { basePrice: 20, baseQuantity: 10, economicFactor: -1, priceStability: 3, type: "organics" },
    vegetableproducts: { basePrice: 83, baseQuantity: 60, economicFactor: -5, priceStability: 15, type: "organics" },
    vehicles: { basePrice: 132, baseQuantity: 25, economicFactor: 6, priceStability: 7, type: "tech" },
    weaponsorammo: { basePrice: 124, baseQuantity: 29, economicFactor: 13, priceStability: 7, type: "tech" }



}