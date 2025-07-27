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
        population: new fields.NumberField({ required: false, nullable: false, integer: true, min: 1, max: 200, initial: 20 }),

        economy: new fields.SchemaField({
          affluence: new fields.StringField({ required: true, initial: "average" }),
          productionType: new fields.StringField({ required: true, initial: "indagri" }),
          government: new fields.StringField({ required: true, initial: "dictatorship" }),
          minerals: new fields.NumberField({ required: true, integer: true, min: 0, max: 200, initial: 100 }),
          sentient: new fields.NumberField({ required: true, integer: true, min: 0, max: 200, initial: 100 }),
          tech: new fields.NumberField({ required: true, integer: true, min: 0, max: 200, initial: 100 }),
          organics: new fields.NumberField({ required: true, integer: true, min: 0, max: 200, initial: 100 }),
          luxuries: new fields.NumberField({ required: true, integer: true, min: 0, max: 200, initial: 100 }),
          base: new fields.NumberField({ required: false }),
          bonus: new fields.NumberField({ required: false }),
          value: new fields.NumberField({ required: false }),
          technology: new fields.StringField({ required: false }),
          productivity: new fields.StringField({ required: false }),
          tradehub: new fields.NumberField({ required: true, integer: true, min: 0, max: 100, initial: 0 }),
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

  /**
 * 
 * @param {*} data
 */
  prepareDerivedData() {
    //   console.log("prepareDerivedData")
    const BPValue = game.settings.get("sfrpg-galactic-trade", "BPValue")

    //  console.log(this)
    // this.nSteps = this.steps.length;
    const newGoods = this.trade.goods
    for (const [k, v] of Object.entries(newGoods)) {
      if (!SFRPG_GT.goodsData[k]) { delete newGoods[k]; continue }
      const averageGalacticPrice = this.averageGalacticPrice(k)
      v.bp = Math.round(v.price / BPValue * 100) / 100
      v.lots = Math.max(lots(v.quantity), 0)
      v.saleValue = Math.round(v.bp * v.lots * 100) / 100
      v.tooltip = "Trade Total = " + (v.saleValue) + " BP <br> Average Galactic Price = " + averageGalacticPrice + " eCr"
      v.color = ""
      const colorband = 1.2
      if (v.price > (averageGalacticPrice * colorband)) v.color = "red"
      if (v.price < (averageGalacticPrice / colorband)) v.color = "green"
    }
  }
  /**
   * 
   * @param {*} good 
   * @returns 
   */
  averageGalacticPrice(good) {
    const enhanced = game.settings.get("sfrpg-galactic-trade", "tradeBasis") === "enhanced" ? true : false;
    const maxEconomyValue = game.settings.get("sfrpg-galactic-trade", "maxEconomyValue")
    const seasonFactor = game.settings.get("sfrpg-galactic-trade", "seasonFactor")
    const goodsData = SFRPG_GT.goodsData[good]
    const goodType = SFRPG_GT.goodsData[good].type
    const typefactor = SFRPG_GT.goodsTypeData[goodType] / 100

    // av price = basePrice + stability/2  + season /2  +  econimy factor /2    goodsData.economicFactor * economyFactor 

    let averageGalacticPrice = 0
    if (enhanced) {
      averageGalacticPrice = Math.floor(((goodsData.basePrice + goodsData.priceStability / 2 + goodsData.priceStability / 2 * seasonFactor + (goodsData.basePrice * typefactor * 2) + (goodsData.basePrice * 0.3)) * 4)) / 10
    }
    else {
      averageGalacticPrice = Math.floor(((goodsData.basePrice + goodsData.priceStability / 2 + goodsData.priceStability / 2 * seasonFactor + goodsData.economicFactor * maxEconomyValue / 2) * 4)) / 10
    }


    return averageGalacticPrice
  }


}
/**
 * 
 * @param {*} good
 * @returns 
 */
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
      const myShip = game.actors.contents.find((actor) => actor.uuid === currentStarship)
      const myShipLoc = myShip ? myShip.getFlag("sfrpg-galactic-trade", "currentLocation") : null
      context.myShipLoc = myShipLoc == this.object.uuid
      context.currentLoc = myShipLoc == this.object.uuid
      context.tradeDataDate = tradeDataDate
      context.enhanced = game.settings.get("sfrpg-galactic-trade", "tradeBasis") === "enhanced" ? true : false;

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
    html.find('.sell').click(event => this._onItemSell(event));
    html.find('.recalculatetrade').click(event => this.recalculateTrade(event));
    html.find('.setcurrentlocation').click(event => this.setcurrentlocation(event));
    html.find('.rolldip').click(event => this.rolldip(event));

    /*
     if ( !this.isEditable ) return;
        const changeElements = ["input", "select", "textarea"].concat(this.constructor._customElements);
        html.on("change", changeElements.join(","), this._onChangeInput.bind(this));
        html.find(".editor-content[data-edit]").each((i, div) => this._activateEditor(div));
        html.find("button.file-picker").click(this._activateFilePicker.bind(this));
        if ( this._priorState <= this.constructor.RENDER_STATES.NONE ) html.find("[autofocus]")[0]?.focus();
    */



    //class="rolldip"
    // html.on('change', '.slider', this._onchangeSlider.bind(this));
    //html.find('.slider').change(event => this._onchangeSlider(event));
  }

  async _onItemSell(event) {
    console.log(this)
    event.preventDefault();
    const systemData = this.object.system
    const header = event.currentTarget;
    const currentStarship = game.settings.get("sfrpg-galactic-trade", "myShip") ?? {};
    const BPValue = game.settings.get("sfrpg-galactic-trade", "BPValue") ?? 25;
    const myShip = await game.actors.contents.find((actor) => actor.uuid === currentStarship)
    if (!myShip) { return ui.notifications.warn(game.i18n.format("No Trading ship selected in Configure Game Settings")) }
    const dataset = header.dataset;
    const token = game.canvas.tokens.controlled[0]
    console.log(token)
    if (!token) return ui.notifications.warn(game.i18n.format("No Actor Token Selected"));
    const actor = token.actor
    if (actor.type == "starship") return ui.notifications.warn(game.i18n.format("No Character with skills selected"));
    const allskills = actor.system.skills
    let skillToUse = "dip" // use merchant if greater
    for (let [k, v] of Object.entries(allskills)) {
      if (v.subname?.toLowerCase() === "merchant") {
        if (v.mod > allskills.dip.mod) skillToUse = k
      }
    }


    const roll = await (new Roll(`1d20+${actor.system.skills[skillToUse].mod}`)).evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      flavor: game.i18n.localize("SFRPG.ActionSkill") + " - " + game.i18n.localize(SFRPG_GT.skills[skillToUse])
    });
    const result = roll.total
    const charLevel = actor.system.details.level.value
    let dc = 25 + Math.floor(charLevel * 1.5)

    if (systemData.trade.goods[dataset.id].quantity === 0) dc -= 10;
    let success = false
    let sellPrice = 0
    console.log(dc, result)
    let variation = 0
    if (result < dc) { success = false }
    else {
      variation = 1 + Math.floor(result - dc);
      success = true
    }
    console.log(myShip)
    console.log(myShip.items.contents)
    let totalTons = 0
    const goodsItems = myShip.items.contents.filter((item) => {
      console.log(item)
      // myShip.deleteEmbeddedDocuments("Item", [item.id])
      if ((item.type === "goods") && (item.flags.SFRPG_GT?.type === dataset.id)) {
        totalTons += tons(item.system.quantity) // item.flags.SFRPG_GT.qty // tons(item.system.quantity)
        return true
      }

    })
    const sellpercentage = 12
    const sellItem = duplicate(systemData.trade.goods[dataset.id])
    const itempath = "system.trade.goods." + dataset.id

    sellItem.price = Math.round(sellItem.price * (1 - (sellpercentage / 100)) * 10) / 10
    if (this.object.isOwner && totalTons > 0) {
      const updatedgoods = this.object.update({ [itempath]: sellItem })
      console.log(sellItem, updatedgoods)
    }
    console.log(goodsItems)

    //console.log(header.dataset, this)
    const date = this.object.system.trade.tradeDataDate
    const parsedDate = SimpleCalendar.api.formatTimestamp(date)
    const goods = foundry.utils.duplicate(this.object.system.trade.goods[dataset.id])
    goods.price = Math.round(goods.price * (1 + (variation / 100)) * 10) / 10
    goods.quantity = totalTons
    let createData = {
      name: game.i18n.localize(SFRPG_GT.goods[dataset.id]),
      type: "goods",
      qty: 0
    };
    let templateData = { sell: true, purchaserName: actor.name, name: createData.name, goods: goods, type: "goods", location: this.object.name, date: parsedDate, success: success, variation: variation, dc: dc, result: result, skill: skillToUse, charLevel: charLevel, sellPrice: sellPrice, BPValue: BPValue }
    console.log(createData, templateData)
    const dlg = await renderTemplate(`modules/sfrpg-galactic-trade/templates/cargo-create.html`, templateData);

    new Dialog({
      title: game.i18n.format("Sell Items "),
      content: dlg,
      buttons: {
        create: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.format("Sell Items"),
          callback: html => {
            const form = html[0].querySelector("form");
            let formDataExtended = new FormDataExtended(form); // console.log(formDataExtended,html)         
            foundry.utils.mergeObject(createData, formDataExtended.object);
            console.log(createData)
            if (createData.dn25) createData.price = Math.round(createData.price * 0.75 * 10) / 10;
            if (createData.up25) createData.price = Math.round(createData.price * 1.25 * 10) / 10;
            createData.lots = Math.round(createData.qty / 25 * 100) / 100
            createData.bp = Math.round(createData.price / BPValue * 100) / 100
            templateData.total = { eCr: Math.round(createData.qty * goods.price * 100) / 100, bp: Math.round(createData.lots * createData.bp * 100) / 100 }
            createData.total = templateData.total
            createData.balance = { bp: Math.round((myShip.system.currency.bp + createData.total.bp) * 100) / 100, eCr: Math.round((myShip.system.currency.bp + createData.total.bp) * BPValue * 100) / 100 }
            renderTemplate(`modules/sfrpg-galactic-trade/templates/cargo-description.html`, templateData).then((cargoDesc) => {
              const itemData = {
                name: createData.qty + " tons of " + createData.name,
                type: createData.type,
                flags: { SFRPG_GT: { type: dataset.id, qty: createData.qty, goods: goods } },
                system: {
                  description: { value: cargoDesc, gmNotes: "Bad thing happen" },
                  //description: { value: "This is " + createData.qty + " tons of " + createData.name + "purchased from " + this.object.name + " for " + createData.price + " BP / lot",short:dlg },

                  bulk: createData.qty + " tons",
                  price: createData.price,
                }
              };
              //saleValue = templateData.total.bp

              let sellQty = createData.qty
              goodsItems.forEach((item) => {
                if (sellQty >= tons(item.system.quantity)) {
                  sellQty -= tons(item.system.quantity)
                  myShip.deleteEmbeddedDocuments("Item", [item.id])
                }
                else {
                  const remainingqty = tons(item.system.quantity) - sellQty
                  const update = {
                    _id: item.id,
                    flags: { SFRPG_GT: { qty: remainingqty } },
                    name: remainingqty + " tons of " + templateData.name,
                    system: {
                      bulk: remainingqty + " tons",
                      quantity: lots(remainingqty)
                    }
                  }
                  console.log(item)
                  console.log(myShip.updateEmbeddedDocuments("Item", [update]))

                  sellQty = 0
                }
              });

              //myShip.createEmbeddedDocuments("Item", [itemData]);
              console.log(myShip)
              myShip.update({ "system.currency.bp": Math.round((myShip.system.currency.bp + createData.lots * createData.bp) * 100) / 100 })
            });
            // myShip.onBeforeCreateNewItem(itemData);


            const tradeData = {
              success: success,
              variation: variation,
              dc: dc,
              actor: actor,
              myShip: myShip,
              name: createData.name,
              createData: createData,
              variation: variation,
              sell: true,
              buy: false,
              planet: this.object

            }
            this.tradeChatmessage(tradeData)



          }
        }
      },
      default: "create"
    }).render(true);
    return null;

  }


  async tradeChatmessage(tradeData) {
    // let templateData = { variation: variation, dc: dc, chatMessage: chatMessage, destsplanetArray: destsplanetArray, purchaseData:purchaseData }

    console.log(tradeData)
    const html = await renderTemplate(`modules/sfrpg-galactic-trade/templates/chat-tradeMessage.html`, tradeData);
    const dc = tradeData.createData.dc
    const success = tradeData.success
    const sellPriceSigned = tradeData.createData.bp
    const chat = ChatMessage.create({
      user: game.user.id,
      speaker: {
        actor: tradeData.myShip,
        alias: tradeData.actor.name
      },
      content: html,
      //flavor: `DC ${dc} Sell check - ${success ? "success!" : "failure!"} Sell for additional ${sellPriceSigned} BP/Lot `,
    })
  }


  async _onchangeSlider(event) {
    // getElementById("p1").innerHTML = "New text!";
    console.log(event, this)
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
    const myShip = game.actors.contents.find((actor) => actor.uuid === currentStarship)
console.log(myShip)
    if (!myShip) { return ui.notifications.warn(game.i18n.format("No Trading ship selected in Configure Game Settings")) }
    myShip.update({ "flags.sfrpg-galactic-trade.currentLocation": this.object.uuid })
    console.log(currentStarship, myShip)
  }


  async recalculateTrade(event = {}) {
    const inputElement = event.currentTarget ? event.currentTarget.dataset.type : null
    const newEconomy = inputElement ? event.currentTarget.value : ""
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
    // console.log(updatedJournal.name)
    // for (const [k, v] of Object.entries(updatedJournal.system.trade.goods)) {
    //  console.log(k, v.price, v.quantity)
    // }

  }
  /**
   * 
   * @param {Event} event
   * @returns quantity
   */
  async calculateQuantity(good) {
    const enhanced = game.settings.get("sfrpg-galactic-trade", "tradeBasis") === "enhanced" ? true : false;
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
    if (enhanced) {
      quantity = goodsData.baseQuantity + ((Math.floor(Math.random() * 255)) & goodsData.priceStability) + ((1 - dayfactor) * goodsData.priceStability * seasonFactor) - (affluence * goodsData.baseQuantity * (200 - economy[goodType]) / 100) + goodsData.baseQuantity * tradehubFactor
    }
    else {
      quantity = goodsData.baseQuantity + ((Math.floor(Math.random() * 255)) & goodsData.priceStability) + ((1 - dayfactor) * goodsData.priceStability * seasonFactor) - (goodsData.economicFactor * economyFactor)
    }
    return Math.max(Math.floor(quantity), 0)
  }
  /**
   * 
   * @param {*} good 
   * @returns 
   */

  async calculatePrice(good) {
    const enhanced = game.settings.get("sfrpg-galactic-trade", "tradeBasis") === "enhanced" ? true : false;
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
    const typefactor = SFRPG_GT.goodsTypeData[goodType] / 100
    const maxImportPremium = 60
    const exportFactor = (economy[goodType] * maxImportPremium / -200 + maxImportPremium) / 100   // 0-200 >> 0-60%

    //console.log(good, typefactor)

    if (enhanced) {
      decPrice = (goodsData.basePrice + (randomno & goodsData.priceStability) + (dayfactor * goodsData.priceStability * seasonFactor) + (goodsData.basePrice * typefactor * affluence) + (goodsData.basePrice * exportFactor)) * 4
    }
    else {
      decPrice = (goodsData.basePrice + (randomno & goodsData.priceStability) + (dayfactor * goodsData.priceStability * seasonFactor) + (goodsData.economicFactor * economyFactor)) * 4
    }

    const price = Math.max(Math.floor(decPrice) / 10, 0.1)
    return price
  }

  /**
   * 
   * @returns dayfactor
   */
  async dayfactor() {
    if (!(game.modules.get("foundryvtt-simple-calendar")?.active)) return 0
    const systemData = this.object.system
    systemData.trade.cycle.initial
    //10378972800   
    const baseDate = 10378972800 + Math.round(systemData.trade.cycle.initial * 24 * 60 * 60 * systemData.details.yearLength)

    const now = SimpleCalendar.api.timestamp()

    const cycle = Math.round((now - baseDate) / (24 * 60 * 60))



    // need to do this instead of random to get the same value for the same day
    //const today = Math.ceil(Math.floor(Math.random() * systemData.details.yearLength))
    const dayfactor = (Math.sin(cycle / systemData.details.yearLength * 2 * Math.PI) + 1) * 0.5
    /* console.log(this.object.name)
     console.log(systemData.trade.cycle.initial)
     console.log(systemData.details.yearLength)
     console.log(now)
     console.log(baseDate)
     console.log(cycle) 
     console.log(dayfactor)*/
    return dayfactor
  }

  /**
   * 
   * @param {*} event 
   * @returns 
   */
  async _onItemCreate3(event) {
    event.preventDefault();
    const systemData = this.object.system
    const header = event.currentTarget;
    const currentStarship = game.settings.get("sfrpg-galactic-trade", "myShip") ?? {};
    const BPValue = game.settings.get("sfrpg-galactic-trade", "BPValue") ?? 25;
    const myShip = await game.actors.contents.find((actor) => actor.uuid === currentStarship)
    if (!myShip) { return ui.notifications.warn(game.i18n.format("No Trading ship selected in Configure Game Settings")) }
    const dataset = header.dataset;

    const token = game.canvas.tokens.controlled[0]
    console.log(token)

    if (!token) return ui.notifications.warn(game.i18n.format("No Actor Token Selected"));
    const actor = token.actor
    if (actor.type == "starship") return ui.notifications.warn(game.i18n.format("No Character with skills selected"));
    const allskills = actor.system.skills
    let skillToUse = "dip"

    // use merchant if greater

    for (let [k, v] of Object.entries(allskills)) {
      if (v.subname?.toLowerCase() === "merchant") {
        if (v.mod > allskills.dip.mod) skillToUse = k
      }
    }



    /*
    if (!roll) 
    {
      ui.notifications.warn(game.i18n.format("No Roll Result Returned from Actor Skill Roll using backup roll"));
      let buroll = await (new Roll(`1d20+${actor.system.skills[skillToUse].mod}`)).evaluate();
         //   rollResult = roll.total;
          roll = {callbackResult : buroll};
    
    buroll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            flavor: game.i18n.localize("SFRPG.ActionSkill") + " - " + game.i18n.localize(SFRPG_GT.skills[skillToUse])
          });
    
    }
    */
    let roll = await (new Roll(`1d20+${actor.system.skills[skillToUse].mod}`)).evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      flavor: game.i18n.localize("SFRPG.ActionSkill") + " - " + game.i18n.localize(SFRPG_GT.skills[skillToUse])
    });
    const result = roll.total
    const charLevel = actor.system.details.level.value
    let dc = 15 + Math.floor(charLevel * 1.5)
    if (systemData.trade.goods[dataset.id].quantity === 0) dc = 25 + Math.floor(charLevel * 1.5);
    let success = false
    let sellPrice = 0
    console.log(dc, result)
    let variation = 0
    if (result < dc) { success = false }
    else {
      variation = 1 + Math.floor((result - dc) / 5);
      success = true
    }


    if (!success) {

      const html = '<h2>Galactic Trade</h2><h3>Diplomacy Failure</h3><p>The Seller looks at you with distain, eyes you up and down, then tells you they do not sell to your kind. <br>Maybe they can be persuaded?</p>'
      // console.log(game.user)
      const chat = ChatMessage.create({
        user: game.user.id,

        content: html,
        //whisper: [game.user.id]

      })

    }



    //console.log(header.dataset, this)
    const date = this.object.system.trade.tradeDataDate
    const parsedDate = SimpleCalendar.api.formatTimestamp(date)
    const goods = foundry.utils.duplicate(this.object.system.trade.goods[dataset.id])
    if (!success) {
      goods.quantity = 0
    }


    goods.quantity += variation * 25
    goods.lots = Math.max(lots(goods.quantity), 0)
    let createData = {
      name: game.i18n.localize(SFRPG_GT.goods[dataset.id]),
      type: "goods",
      qty: 0
    };

    let compTable = {}
    game.tables.forEach((value, key) => {
      if (value.name.startsWith("SFRPG-GT-Comp")) compTable = value
    });
    /*{
      "publicroll": "CHAT.RollPublic",
      "gmroll": "CHAT.RollPrivate",
      "blindroll": "CHAT.RollBlind",
      "selfroll": "CHAT.RollSelf"
  }*/

    const compRoll = await compTable.draw({ displayChat: true, rollMode: "blindroll" })
    console.log(compRoll)
    let gmstring = compRoll.results[0].text
    console.log(gmstring)
    const complications = JSON.parse(gmstring)
    console.log(complications)

  //  TextEditor.enrichHTML(complications.gm, { secrets: true }).then((enriched) => {
   //   complications.gme = enriched
   // })
    // TextEditor.enrichHTML(complications.pc, { secrets: true }).then((enriched) => {
    //    complications.pce = enriched 
    //  })
    complications.gm = await TextEditor.enrichHTML(complications.gm, { secrets: true })
    complications.pce = await TextEditor.enrichHTML(complications.pc, { secrets: true })

    //let gmstring = compRoll.results[0].text

    /*
    for (const [k, v] of Object.entries(complications)) {
    const startRoll = v.indexOf("[[")
    const endRoll = v.indexOf("]]")
    if (!(startRoll === -1 || endRoll === -1)) {
      console.log(startRoll, endRoll)
      const dieroll = v.slice(startRoll + 2, endRoll)
      console.log(dieroll)
      const rollresult = await new Roll(dieroll).evaluate()
      console.log(rollresult)
      const rollresultTotal = " = " + rollresult.result

      const startString = v.slice(0, endRoll + 2)
      const endString = v.slice(endRoll + 2)
      complications[k] = startString + rollresultTotal + endString

    }
  }
*/

    const pc = !(complications.pc === "")



    let templateData = { cdata: complications.pce, pc: pc, buy: true, purchaserName: actor.name, name: createData.name, goods: goods, type: "goods", location: this.object.name, date: parsedDate, success: success, variation: variation, dc: dc, result: result, skill: skillToUse, charLevel: charLevel, sellPrice: sellPrice, BPValue: BPValue }
    console.log(createData, templateData)





    const dlg = await renderTemplate(`modules/sfrpg-galactic-trade/templates/cargo-create.html`, templateData);
    new Dialog({
      title: game.i18n.format("Buy Items"),
      content: dlg,
      buttons: {
        create: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.format("Buy Items"),
          callback: html => {
            const form = html[0].querySelector("form");
            let formDataExtended = new FormDataExtended(form);
            // console.log(formDataExtended,html)
            foundry.utils.mergeObject(createData, formDataExtended.object);
            if (createData.dn25) createData.price = Math.round(createData.price * 0.75 * 10) / 10;
            if (createData.up25) createData.price = Math.round(createData.price * 1.25 * 10) / 10;
            console.log(createData)


            //this.onBeforeCreateNewItem(createData);
            createData.lots = Math.max(Math.round(createData.qty / 25 * 100) / 100, 0)
            createData.bp = Math.round(createData.price / BPValue * 100) / 100
            templateData.total = { eCr: Math.round(createData.qty * goods.price * 100) / 100, bp: Math.round(createData.lots * goods.bp * 100) / 100 }
            createData.total = templateData.total


            createData.balance = { bp: Math.round((myShip.system.currency.bp - createData.total.bp) * 100) / 100, eCr: Math.round((myShip.system.currency.bp - createData.total.bp) * BPValue * 100) / 100 }
            renderTemplate(`modules/sfrpg-galactic-trade/templates/cargo-description.html`, templateData).then((cargoDesc) => {
              const itemData = {
                name: createData.qty + " tons of " + createData.name,
                type: createData.type,
                flags: { SFRPG_GT: { type: dataset.id, qty: createData.qty, goods: goods } },
                system: {
                  description: { value: cargoDesc, gmNotes: gmstring },
                  //description: { value: "This is " + createData.qty + " tons of " + createData.name + "purchased from " + this.object.name + " for " + createData.price + " BP / lot",short:dlg },

                  bulk: createData.qty + " tons",
                  price: createData.bp,
                  quantity: createData.lots

                }
              };
              const newGoods = myShip.createEmbeddedDocuments("Item", [itemData]).then((item) => {
                console.log(item)
                myShip.update({ "system.currency.bp": Math.round((myShip.system.currency.bp - createData.lots * createData.bp) * 100) / 100 })
                const tradeData = {
                  newGoods: item[0],
                  success: success,
                  variation: variation,
                  dc: dc,
                  actor: actor,
                  myShip: myShip,
                  name: createData.name,
                  createData: createData,
                  variation: variation,
                  sell: false,
                  buy: true,
                  planet: this.object

                }
                this.tradeChatmessage(tradeData)



                const buyItem = duplicate(systemData.trade.goods[dataset.id])
                const itempath = "system.trade.goods." + dataset.id

                buyItem.quantity = Math.max(Math.round(buyItem.quantity - createData.qty), 0)
                if (this.object.isOwner) {
                  const updatedgoods = this.object.update({ [itempath]: buyItem })
                  console.log(buyItem, updatedgoods)
                }

              });
              //  console.log(createData.lots, createData.bp, createData.price, Math.round(createData.lots * createData.bp * 100) / 100)
              // myShip.update({ "system.currency.bp": Math.round((myShip.system.currency.bp - createData.lots * createData.bp) * 100) / 100 })
            });
            // myShip.onBeforeCreateNewItem(itemData);



          }
        }
      },
      default: "create"
    }).render(true);
    return null;
  }
}

function credits(bp) {
  const BPValue = game.settings.get("sfrpg-galactic-trade", "BPValue")
  return Math.floor(bp * BPValue * 10) / 10
}

function bp(credits) {
  // goods.lots = Math.max(Math.round(goods.quantity / 25 * 100) / 100, 0)
  // createData.bp = Math.round(createData.price / BPValue * 100) / 100
  const BPValue = game.settings.get("sfrpg-galactic-trade", "BPValue")
  return Math.round(credits / BPValue * 100) / 100
}

function tons(lots) {
  // const BPValue = await game.settings.get("sfrpg-galactic-trade", "BPValue")
  return Math.floor(lots * 25)

}

function lots(tons) {
  // const BPValue = await game.settings.get("sfrpg-galactic-trade", "BPValue")
  // console.log(tons, Math.round(tons / 25 * 100) / 100)
  return Math.round(tons / 25 * 100) / 100

}

