# SFRPG Galactic Trade Module

![Foundry v12](https://img.shields.io/badge/foundry-v12-green)

## Overview

The SFRPG Galactic Trade Module is designed to enhance your Starfinder Roleplaying Game experience by introducing a comprehensive trading system. This module allows players to engage in interstellar trade, manage resources, and navigate the complexities of a galactic economy. There are 2 options for play.
1. Basic Trading - as per Fly Free or Die Adventure Path. The system provides roll tables to use that system.
2. Enhance Galactic Trade - This Implementation uses the Galactic Trade system from the original 1980s source code for the classic space game Elite. Elite was written by Ian Bell and David Braben and first released in 1984. The code has been modified to provide better control over the planetary markets for the GM. Instead of a linear Poor -> Rich basis for foods availability, each planet can be a net importer or exporter of 5 different goods types. Luxuries, Technology Minerals and Ore, Organics Material, Sentient Resources. 



## Features

- **Interstellar Trade**: Buy and sell goods across different star systems.
- **Resource Management**: Keep track of your resources and manage your inventory efficiently.
- **Dynamic Economy**: Experience a living economy that reacts to player actions and market conditions.
- **Random Events**: Encounter random events that can affect your trading operations.

## Installation

1. You can install the system by pasting the following URL into the Install System dialog on the Setup menu of the application.
https://raw.githubusercontent.com/nzlbob/sfrpg-galactic-trade/refs/heads/main/module.json


## Usage
Setup
1. Load the module in your Starfinder game. Simple Calander is also required.
2. Copy the Galactic Trade Journal Folder, Macros and Roll Tables into your game.
3. In Starfinder Galactic Tade Configure Game Settings. 
4. Each Player will need to have ownership of a starship to keep a track of BP and cargo purchases. This is set in the Starfinder Galactic Tade Configure Game Settings page from a drop down of all owned ships. The game will need to be reloaded if new ownership of a ship is granted to a player.
5. Open the Galactic Trade Journal. Each planet page has a details and a trade tab.
6. Set the SFRPG Galactic trade option on...(Maybe I can do that)

Modifying Planets
1. To modify a planet, edit the jounal entry.
2. On the Dtails tab, set the economic factors as required. 
3. The Import / Export % sliders for the comodity types set the price and demand foe goods of that type. A low % is an importer of goods so prices will be high and there will be few for sale.
4. The trading port % will increase the volume of goods available. For trading hubs like Absolom station, set the trading port to 100% and import / export % also be close to 100%.
5. On the trade tab, the goods that are available for free (legal) trade are set, as well as illegal trade. Illegal trade is not prevented, but it is a great hook for role playing, if the PC's decide to trade in prohibited goods. PC's might get an import permit from a corrupt official, or conduct a clandestine drop.
6. The Tons available can be manually set, however these will be over written when the "Update Prices" button is pressed.

GM Guide
1. Consider the trade page, not as a stock market but more of a service where individuals advertise contracts. PC's will undoubtedly proclaim they will sell the BC for credits, but that's not how it works! The "Purchase" is a bond paid in bp to Abadar Corp ownership remains with the seller until the space truckers find a buyer.  
2. GM's should press the Update prices button when the PC's arrive in a new system or buy out of system trade data from a broker. As all communication and space travel takes time, the only accurate data is for the system they are currently in in. 
3. The Journal pages are not locked to the PC's current location so it is possible to buy goods from any location. The GM can set the current location of his designated starship by pressing the "Set current" button. This simply highlights the PC's current location on the planet details page. 

Purchsing Goods.
1. Open the Planet Trade Page. Green highlighted entries are 20% above the Galactic average price, Red are below the galactic average.
2. Items with red Buy or Sell buttons are restricted or illegal. The GM will have a special surprise for PC's conducting illegal trade.
3. Hovering over an entry will show the full BP value of an item.
4. Pressing Buy will cause a diplomacy or profession trader (whichever has highest ranks) skill check for the player. (Note the PC's token must be selected to pick up the skills). The DC is 15 + 1.5 x PC's level if there are goods available. Exceeding the DC by 5 or more allows the pc to buy additional lots. This DC is 25 + 1.5 x PC's level of there a 0 goods on market. 
Once the skill check is made, A private roll of the SFRPG-GT-Complications rolltable is made so the PC's might be getting a bargain or stolen goods. The SFRPG-GT-Complications rolltable should be altered by the GM from time to time. Follow the existing format which defines text for the pc and the gm. Do not rename this table as the code looks for this specific name.
Next a purchse dialog is opened allowing the PC to make a purchase. The price and quantity can be freely altered by the player. If the entered data differs from the market data then this is an awesome roleplayng opportunity!!
When the player completes the buy (note market data is not actually altered, but I might implement later) A cargo object is created in the ship cargo hold, BP are deducted from the ships balance and a "AbadarCorp consignment note" is put into chat, detailing the purchase.

The Cargo object
1. The description page carries a copy of the trade data at time of sale
2. The Cargo object in the hold also contains GM's notes of the "complications". 
3. The Quantity field sets the quantity available for sale. This value can be adjusted if goods are lost stolen etc.
4. If all trades are complete they set off for thei destination.

Selling goods
1. Arriving at a new system, the PC's will be keen to get the latest data. Using Simple Calander set the new date.
2. "Set Current" on the new system, and press "Update Prices" on the Trade Tab.
3. PC presses sell button and a skill roll will generate. The DC is 25 + 1.5 x level for markets with > 0 goods for sale and 15 + 1.5 x level for markets with 0 avalable to sell. for every 1 over the DC the player will be able to sell at 1% bonus price.
4. As above the sell popup allows the PC to alter the price. On hitting the sell items button the goods in the cargo hold will be removed. Partial and multi lots can be sold in one sale. BP will be deposited into the ship BP and a Notice of delivery appear in chat.

## Contributing

We welcome contributions from the community! If you would like to contribute to this module, please fork the repository and submit a pull request with your changes. Make sure to follow the contribution guidelines outlined in `CONTRIBUTING.md`. If I knew what I was doing with Github this might work.

## License

This module is licensed under the MIT License. See the `LICENSE.md` file for more details. Yea right!

## Contact

TBA For support or inquiries, please contact the development team at [support@example.com](mailto:support@example.com).
