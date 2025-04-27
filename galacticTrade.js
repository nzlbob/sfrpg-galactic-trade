import { PlanetModel, PlanetSheet } from "./module/planet-model.js";
import { SFRPG_GT } from "./module/config.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";
console.log("Hello World! This code runs immediately when the file is loaded.");

class Database {
  #entriesStore = new Map()
#currentlocation = ""

  async getEntries() {
    return this.#entriesStore
  }
  async getCurrentLocation() {
    return this.#currentlocation
  }

  async setCurrentLocation(location) {
    this.#currentlocation = location
    return this.#currentlocation
  }


}





const TradeDatabase = new Database();

const Operations = {
  sequenceBuffer: [],
  playMany: false,
  playManySequenced: false,
  cursorPos: false,
  startPos: false,
  endPos: false,
  get name() {
    const name = game.user.name
    return name;
  },

  async buyCargo(actor) {
    let typeTable = {}
    let destTable = {}

    const allskills = actor.system.skills
    let skillToUse = "dip"

    // use merchant if greater

    for (let [k, v] of Object.entries(allskills)) {
      if (v.subname?.toLowerCase() === "merchant") {
        if (v.mod > allskills.dip.mod) skillToUse = k
      }
    }

    const charLevel = actor.system.details.level.value
    const dc = 10 + Math.floor(charLevel * 1.5)
    const chatMessage = "Cargo Search DC " + dc
    const roll = await actor.rollSkill(skillToUse, { chatMessage: chatMessage })
    const result = roll.callbackResult.total
    let cargo = "1d4"
    let variation = "0"
    if (result < dc) { cargo = "0" }
    else {
      variation = Math.floor((result - dc) / 5).toString()
    }

    // complete Rolls
    const rollData = actor.getRollData();
    const destspaceArray = []
    for (let [key, v] of Object.entries(SFRPG_GT.planets.space)) {
      if (!["drift"].includes(key)) destspaceArray.push(key)
    }
    //  SFRPG_GT.planets.space.forEach((value, key) => {
    //    if (!["drift"].includes(key)) destspaceArray.push(key)
    //  });

    game.tables.forEach((value, key) => {
      // console.log(key,value);
      if (value.name.startsWith("TABLE 1")) typeTable = value
      if (value.name.startsWith("TABLE 2")) destTable = value
    });

    const destRoll = await destTable.draw({ displayChat: true })
    const typeRoll = await typeTable.draw({ displayChat: false })

    console.log(destRoll)

const purchaseData = {}
const currentStarship = game.settings.get("sfrpg-galactic-trade", "myShip") ?? {};
const myShip = await game.actors.directory.documents.find((actor) => actor.uuid === currentStarship )
if (!myShip) return ui.notifications.warn("No Starship Selected") 
purchaseData.ship = myShip
purchaseData.name = myShip.name
const location = myShip.getFlag("sfrpg-galactic-trade", "currentLocation") 
if (!location) return ui.notifications.warn("Current Starship Location is incorrectly defined. Prease set location on the Galactic Trade Journal Planet sheet")
// const location = myShip.flags["sfrpg-galactic-trade"].currentLocation
console.log(location,myShip)

const locationdata = location.split(".")
if(locationdata.length<4) return ui.notifications.warn("Current Starship Location is incorrectly defined. Prease set location on the Galactic Trade Journal Planet sheet")
const JournalEntry = game.journal.get(locationdata[1])
//console.log(JournalEntry)
const planet = JournalEntry.pages.get(locationdata[3])

purchaseData.planet = planet

    const destsplanetArray = {}
    destspaceArray.forEach((space) => {
      //const randomplanet = await this.rollRandomWorld(space)
      //console.log(SFRPG_GT.planets.space[space])
      this.rollRandomWorld(space).then(function(randomplanet){
      destsplanetArray[space] = { space: game.i18n.localize(SFRPG_GT.planets.space[space]), planet: randomplanet }
      }
    )
    }
    )

    //console.log(dlg)

    // Create the roll and the corresponding message
    let templateData = { variation: variation, dc: dc, chatMessage: chatMessage, destsplanetArray: destsplanetArray, purchaseData:purchaseData }
    console.log(templateData)
    const dlg = await renderTemplate(`modules/sfrpg-galactic-trade/templates/chat-buy.html`, templateData);
    const r = await new Roll(cargo, rollData);
    await r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      flavor: dlg
    });
    if (r.total < 1) return
    // get Tables


  },

//    for (const [k, v] of Object.entries(SFRPG_GT.goodsData)) {

// newGoods[k] = { price: 10, quantity: 10, tooltip: "", noBuy: true, noSell: true, illegalBuy: false, illegalSell: false }
// console.log(newGoods, k, v)
//}




  async updateAllGoods() {
    for (const journal of game.journal.contents) {
  //  for (let [k1, journal] of Object.entries(game.journal)) {
    console.log(journal)
    for (const planet of journal.pages.contents) {
     // for (let [k2, planet] of Object.entries(journal.pages)) {
    //    console.log(planet)
        const tradeUpdate = duplicate(planet.system.trade)
        const goodsUpdate = {}
        for (let [k2, good] of Object.entries(SFRPG_GT.goodsData)) {
         // console.log(k2)
          // is there an existing entry ??
          let illegal = false
          let legal = true
          if (["robots", "narcotics"].includes(k2)) {
            if (["anarchy","feudal","corporate","multigovernment"].includes(planet.system.attributes.economy.government) ){
           console.log(k2,planet.system.attributes.economy.government)
              illegal = true
            legal = false
            }
          }

          if (["radioactives","weaponsorammo"].includes(k2)) {
            if (["democracy","dictatorship"].includes(planet.system.attributes.economy.government) ){
            illegal = true
            legal = false
            }
          }

          if (["luxuries","artorantiques", "alienitems","weaponsorammo"].includes(k2)) {
            if (["communist"].includes(planet.system.attributes.economy.government) ){
            illegal = true
            legal = false
            }
          }
          if (["refugees","convicts","weaponsorammo"].includes(k2)) {
            if (["corporate","democracy"].includes(planet.system.attributes.economy.government) ){
            illegal = true
            legal = false
            }
          }

         //   console.log(planet.sheet)
            goodsUpdate[k2] = {
          
                price: await planet.sheet.calculatePrice(k2),
                quantity : await planet.sheet.calculateQuantity(k2),
                noBuy:  tradeUpdate.goods[k2]? tradeUpdate.goods[k2].noBuy : legal,
                noSell:  tradeUpdate.goods[k2]? tradeUpdate.goods[k2].noSell : legal, //
                illegalBuy:  tradeUpdate.goods[k2]? tradeUpdate.goods[k2].illegalBuy : illegal, //
                illegalSell: tradeUpdate.goods[k2]? tradeUpdate.goods[k2].illegalSell : illegal //
          //  planet.system.trade.goods[k2].price = await this.calculatePrice(good, planet)
          }
       }
       console.log(goodsUpdate)
      delete tradeUpdate.goods
       tradeUpdate.goods = goodsUpdate
    console.log(planet.name,planet.system.attributes.population)
    //    console.log(planet.name, " \n", tradeUpdate)
       await planet.update({"system.trade" : {} })
planet.update({"system.trade" : tradeUpdate })


      }

    }

  },


  async sellCargo(actor) {
    if (!actor) return ui.notifications.warn(game.i18n.format("No Actor Token Selected"));
    const allskills = actor.system.skills
    let skillToUse = "dip"

    // use merchant if greater

    for (let [k, v] of Object.entries(allskills)) {
      if (v.subname?.toLowerCase() === "merchant") {
        if (v.mod > allskills.dip.mod) skillToUse = k
      }
    }

    const roll = await actor.rollSkill(skillToUse)
    const result = roll.callbackResult.total
    const charLevel = actor.system.details.level.value
    const dc = 15 + Math.floor(charLevel * 1.5)
    let success = false
    let sellPrice = 0

    if (result < dc) { sellPrice = -1 }
    else {
      sellPrice = Math.floor((result - dc) / 5).toString()
      success = true
    }
    const sellPriceSigned = new Intl.NumberFormat("en-US", {
      signDisplay: "exceptZero"
    }).format(sellPrice);

    const html = '<h2>Galactic Trade</h2><h3>Sell</h3><p></p>'
    const chat = ChatMessage.create({
      user: game.user.id,
      speaker: {
        actor: actor,
        alias: actor.name
      },
      content: html,
      flavor: `DC ${dc} Sell check - ${success ? "success!" : "failure!"} Sell for additional ${sellPriceSigned} BP/Lot `,
    })
  },

  async rollRandomWorld(space = "all", journal = "Galactic Trade",) {
    let compTable = {}
    const planets = []
    game.journal.forEach((value, key) => {
      if (value.name.startsWith(journal)) compTable = value
    });
    compTable.pages.forEach((value, key) => {

      planets.push(value)
    });

    const spacePlanets = planets.filter(planet => space === "all" ? true : planet.system.details.space === space)

   // console.log(spacePlanets)

    const randomIndex = Math.floor(Math.random() * spacePlanets.length)
    const planet = spacePlanets[randomIndex]
    return planet


  },




  async GMCargo() {

    // get Tables

    let compTable = {}
    game.tables.forEach((value, key) => {
      if (value.name.startsWith("TABLE 3")) compTable = value
    });
    const compRoll = await compTable.draw({ displayChat: true, rollMode: "selfroll" })
    const systemSellForm = "1d8-2"
    const pactSellForm = "1d8-1"
    const nearSellForm = "1d8"
    const vastSellForm = "1d8+1"
    const systemDur = "1d6"
    const pactDur = "2d6"
    const nearDur = "3d6"
    const vastDur = "5d6"
    const systemSell = await new Roll(systemSellForm).evaluate();
    const pactSell = await new Roll(pactSellForm).evaluate();
    const nearSell = await new Roll(nearSellForm).evaluate();
    const vastSell = await new Roll(vastSellForm).evaluate();
    const systemDurRoll = await new Roll(systemDur).evaluate();
    const pactDurRoll = await new Roll(systemDur).evaluate();
    const nearDurRoll = await new Roll(systemDur).evaluate();
    const vastDurRoll = await new Roll(systemDur).evaluate();

    const html = '<h2>Galactic Trade</h2><h3>Buy</h3><p>[[1d4]] BP</p><h3>Sell</h3><table><tr><th>Ship to</th><th>Duration<br>(days)</th><th>Sell<br>BP/lot</th></tr><tr><td>In System</td><td>[[1d6]]</td><td>[[1d8-2]]</td></tr><tr><td>Pact Worlds</td><td>[[2d6]]</td><td>[[1d8-1]]</td></tr><tr><td>Near Space</td><td>[[3d6]]</td><td>[[1d8]]</td></tr><tr><td>The Vast</td><td>[[3d6]]</td><td>[[1d8+1]]</td></tr></table>'
    console.log(game.user)
    const chat = ChatMessage.create({
      user: game.user.id,

      content: html,
      whisper: [game.user.id]

    })
  },



  async setNPCSkills(actor) {

/**
 * @module npc.js
 * @name NPC Creation Script
 * @file npc.js
 * @description This file is used to create NPCs for the game. It uses the NPC array to create 
 * the NPCs and then uses the skillset to assign skills to the NPCs. It also uses the crew 
 * modifier to modify the NPCs.
 * @author Bob
 * @date 2025-04-27
 * @version 1.0
 * @license MIT
 * 
 */

const operativeSkillModifier = 1
const npcArray = [
    { tier: 0, minor: 0, major: 0, gunner: 0 },
    { tier: 1, minor: 5, major: 10, gunner: 5 },
    { tier: 2, minor: 7, major: 12, gunner: 6 },
    { tier: 3, minor: 8, major: 13, gunner: 7 },
    { tier: 4, minor: 10, major: 15, gunner: 9 },
    { tier: 5, minor: 11, major: 16, gunner: 10 },
    { tier: 6, minor: 13, major: 18, gunner: 11 },
    { tier: 7, minor: 14, major: 19, gunner: 12, },
    { tier: 8, minor: 16, major: 21, gunner: 14 },
    { tier: 9, minor: 17, major: 22, gunner: 15 },
    { tier: 10, minor: 19, major: 24, gunner: 15 },
    { tier: 11, minor: 20, major: 25, gunner: 16 },
    { tier: 12, minor: 22, major: 27, gunner: 17 },
    { tier: 13, minor: 23, major: 28, gunner: 19 },
    { tier: 14, minor: 25, major: 30, gunner: 20 },
    { tier: 15, minor: 26, major: 31, gunner: 22 },
    { tier: 16, minor: 28, major: 33, gunner: 23 },
    { tier: 17, minor: 29, major: 34, gunner: 25 },
    { tier: 18, minor: 31, major: 36, gunner: 26 },
    { tier: 19, minor: 32, major: 37, gunner: 28 },
    { tier: 20, minor: 34, major: 39, gunner: 29 }
]
const skillset = {
    captain: {
        blu: "major",
        com: "major",
        dip: "major",
        eng: "minor",
        gun: "gunner",
        int: "major",
        pil: "minor",

    },
    chiefMate: {
        acr: "major",
        ath: "major",

    },
    engineer: {
        com: "minor",
        eng: "major",
        gun: "gunner",
        phs: "major",
        pil: "minor"
    },
    gunner: {
        gun: "gunner",
    },
    magicOfficer: {
        com: "minor",
        mys: "major",
        gun: "gunner",
    },
    pilot: {
        pil: "major"

    },
    scienceOfficer: {
        com: "major",
        eng: "minor",
        gun: "gunner",
        pil: "minor"
    }
}

const useNPCCrew = actor.system.crew.useNPCCrew
if (!useNPCCrew) return
const crewmodifier = 0
const crewAPL = actor.system.details.tier + crewmodifier

const crew = await duplicate(actor.system.crew.npcData)

/*
const s=foundry.utils.deepClone(CONFIG.SFRPG.skills);
    s.gun="Gunnery";
    const a=await ChoiceDialog.show("Add Skill","Select the skill you wish to add to the role of "+t+"?",
    {skill:{name:"Skill",options:Object.values(s).sort(),default:Object.values(s)[0]}});
    if("cancel"===a.resolution)return;
    let r=null;
    for(const[e,t]of Object.entries(s)){
        if(t===a.result.skill){r=e;break}if(!r)return;
    const i=foundry.utils.deepClone(this.actor.system.crew);
    i.npcData[t].skills[r]={isTrainedOnly:!1,
        hasArmorCheckPenalty:!1,
        value:0,
        misc:0,
        ranks:0,
        ability:"int",
        subname:"",
        mod:0,
        enabled:!0}
  //  await this.actor.update({"system.crew":i})
  console.log(i)
}

*/
for (let [rolekey, rolevalue] of Object.entries(skillset)) {
    for (let [skillkey, skillvalue] of Object.entries(rolevalue)) {
       // console.log(rolekey, skillkey, skillvalue,crew[rolekey])
       if (!crew[rolekey].numberOfUses) continue
        if (!crew[rolekey].skills[skillkey]) {
            crew[rolekey].skills[skillkey] = {
                isTrainedOnly: false,
                hasArmorCheckPenalty: false,
                value: 0,
                misc: 0,
                ranks: 0,
                ability: "int",
                subname: "",
                mod: 0,
                enabled: true
            }
        }
    }
}

for (let [crewkey, crewvalue] of Object.entries(crew)) {
    if (!crewvalue.numberOfUses) continue
    
    for (let [skillname, skill] of Object.entries(crewvalue.skills)) {
     //   console.log(skillname, skill)
        if (skillset[crewkey][skillname] == "major") {
            skill.mod = npcArray[crewAPL].major 
           }
        if (skillset[crewkey][skillname] == "minor") {
            skill.mod = npcArray[crewAPL].minor 
           
        }
        if (skillset[crewkey][skillname] == "gunner") {
            skill.mod = npcArray[crewAPL].gunner 
        }

        if (crewkey == "pilot") {
            crewvalue.skills[skillname].mod = npcArray[crewAPL].major + operativeSkillModifier
        }
        skill.ranks = crewAPL

    }
}
console.log(crew)

  await actor.update({"system.crew.npcData":crew})

/**
 * AA P127
 * EVERYTHING IS OPTIONAL
 * When creating an NPC, you are free to enact whatever changes you need to in order to make your creation work the way you intend. For example, an array might tell you to select two special abilities, but you know you need four—or only one. Go ahead and make the change! 
 * If you want your combatant NPC to have a really high AC but not many Hit Points, you can increase its AC by 1 and use the expert array’s HP. This doesn’t make the statistics wrong; rather, it helps the statistics match your concept. Creating NPCs is fundamentally a creative process, so while these steps are useful to keep the NPC’s capabilities from going too far astray for its CR, don’t treat them as hard restrictions
 * 
 * 
 */

  }

}



Hooks.once("init", async function () {
  CONFIG.SFRPG_GT = SFRPG_GT;
  console.log("This code runs once the Foundry VTT software begins its initialization workflow.");
  initializeModule();


  game.settings.register("sfrpg-galactic-trade", "seasonFactor", {
    name: "Season Factor",
    hint: "Season Factor 0-1 for seasonal trade price fluctuations. 0 = no effect, 1 = maximum effect",
    scope: "world",
    type: Number,
    default: 1,
    config: true
  });
  game.settings.register("sfrpg-galactic-trade", "maxEconomyValue", {
    name: "Max Economy Value Factor",
    hint: "The maximum effect economy can have on trade prices. Values > 10 may lead to free goods in poor systems. 7 is a good starting (1 byte)",
    scope: "world",
    type: Number,
    default: 7,
    config: true
  });

  game.settings.register("sfrpg-galactic-trade", "BPValue", {
    name: "Trade BP to Credit Conversion",
    hint: "The Trade Conversion rate for BP to Elite Commercial Credits (eCr) as all prices are calculated in elete credits. Try 1 BP = 25 eCr",
    scope: "world",
    type: Number,
    default: 25,
    config: true
  });

  game.settings.register("sfrpg-galactic-trade", "tradeBasis", {
    name: "Trading Basis",
    hint: "The type of trading regime, Original Galactic trade from Fly Free or die (use Macros), Elite: based on Elite (1987) Planet Economy + Production Type determines prices. Enhanced: This system uses similar formulas to the Elite system except prices are based on economic group import / export ratios. ",
    scope: "world",
    type: String,
    default: "galactic",
    config: true,
    choices: {
      galactic: "Galactic Trade (FFod)",
      elite: "Elite (1987) Trade System",
      enhanced: "Enhanced Galactic Trade System"
    }
  });
/*
  game.settings.register("sfrpg-galactic-trade", "tradeDate", {
    name: "Trade Date",
    hint: "The maximum effect economy can have on trade prices. Values > 10 may lead to free goods in Poor systems",
    scope: "world",
    config: true,
    type: Date
  });
*/
});

Hooks.once("ready", () => {
  console.log(`sfrpg-galactic-trade  | [READY] Preparing system for operation`);
  const readyTime = (new Date()).getTime();

  const myShip = game.actors.directory.documents.filter((actor) => actor.type === "starship" )
  console.log(myShip)
  const choices = {}
  myShip.forEach((actor) => {
    choices[actor.uuid] = actor.name
  });

  
    game.settings.register("sfrpg-galactic-trade", "myShip", {
      name: "Trading ship",
      hint: "Set the ship that all your trading activities will be based on. ",
      scope: "client",
      config: true,
      type: String,
      choices: choices
    });

  //TokenHUD.template

  console.log("sfrpg-galactic-trade  | [READY] Preloading handlebar templates");
  preloadHandlebarsTemplates();
  game.settings.set('sfrpg', 'enableGalacticTrade',true)
})


Hooks.once("setup", function () {

  Handlebars.registerHelper("tradelookup", function (v1, v2, v3) {
    //   console.log(v1,v2,v3)
    if (v3 == "") return v1[v2] ? v1[v2] : "Not Found"
    return v1[v2] ? v1[v2][v3] : "Not Found"

  });

  Handlebars.registerHelper("enrich", (content, options) => {
    let a = enrichthis(content, options)

    console.log("\nA", a)
    return a
    const owner = Boolean(options.hash["owner"]);
    const rollData = options.hash["rollData"];

    const newstring = TextEditor.enrichHTML({ secrets: owner, rollData })
    console.log(content, options, rollData, newstring)
    return new Handlebars.SafeString(newstring);
  });


  // SimpleCalendar.api.activateFullCalendarListeners('example_1');

  const cal = game.modules.get("foundryvtt-simple-calendar")?.active
  if (cal) {
    setDate()
  }




  function enrichthis(content, options) {
    const owner = Boolean(options.hash["owner"]);
    const rollData = options.hash["rollData"];

    const newstring = TextEditor.enrichHTML({ secrets: owner, async: false, rollData })
    console.log(content, options, rollData, newstring)
    return new Handlebars.SafeString(newstring);


  }


})
/*
  // Register initiative setting.
  game.settings.register("Alternityd100", "initFormula", {
    name: "SETTINGS.SimpleInitFormulaN",
    hint: "SETTINGS.SimpleInitFormulaL",
    scope: "world",
    type: String,
    default: "1d20",
    config: true,
    onChange: formula => _simpleUpdateInit(formula, true)
  });
*/

//    registerSocket();

function setDate() {


  let date = SimpleCalendar.api.getCurrentCalendar().currentDate
  let date2 = SimpleCalendar.api.timestamp()

  // let date4 = SimpleCalendar.api.getDateParts(date)
  let date5 = SimpleCalendar.api.formatTimestamp(date2)
  //let date6 = date5.DateData(date2)
  console.log("sfrpg-galactic-trade  | [READY] Preloading Calanders");
  console.log(date)
  console.log(date2)
  //console.log(date3)
  // console.log(date4)
  console.log(date5)
  //console.log(date6)
  //game.recon.today = date.year+"-"+(date.month+1)+"-"+(date.day)
  //game.recon.today = date.year+"-"+(date.month+1)+"-"+(date.day+1)

}


function initializeModule() {
  console.log("Initialise Module")
  Object.assign(CONFIG.JournalEntryPage.dataModels, {
    "sfrpg-galactic-trade.planet": PlanetModel
  });

  console.log("Initialise Fly Free or Die")
  DocumentSheetConfig.registerSheet(JournalEntryPage, "sfrpg-galactic-trade", PlanetSheet, {
    types: ["sfrpg-galactic-trade.planet"],
    makeDefault: true
  });



  window.GalacticTrade = {
    Operations: Operations,
    Database: TradeDatabase
  }
  console.log("Fly Free or Die window.Trade", window.Trade)
};