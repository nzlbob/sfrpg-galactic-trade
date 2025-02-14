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
        population: new fields.NumberField({ required: false, nullable: false, integer: true, min: 0, initial: 1000000 }),

        economy: new fields.SchemaField({
          affluence: new fields.StringField({ required: false }),
          productionType: new fields.StringField({ required: false }),
          government: new fields.StringField({ required: false }),
          base: new fields.NumberField({ required: false }),
          bonus: new fields.NumberField({ required: false }),
          value: new fields.NumberField({ required: false })
        }),
        technology: new fields.StringField({ required: false }),
        productivity: new fields.StringField({ required: false }),

      }),

      trade: new fields.ObjectField(),


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

      newGoods[k] = { price: 10, quantity: 10,tooltip:"", noBuy: true,noSell: true, illegalBuy : false, illegalSell : false }
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
    console.log("prepareDerivedData")
    //console.log(this)
    // this.nSteps = this.steps.length;

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
    if (game.modules.get("foundryvtt-simple-calendar")?.active){
    const tradeDataDate = SimpleCalendar.api.formatTimestamp(this.object.system.trade.tradeDataDate)


    context.tradeDataDate = tradeDataDate
    }
    return context;
  }

  /**
   * Activate event listeners using the prepared sheet HTML
   * 
   * @param {JQuery} html The prepared HTML object ready to be rendered into the DOM
   */
  activateListeners(html) {
    //console.log("HERE--",html)
    super.activateListeners(html);

    html.find('.clickpingtoken').click(event => this.xrecalculateTrade(event));
    html.find('.updateeconomy').change(event => this.recalculateTrade(event));
    html.find('.buy').click(event => this._onItemCreate3(event));

  }



  async recalculateTrade(event = {}) {
    console.log(this, event)

    const inputElement = event.currentTarget ? event.currentTarget.dataset.type : null
    const newEconomy = inputElement ? event.currentTarget.value : ""
    console.log(inputElement, newEconomy)

    const seasonFactor = game.settings.get("sfrpg-galactic-trade", "seasonFactor")
    const maxEconomyValue = game.settings.get("sfrpg-galactic-trade", "maxEconomyValue")
    const BPValue = game.settings.get("sfrpg-galactic-trade", "BPValue")
    const object = this.object
    const systemData = object.system
    const trade = systemData.trade
    const newGoods = await foundry.utils.duplicate(trade.goods)


    const economy = systemData.attributes.economy
    if (inputElement) economy[inputElement] = newEconomy
    const affluence = economy.affluence ? SFRPG_GT.planets.affluenceData[economy.affluence] : 0
    const productionType = economy.productionType ? SFRPG_GT.planets.productionTypeData[economy.productionType] : 0
    const economyFactor = (affluence * productionType - 1) * maxEconomyValue / 15
    const today = Math.ceil(Math.floor(Math.random() * systemData.details.yearLength))
    //console.log(today)
    const dayfactor = (Math.sin(today / systemData.details.yearLength * 2 * Math.PI) + 1) * 0.5
    //console.log(Math.sin(today/this.details.yearLength*2*Math.PI))
    //console.log(dayfactor)
    for (const [k, v] of Object.entries(newGoods)) {
      //basePrice : 53, baseQuantity : 70, economicFactor : 15, priceStability : 7
      const randomno = Math.floor(Math.random() * 255)
      const goodsData = SFRPG_GT.goodsData[k]
     // console.log(k, " -Base", goodsData.basePrice, "Random", randomno, "PriceStability", goodsData.priceStability, randomno & goodsData.priceStability, "DayFactor", dayfactor, "SeasonFactor", seasonFactor, "EconomyFactor", goodsData.economicFactor, economyFactor)
      const decPrice = (goodsData.basePrice + (randomno & goodsData.priceStability) + (dayfactor * goodsData.priceStability * seasonFactor) + (goodsData.economicFactor * economyFactor)) * 4
      v.price = Math.max(Math.floor(decPrice) / 10, 0.1)
      v.bp = Math.round(v.price / BPValue * 100000) / 100
      // quantity = (base_quantity + (random AND mask) - economy * economic_factor) mod 64
      const quantity = goodsData.baseQuantity + ((Math.floor(Math.random() * 255)) & goodsData.priceStability) + ((1 - dayfactor) * goodsData.priceStability * seasonFactor) - (goodsData.economicFactor * economyFactor)
    //  console.log(1 - dayfactor)
      v.quantity = Math.max(Math.floor(quantity), 0)
      v.lots = Math.max(Math.round(quantity / 25 * 100) / 100,0)

v.tooltip = "Total = " + (v.bp * v.lots) + "BP <br> Average Price = " + (Math.floor(((goodsData.basePrice+goodsData.priceStability+maxEconomyValue/2) * 4))/10)


    }
    

    const update = { "system.trade.goods": newGoods }
    if (newEconomy) {
      const changeData = "system.attributes.economy." + inputElement
      update[changeData] = newEconomy
    }
    
    if (game.modules.get("foundryvtt-simple-calendar")?.active)  update["system.trade.tradeDataDate"] = SimpleCalendar.api.timestamp()
      const updatedJournal = await object.update(update)
    console.log(updatedJournal.name)
    for (const [k, v] of Object.entries(updatedJournal.system.trade.goods)) {
    //  console.log(k, v.price, v.quantity)
    }

  }

/**
     * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
     * @param {Event} event The originating click event
     */
async _onItemCreate3(event) {
    event.preventDefault();
  const header = event.currentTarget;
  
  const dataset = header.dataset;
  console.log(header.dataset, this)
  




      let createData = {
          name: game.i18n.localize(SFRPG_GT.goods[dataset.id]),
          type: "goods"
      };

      let templateData = {upper: "Item", lower: "item", types: "goods"}
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
                      console.log(formDataExtended,html)
                      foundry.utils.mergeObject(createData, formDataExtended.object);
                      if (!createData.name) {
                          createData.name = game.i18n.format("SFRPG.NPCSheet.Interface.CreateItem.Name");
                      }
                      console.log(createData)
                      //this.onBeforeCreateNewItem(createData);

                      //this.actor.createEmbeddedDocuments("Item", [createData]);
                  }
              }
          },
          default: "create"
      }).render(true);
      return null;
  

  const itemData = {
      name: `New ${type.capitalize()}`,
      type: type,
      data: foundry.utils.duplicate(header.dataset)
  };
  delete itemData.data['type'];

  this.onBeforeCreateNewItem(itemData);

  return this.actor.createEmbeddedDocuments("Item", [itemData]);
}



}