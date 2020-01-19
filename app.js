const testFolder = './dt/';
const fs = require('fs');
const files = fs.readdirSync(testFolder).map(file => file);
/* #region merge recipes to one file */
function merge() {
  const data = files.map(file => {
    var d = require('./dt/' + file);
    var image = null,
      cuisine = [],
      course = [];
    try {
      image = d.images[0].hostedLargeUrl;
      cuisine = d.attributes.cuisine;
      course = d.attributes.course;
    } catch (error) {}
    return {
      t: d.totalTime,
      id: d.id,
      r: d.rating,
      n: d.name,
      ser: d.numberOfServings,
      nut: d.nutritionEstimates.map(a => ({
        n: !a.description ? a.attribute : a.description,
        v: a.value,
        u: a.unit.pluralAbbreviation
      })),
      ing: d.ingredientLines,
      p: image,
      c: cuisine,
      co: course,
      f: !!d.flavors ? d.flavors : [],
      src: d.source.sourceRecipeUrl
    };
  });

  let json = JSON.stringify(data);
  fs.writeFileSync('data.json', json);
}
/* #endregion */

function fetchCuisines() {
  var data = require('./data.json');
  var c = [];
  data.forEach(d => {
    if (d.c.length) {
      c = c.concat(d.c);
    }
  });

  fs.writeFileSync('cuisines.json', JSON.stringify([...new Set(c)]));
}

// merge();
// fetchCuisines();

files.forEach(file => {
  var d = require('./dt/' + file);
  fs.writeFileSync('./items/' + d.id + '.json', JSON.stringify(d));
});
