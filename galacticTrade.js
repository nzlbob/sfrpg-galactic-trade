import { PlanetModel,PlanetSheet } from "./module/planet-model.js";
import { SFRPG_GT } from "./module/config.js";
import { preloadHandlebarsTemplates } from "./module/templates.js";
console.log("Hello World! This code runs immediately when the file is loaded.");

class Database {
  #entriesStore = new Map()

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

    // Create the roll and the corresponding message
    const r = await new Roll(cargo, rollData);
    await r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      flavor: chatMessage + 'Number of Cargo lots +/- ' + variation + 'Half-elves receive @UUID[Compendium.sfrpg.setting.JournalEntry.FYV6RgTjPdg72RF0]{Triune} as a bonus feat at 1st level.'
    });
    if (r.total < 1) return
    // get Tables

    let typeTable = {}
    let destTable = {}

    game.tables.forEach((value, key) => {
      // console.log(key,value);
      if (value.name.startsWith("TABLE 1")) typeTable = value
      if (value.name.startsWith("TABLE 2")) destTable = value
    });

    const typeRoll = await typeTable.draw({ displayChat: true })
    const destRoll = await destTable.draw({ displayChat: true })
    console.log(destRoll)
  },

  async sellCargo(actor) {
    if (!actor) return  ui.notifications.warn(game.i18n.format("No Actor Token Selected"));
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

  async GMCargo(){

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

  game.settings.register("sfrpg-galactic-trade", "myShip", {
    name: "Trading ship",
    hint: "The maximum effect economy can have on trade prices. Values > 10 may lead to free goods in Poor systems",
    scope: "user",
    config: true,
    type: String,
    choices: {
      "Actor.QtySbKtxQj13qAwM": "EJ Corp Negotiator",
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


    
    //TokenHUD.template

    console.log("sfrpg-galactic-trade  | [READY] Preloading handlebar templates");
    preloadHandlebarsTemplates();
  })


  Hooks.once("setup", function () {

  Handlebars.registerHelper("tradelookup", function (v1, v2,v3) {
 //   console.log(v1,v2,v3)
    if (v3 == "") return v1[v2]? v1[v2] : "Not Found"
      return v1[v2]? v1[v2][v3] : "Not Found"
   
});

Handlebars.registerHelper("enrich", (content, options) => {
  let a= enrichthis(content, options)

console.log("\nA",a)
  return a
  const owner = Boolean(options.hash["owner"]);
 const rollData = options.hash["rollData"];
 
 const newstring = TextEditor.enrichHTML( { secrets: owner, rollData })
 console.log(content,options,rollData,newstring)
  return new Handlebars.SafeString(newstring);
});


// SimpleCalendar.api.activateFullCalendarListeners('example_1');

const cal =  game.modules.get("foundryvtt-simple-calendar")?.active
if (cal) {
setDate()
}




 function enrichthis(content, options){
  const owner = Boolean(options.hash["owner"]);
  const rollData = options.hash["rollData"];
  
  const newstring = TextEditor.enrichHTML( { secrets: owner,async:false, rollData })
  console.log(content,options,rollData,newstring)
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

  function setDate(){


 let date = SimpleCalendar.api.getCurrentCalendar().currentDate
 let date2 = SimpleCalendar.api.timestamp()
 
// let date4 = SimpleCalendar.api.getDateParts(date)
 let date5 =  SimpleCalendar.api.formatTimestamp(date2)
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