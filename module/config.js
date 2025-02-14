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
    "artorantiques": "SFRPG_GT.Goods.Art or antiques  ",
    "basemetals": "SFRPG_GT.Goods.Base metals ",
    "ceramicsorglassware": "SFRPG_GT.Goods.Ceramics or glassware ",
    "chemicals": "SFRPG_GT.Goods.Chemicals ",
    "convicts": "SFRPG_GT.Goods.Convicts",
    "electronics": "SFRPG_GT.Goods.Electronics  ",
    "furniture": "SFRPG_GT.Goods.Furniture ",
    "hidesorleather": "SFRPG_GT.Goods.Hides or leather ",
    "liveanimals": "SFRPG_GT.Goods.Live animals ",
    "machinery": "SFRPG_GT.Goods.Machinery",
    "mineralsorbyproducts": "SFRPG_GT.Goods.Minerals or byproducts ",
    "narcotics": "SFRPG_GT.Goods.Narcotics",
    "paperproductsorbooks": "SFRPG_GT.Goods.Paper products or books ",
    "plastics": "SFRPG_GT.Goods.Plastics",
    "precisionequipment": "SFRPG_GT.Goods.Precision equipment",
    "preciousmetals": "SFRPG_GT.Goods.Precious metals",
    "preparedfood": "SFRPG_GT.Goods.Prepared food",
    "radioactives": "SFRPG_GT.Goods.Radioactives",
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
SFRPG_GT.goodsData = {
    alienitems :{ basePrice : 53, baseQuantity : 70, economicFactor : 15, priceStability : 7},
    artorantiques :{ basePrice : 196, baseQuantity : 54, economicFactor : 8, priceStability : 15},
    basemetals :{ basePrice : 52, baseQuantity : 17, economicFactor : 1, priceStability : 31},
    ceramicsorglassware :{ basePrice : 125, baseQuantity : 25, economicFactor : 8, priceStability : 31},
    chemicals :{ basePrice : 65, baseQuantity : 13, economicFactor : -3, priceStability : 7},
    convicts :{ basePrice : 40, baseQuantity : 100, economicFactor : 4, priceStability : 31},
    electronics :{ basePrice : 154, baseQuantity : 56, economicFactor : 14, priceStability : 15},
    furniture :{ basePrice : 114, baseQuantity : 110, economicFactor : 8, priceStability : 7},
    hidesorleather :{ basePrice : 82, baseQuantity : 90, economicFactor : -7, priceStability : 63},
    liveanimals :{ basePrice : 176, baseQuantity : 220, economicFactor : -9, priceStability : 63},
    machinery :{ basePrice : 117, baseQuantity : 40, economicFactor : 6, priceStability : 7},
    mineralsorbyproducts :{ basePrice : 32, baseQuantity : 53, economicFactor : -1, priceStability : 3},
    narcotics :{ basePrice : 235, baseQuantity : 8, economicFactor : 29, priceStability : 127},
    paperproductsorbooks :{ basePrice : 30, baseQuantity : 12, economicFactor : -3, priceStability : 3},
    plastics :{ basePrice : 78, baseQuantity : 17, economicFactor : 5, priceStability : 31},
    preciousmetals :{ basePrice : 97, baseQuantity : 66, economicFactor : -1, priceStability : 7},
    precisionequipment :{ basePrice : 179, baseQuantity : 56, economicFactor : 14, priceStability : 3},
    preparedfood :{ basePrice : 19, baseQuantity : 6, economicFactor : -2, priceStability : 1},
    radioactives :{ basePrice : 85, baseQuantity : 6, economicFactor : -3, priceStability : 15},
    robots :{ basePrice : 171, baseQuantity : 50, economicFactor : 8, priceStability : 15},
    textiles :{ basePrice : 20, baseQuantity : 10, economicFactor : -1, priceStability : 7},
    toysorgames :{ basePrice : 116, baseQuantity : 38, economicFactor : 14, priceStability : 15},
    vegetableproducts :{ basePrice : 83, baseQuantity : 60, economicFactor : -5, priceStability : 15},
    vehicles :{ basePrice : 132, baseQuantity : 25, economicFactor : 6, priceStability : 7},
    weaponsorammo :{ basePrice : 124, baseQuantity : 29, economicFactor : 13, priceStability : 7},
    wood :{ basePrice : 30, baseQuantity : 10, economicFactor : -3, priceStability : 3},
    
   
}