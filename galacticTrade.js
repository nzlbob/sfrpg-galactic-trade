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
purchaseData.ship = myShip
purchaseData.name = myShip.name

const location = myShip.flags["sfrpg-galactic-trade"].currentLocation
const locationdata = location.split(".")
const JournalEntry = game.journal.get(locationdata[1])
console.log(JournalEntry)
const planet = JournalEntry.pages.get(locationdata[3])

purchaseData.planet = planet
console.log(purchaseData)
//purchasor.location = 


    
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


    let templateData = { variation: variation, dc: dc, chatMessage: chatMessage, destsplanetArray: destsplanetArray, purchaseData:purchaseData }
    console.log(templateData)
    const dlg = await renderTemplate(`modules/sfrpg-galactic-trade/templates/chat-buy.html`, templateData);
    //console.log(dlg)

    // Create the roll and the corresponding message
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
                noBuy:  legal, //tradeUpdate.goods[k2]? tradeUpdate.goods[k2].noBuy :
                noSell:  legal, //tradeUpdate.goods[k2]? tradeUpdate.goods[k2].noSell :
                illegalBuy:  illegal, //tradeUpdate.goods[k2]? tradeUpdate.goods[k2].illegalBuy :
                illegalSell: illegal //tradeUpdate.goods[k2]? tradeUpdate.goods[k2].illegalSell : 
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

    console.log(spacePlanets)

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
  }

}

Hooks.once("init", async function () {
  CONFIG.SFRPG_GT = SFRPG_GT;
  console.log("This code runs once the Foundry VTT software begins its initialization workflow.");
  initializeModule();


  game.settings.register("sfrpg-galactic-trade", "seasonFactor", {
    name: "Season Factor",
    hint: "Season Factor",
    scope: "world",
    type: Number,
    default: 1,
    config: true
  });
  game.settings.register("sfrpg-galactic-trade", "maxEconomyValue", {
    name: "Max Economy Value Factor",
    hint: "The maximum effect economy can have on trade prices. Values > 10 may lead to free goods in Poor systems",
    scope: "world",
    type: Number,
    default: 7,
    config: true
  });

  game.settings.register("sfrpg-galactic-trade", "BPValue", {
    name: "Trade BP to Credit Conversion",
    hint: "The Trade Conversion rate",
    scope: "world",
    type: Number,
    default: 500000,
    config: true
  });

  game.settings.register("sfrpg-galactic-trade", "tradeBasis", {
    name: "Trading Basis",
    hint: "The type of tading regime, Original Galactic trade from Fly Free or die, based on Elite (1987), Enhanced Galactic Trade System",
    scope: "world",
    type: String,
    default: "galactic",
    config: true,
    choices: {
      galactic: "Galactic Trade",
      elite: "Elite",
      enhanced: "Enhanced Galactic Trade System"
    }
  });

  game.settings.register("sfrpg-galactic-trade", "tradeDate", {
    name: "Trade Date",
    hint: "The maximum effect economy can have on trade prices. Values > 10 may lead to free goods in Poor systems",
    scope: "world",
    config: true,
    type: Date
  });

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
      hint: "The maximum effect economy can have on trade prices. Values > 10 may lead to free goods in Poor systems",
      scope: "user",
      config: true,
      type: String,
      choices: choices
    });

  //TokenHUD.template

  console.log("sfrpg-galactic-trade  | [READY] Preloading handlebar templates");
  preloadHandlebarsTemplates();
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