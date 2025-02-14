/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

    // Define template paths to load
    const templatePaths = [
      // Attribute list partial.
    //  "systems/Alternityd100/templates/parts/sheet-attributes.html",
    //  "systems/Alternityd100/templates/parts/sheet-groups.html",
  
  // Actor Sheet Partials
  "modules/sfrpg-galactic-trade/templates/planet-biography.html",
    // Load the template parts

];

// Load the template parts
return loadTemplates(templatePaths);
};