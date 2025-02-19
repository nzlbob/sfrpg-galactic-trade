import { SFRPG_GT } from "./config.js";


export class PlanetModel extends foundry.abstract.TypeDataModel {


  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.SchemaField({
        long: new fields.HTMLField({ required: false, blank: true }),
        short: new fields.HTMLField({ required: false, blank: true })
      }),
      img: new fields.FilePathField({ required: false, categories: ["IMAGE"] }),
      steps: new fields.ArrayField(new fields.StringField({ blank: true })),
      attributes: new fields.SchemaField({
        population: new fields.NumberField({ required: false, nullable: false, integer: true, min: 1, max: 200,initial: 20 }),

        economy: new fields.SchemaField({
          affluence: new fields.StringField({ required:  true, initial: "average" }),
          productionType: new fields.StringField({ required: true, initial: "indagri" }),
          government: new fields.StringField({ required: true, initial: "dictatorship" }),
          minerals: new fields.NumberField({ required: true, integer: true, min:0 , max: 200, initial: 100 }),
          sentient: new fields.NumberField({ required: true, integer: true, min: 0, max: 200, initial: 100 }),
          tech: new fields.NumberField({ required: true, integer: true, min: 0,max: 200, initial: 100 }),
          organics: new fields.NumberField({ required: true, integer: true, min: 0,max: 200, initial: 100 }),
          luxuries: new fields.NumberField({ required: true, integer: true, min: 0,max: 200, initial: 100 }),
          base: new fields.NumberField({ required: false }),
          bonus: new fields.NumberField({ required: false }),
          value: new fields.NumberField({ required: false }),
          technology: new fields.StringField({ required: false }),
          productivity: new fields.StringField({ required: false }),
          tradehub: new fields.NumberField({ required: true, integer: true, min:0 , max: 100, initial: 0 }),
        }),


      }),

      trade: new fields.ObjectField(),
      tradeEnhanced: new fields.ObjectField(),

      details: new fields.SchemaField({
        object: new fields.StringField({ required: true, blank: false, initial: "terrestrial" }),
        gravity: new fields.StringField({ required: true, blank: false, initial: "standard" }),
        atmosphere: new fields.StringField({ required: true, blank: false, initial: "normal" }),
        space: new fields.StringField({ required: true, blank: false, initial: "pact" }),
        biography: new fields.SchemaField({
          value: new fields.StringField({ required: false, initial: "Bio" }),
          gmNotes: new fields.StringField({ required: false, initial: "Bio" }),
          public: new fields.StringField({ required: false }),
          fullBodyImage: new fields.StringField({ required: false }),
          dateOfBirth: new fields.StringField({ required: false }),
          age: new fields.NumberField({ required: false, nullable: false, integer: true, min: 1, max: 6, initial: 3 }),
          height: new fields.StringField({ required: false }),
          weight: new fields.StringField({ required: false }),
          otherVisuals: new fields.StringField({ required: false }),
        }),
        yearLength: new fields.NumberField({ required: true, nullable: false, integer: true, min: 1, initial: 365 }),
        biomes: new fields.ArrayField(new fields.SchemaField({
          name: new fields.StringField({ required: false }),
          overview: new fields.HTMLField({ textSearch: true }),
          inhabitants: new fields.HTMLField({ textSearch: true }),
          hooks: new fields.HTMLField({ textSearch: true }),
          options: new fields.HTMLField({ textSearch: true }),
          population: new fields.NumberField({ required: false, nullable: false, integer: true, min: 0, initial: 10 }),

        })),
        accord: new fields.NumberField({ required: false, nullable: false, integer: true, min: 1, max: 6, initial: 3 }),
        alignment: new fields.StringField({ required: true, blank: false, initial: "N" }),
        magic: new fields.StringField({ required: true, blank: false, initial: "low" }),
        religion: new fields.StringField({ required: true, blank: false, initial: "basemetals" }),
        hooks: new fields.HTMLField({ textSearch: true }),
        npc: new fields.HTMLField({ textSearch: true }),
        settlements: new fields.ArrayField(new fields.SchemaField({
          name: new fields.StringField({ required: false }),
          overview: new fields.HTMLField({ textSearch: true }),
          inhabitants: new fields.HTMLField({ textSearch: true }),
          hooks: new fields.HTMLField({ textSearch: true }),
          options: new fields.HTMLField({ textSearch: true }),
          population: new fields.NumberField({ required: false, nullable: false, integer: true, min: 0, initial: 10 }),

        })),

      }),
    };
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _preCreate(data, options, userId) {
    super._preCreate(data, options, userId);
    console.log(this)
    const trade = foundry.utils.duplicate(this.trade)
    console.log(trade)
    const newGoods = {}



    for (const [k, v] of Object.entries(SFRPG_GT.goodsData)) {

      newGoods[k] = { price: 10, quantity: 10, tooltip: "", noBuy: true, noSell: true, illegalBuy: false, illegalSell: false }
      console.log(newGoods, k, v)
    }
    trade.goods = newGoods
    trade.cycle = { initial: Math.random(), factor: 0 }
    trade.tradeDataDate = 0

    if (game.modules.get("foundryvtt-simple-calendar")?.active) trade.tradeDataDate = SimpleCalendar.api.timestamp
    //ToDate(SimpleCalendar.instance.currentDate)
    console.log(trade.goods)
    this.updateSource({ "trade": trade })


  }


  prepareDerivedData() {
 //   console.log("prepareDerivedData")
    const BPValue = game.settings.get("sfrpg-galactic-trade", "BPValue")

  //  console.log(this)
    // this.nSteps = this.steps.length;
    const newGoods = this.trade.goods
    for (const [k, v] of Object.entries(newGoods)) {
    if (!SFRPG_GT.goodsData[k]) {delete  newGoods[k];continue} 
    const averageGalacticPrice =  this.averageGalacticPrice(k)
    v.bp = Math.round(v.price / BPValue * 100000) / 100
    v.lots = Math.max(Math.round(v.quantity / 25 * 100) / 100, 0)
    v.saleValue = Math.round(v.bp * v.lots * 100) / 100
    v.tooltip = "Trade Total = " + (v.saleValue) + " BP <br> Average Galactic Price = " + averageGalacticPrice + " kCr"
    v.color = ""
    const colorband = 1.2
    if (v.price > (averageGalacticPrice * colorband)) v.color = "red"
    if (v.price < (averageGalacticPrice / colorband)) v.color = "green"
    }





  }

   averageGalacticPrice(good){
    const enhanced = game.settings.get("sfrpg-galactic-trade", "tradeBasis")==="enhanced"? true : false ;
    const maxEconomyValue = game.settings.get("sfrpg-galactic-trade", "maxEconomyValue")
    const seasonFactor = game.settings.get("sfrpg-galactic-trade", "seasonFactor")
    const goodsData = SFRPG_GT.goodsData[good]
    const goodType = SFRPG_GT.goodsData[good].type
    const typefactor = SFRPG_GT.goodsTypeData[goodType]/100

      // av price = basePrice + stability/2  + season /2  +  econimy factor /2    goodsData.economicFactor * economyFactor 

      let averageGalacticPrice = 0
if(enhanced){
  averageGalacticPrice = Math.floor(((goodsData.basePrice + goodsData.priceStability/2 +  goodsData.priceStability/2 * seasonFactor   + (goodsData.basePrice * typefactor * 2 ) + (goodsData.basePrice * 0.3 )) * 4)) / 10
}
else{
      averageGalacticPrice = Math.floor(((goodsData.basePrice + goodsData.priceStability/2 +  goodsData.priceStability/2 * seasonFactor   + goodsData.economicFactor * maxEconomyValue / 2) * 4)) / 10
}   
     
     
      return averageGalacticPrice
    }


}




export class PlanetSheet extends JournalTextPageSheet {
  get template() {
    return `modules/sfrpg-galactic-trade/templates/planet-sheet-${this.isEditable ? "edit" : "view"}.html`;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["sfrpg-galactic-trade", "sheet", "planetsheet", ".sfrpg"],
      width: 900,
      height: 800,

      scrollY: [
        ".tab.attributes",
        ".inventory .inventory-list",
        ".features .inventory-list",
        ".spellbook .inventory-list",
        ".modifiers .inventory-list",
        ".psionics .inventory-list",
        ".tab.status",
        ".tab.features",
        ".tab.skills",
        ".tab.details",
        ".tab.trade"
      ],
      tabs: [
        { navSelector: ".tabs", contentSelector: ".sheet-body", initial: "details" },
        { navSelector: ".subtabs", contentSelector: ".modifiers-body", initial: "permanent" },
        { navSelector: ".biotabs", contentSelector: ".bio-body", initial: "biography" },
        { navSelector: ".newtabs", contentSelector: ".new-body", initial: "details" }
      ]
    });
  }

  async getData(options = {}) {
    // console.log(this)
    const context = await super.getData(options);
    context.config = SFRPG_GT
    context.enrichedBiography = await TextEditor.enrichHTML(this.object.system.details.biography.value, { async: true });
    context.enrichedGMNotes = await TextEditor.enrichHTML(this.object.system.details.biography.gmNotes, { async: true });
    // this.recalculateTrade ()
    context.description = {
      long: await TextEditor.enrichHTML(this.object.system.details.biography.value, {
        async: true,
        secrets: this.object.isOwner,
        relativeTo: this.object
      })/*,
      short: await TextEditor.enrichHTML(this.object.system.description.short, {
        async: true,
        secrets: this.object.isOwner,
        relativeTo: this.object
      })*/
    };
    context.tradeDataDate = "today"
    if (game.modules.get("foundryvtt-simple-calendar")?.active) {
      const tradeDataDate = SimpleCalendar.api.formatTimestamp(this.object.system.trade.tradeDataDate)

      context.isGM = game.user.isGM;

      const currentStarship = game.settings.get("sfrpg-galactic-trade", "myShip") ?? {};
      const myShip = game.actors.directory.documents.find((actor) => actor.uuid === currentStarship)
      const myShipLoc = myShip ? myShip.getFlag("sfrpg-galactic-trade", "currentLocation") : null
      context.myShipLoc = myShipLoc == this.object.uuid
      context.currentLoc = myShipLoc == this.object.uuid
      context.tradeDataDate = tradeDataDate
      context.enhanced = game.settings.get("sfrpg-galactic-trade", "tradeBasis")==="enhanced"? true : false ;
 
    }
    return context;
  }

  /**
   * Activate event listeners using the prepared sheet HTML
   * 
   * @param {JQuery} html The prepared HTML object ready to be rendered into the DOM
   */
  activateListeners(html) {
   // console.log("HERE--",html)
    super.activateListeners(html);

    html.find('.clickpingtoken').click(event => this.xrecalculateTrade(event));
    html.find('.updateeconomy').change(event => this.recalculateTrade(event));
    html.find('.buy').click(event => this._onItemCreate3(event));
    html.find('.recalculatetrade').click(event => this.recalculateTrade(event));
    html.find('.setcurrentlocation').click(event => this.setcurrentlocation(event));
   // html.on('change', '.slider', this._onchangeSlider.bind(this));
   //html.find('.slider').change(event => this._onchangeSlider(event));
   


  }

  async _onchangeSlider(event) {
    // getElementById("p1").innerHTML = "New text!";
    console.log(event,this)
    const slider = event.currentTarget;
    const tokenId = slider.dataset.id;
    //event.currentTarget.style.backgroundColor = "lightgreen"
//   const update = {"system.attributes.population[tokenId]"}

  //  this.object.update()


//    var slider = html.getElementById("myRange");
//    var output = html.getElementById("demo");
//    output.innerHTML = slider.value; // Display the default slider value
    
    // Update the current slider value (each time you drag the slider handle)
  //  slider.oninput = function() {
  //    output.innerHTML = this.value;
 //   }

  }
  
  async setcurrentlocation(event = {}) {
    console.log(this, event)

    //console.log(GalacticTrade.Database.setcurrentlocation(this.object.id))
    const currentStarship = game.settings.get("sfrpg-galactic-trade", "myShip") ?? {};
    const myShip = game.actors.directory.documents.find((actor) => actor.uuid === currentStarship)

    myShip.update({ "flags.sfrpg-galactic-trade.currentLocation": this.object.uuid })
    console.log(currentStarship, myShip)
  }


  async recalculateTrade(event = {}) {
    console.log(this, event)

    const inputElement = event.currentTarget ? event.currentTarget.dataset.type : null
    const newEconomy = inputElement ? event.currentTarget.value : ""
    console.log(inputElement, newEconomy)


    const systemData = this.object.system
    const trade = systemData.trade
    const newGoods = await foundry.utils.duplicate(trade.goods)





    for (const [k, v] of Object.entries(newGoods)) {
      //basePrice : 53, baseQuantity : 70, economicFactor : 15, priceStability : 7

      const goodsData = SFRPG_GT.goodsData[k]
              
      v.price = await this.calculatePrice(k)
      v.quantity = await this.calculateQuantity(k)

      
  

    }
    const update = { "system.trade.goods": newGoods }
    if (newEconomy) {
      const changeData = "system.attributes.economy." + inputElement
      update[changeData] = newEconomy
    }

    if (game.modules.get("foundryvtt-simple-calendar")?.active) update["system.trade.tradeDataDate"] = SimpleCalendar.api.timestamp()
    const updatedJournal = await this.object.update(update)
    console.log(updatedJournal.name)
    for (const [k, v] of Object.entries(updatedJournal.system.trade.goods)) {
      //  console.log(k, v.price, v.quantity)
    }

  }

  async calculateQuantity(good) {
    const enhanced = game.settings.get("sfrpg-galactic-trade", "tradeBasis")==="enhanced"? true : false ;
    const systemData = this.object.system
    const economy = systemData.attributes.economy
   // if (inputElement) economy[inputElement] = newEconomy
   const tradehub = 5
    const tradehubFactor = economy.tradehub ? economy.tradehub * tradehub / 100 : 0;
    const seasonFactor = game.settings.get("sfrpg-galactic-trade", "seasonFactor")
    const maxEconomyValue = game.settings.get("sfrpg-galactic-trade", "maxEconomyValue")
    const affluence = economy.affluence ? SFRPG_GT.planets.affluenceData[economy.affluence] : 1
    const productionType = economy.productionType ? SFRPG_GT.planets.productionTypeData[economy.productionType] : 0
    const economyFactor = (affluence * productionType - 1) * maxEconomyValue / 15
    const dayfactor = await this.dayfactor()
    const goodsData = SFRPG_GT.goodsData[good]
    const goodType = goodsData.type
    let quantity = 0

    //1-3 (affluenceData Rich>>Poor) x 0-200  goodsData.baseQuantity x (200 - economy[goodType])/100 
 
    if(enhanced) {
      quantity = goodsData.baseQuantity + ((Math.floor(Math.random() * 255)) & goodsData.priceStability) + ((1 - dayfactor) * goodsData.priceStability * seasonFactor) - (affluence * goodsData.baseQuantity * (200 - economy[goodType])/100) + goodsData.baseQuantity * tradehubFactor
     
    }
      else {
      quantity = goodsData.baseQuantity + ((Math.floor(Math.random() * 255)) & goodsData.priceStability) + ((1 - dayfactor) * goodsData.priceStability * seasonFactor) - (goodsData.economicFactor * economyFactor)
    
      }
          // quantity = (base_quantity + (random AND mask) - economy * economic_factor) mod 64
          
    //  console.log(1 - dayfactor)

       // console.log(quantity,v, dayfactor, goodsData.baseQuantity,goodsData.priceStability,seasonFactor,economyFactor)
    return Math.max(Math.floor(quantity), 0)

  }


async calculatePrice(good) {

  const enhanced = game.settings.get("sfrpg-galactic-trade", "tradeBasis")==="enhanced"? true : false ;

  const seasonFactor = game.settings.get("sfrpg-galactic-trade", "seasonFactor")
  const maxEconomyValue = game.settings.get("sfrpg-galactic-trade", "maxEconomyValue")
  const BPValue = game.settings.get("sfrpg-galactic-trade", "BPValue")
  const dayfactor = await this.dayfactor()
  const systemData = this.object.system
  const economy = systemData.attributes.economy
  const goodsData = SFRPG_GT.goodsData[good]
  const randomno = Math.floor(Math.random() * 255)
  const productionType = economy.productionType ? SFRPG_GT.planets.productionTypeData[economy.productionType] : 0
  const affluence = economy.affluence ? SFRPG_GT.planets.affluenceData[economy.affluence] : 0
  const economyFactor = (affluence * productionType - 1) * maxEconomyValue / 15
  let decPrice = 0
  const goodType = SFRPG_GT.goodsData[good].type
  const typefactor = SFRPG_GT.goodsTypeData[goodType]/100
  const maxImportPremium = 60
  const exportFactor = (economy[goodType] * maxImportPremium / -200 + maxImportPremium) /100   // 0-200 >> 0-60%

//console.log(good, typefactor)

  if(enhanced) {
  decPrice = (goodsData.basePrice + (randomno & goodsData.priceStability) + (dayfactor * goodsData.priceStability * seasonFactor) + (goodsData.basePrice * typefactor * affluence ) + (goodsData.basePrice * exportFactor ) ) * 4
 
}
  else {
  decPrice = (goodsData.basePrice + (randomno & goodsData.priceStability) + (dayfactor * goodsData.priceStability * seasonFactor) + (goodsData.economicFactor * economyFactor )) * 4

  }
  
  const price = Math.max(Math.floor(decPrice) / 10, 0.1)
  return price
}

async dayfactor() {
  const systemData = this.object.system
  // need to do this instead of random to get the same value for the same day
  const today = Math.ceil(Math.floor(Math.random() * systemData.details.yearLength))
  const dayfactor = (Math.sin(today / systemData.details.yearLength * 2 * Math.PI) + 1) * 0.5
  return dayfactor

}

  /**
       * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
       * @param {Event} event The originating click event
       */
  async _onItemCreate3(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const currentStarship = game.settings.get("sfrpg-galactic-trade", "myShip") ?? {};
    const myShip = await game.actors.directory.documents.find((actor) => actor.uuid === currentStarship)
    if (!myShip) { console.log("No Ship"); return null }
    const dataset = header.dataset;
    console.log(header.dataset, this)

    const goods = this.object.system.trade.goods[dataset.id]





    let createData = {
      name: game.i18n.localize(SFRPG_GT.goods[dataset.id]),
      type: "goods",
      qty: 0
    };

    let templateData = { name: createData.name, goods: goods, type: "goods" }
    console.log(createData, templateData)
    const dlg = await renderTemplate(`modules/sfrpg-galactic-trade/templates/cargo-create.html`, templateData);

    new Dialog({
      title: game.i18n.format("SFRPG.NPCSheet.Interface.CreateItem.Title"),
      content: dlg,
      buttons: {
        create: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.format("SFRPG.NPCSheet.Interface.CreateItem.Button"),
          callback: html => {
            const form = html[0].querySelector("form");
            let formDataExtended = new FormDataExtended(form);
            // console.log(formDataExtended,html)
            foundry.utils.mergeObject(createData, formDataExtended.object);

            console.log(formDataExtended)
            //this.onBeforeCreateNewItem(createData);

            const itemData = {
              name: createData.qty + " tons of " + createData.name,
              type: createData.type,

              system: {
                description: { value: "This is " + createData.qty + " tons of " + createData.name + "purchased from " + this.object.name + " for " + createData.price + " BP / lot" },
                bulk: createData.qty + " tons",
                price: createData.price,
              }
            };
            // myShip.onBeforeCreateNewItem(itemData);
            myShip.createEmbeddedDocuments("Item", [itemData]);
          }
        }
      },
      default: "create"
    }).render(true);



    return null;


    const xitemData = {
      name: `New ${type.capitalize()}`,
      type: type,
      data: foundry.utils.duplicate(header.dataset)
    };
    delete itemData.data['type'];

    this.onBeforeCreateNewItem(itemData);

    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }



}