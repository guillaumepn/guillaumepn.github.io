// Cet event click concerne le clic sur les tiles de la map, dans l'éditeur

module.exports = function () {

  const onHover = require('../onHover');
  const onOut = require('../onOut');
  const onClick = require('./buttons/onClick');
  const Sprite = require('../../components/sprite');
  const MapObject = require('../../components/mapobject');
  let main = require('../../main');
  let grid = main.grid;
  let map = main.map;
  let tooltips = main.tooltips;
  let editor = main.editor;
  let tileButtons = main.tileEditorArea;
  let objectButtons = main.objectEditorArea;
  let uiButtons = main.uiEditorArea;
  let cat = main.cat;
  let wool = main.wool;

  let tileSpecs = {
    'grass': {
      'accessible': true,
      'deadly': false
    },
    'water': {
      'accessible': true,
      'deadly': true
    },
    'sand': {
      'accessible': true,
      'deadly': false
    },
    'stone': {
      'accessible': true,
      'deadly': false
    },
    'ice': {
      'accessible': true,
      'deadly': false
    },
  };

  let objectSpecs = {
    'tree': {
      'accessible': false,
      'deadly': false
    },
    'stone1': {
      'accessible': false,
      'deadly': false
    },
    'wall': {
      'accessible': false,
      'deadly': false
    },
  };

  let selectedButton = tileButtons.children.filter(button => button.highlight)[0] ||
    objectButtons.children.filter(button => button.highlight)[0] ||
    uiButtons.children.filter(button => button.highlight)[0];

  if (selectedButton) {
    let textureName = selectedButton.name.replace('editor-', '');
    // For a tile
    if (selectedButton.type === 'tile') {
      map.tiles[this.infos.id].firstLayer.texture = textureName;
      map.tiles[this.infos.id].firstLayer.accessible = tileSpecs[textureName].accessible;
      map.tiles[this.infos.id].firstLayer.deadly = tileSpecs[textureName].deadly;
      grid.container.children[this.infos.id].texture = PIXI.loader.resources[textureName].texture;
    }
    // For an object
    else if (selectedButton.type === 'object') {
      if (textureName === 'eraser') {

        if (map.tiles[this.infos.id].secondLayer && grid.container.children[this.infos.id].object) {
          map.tiles[this.infos.id].secondLayer = null;
          grid.container.removeChild(grid.container.children[this.infos.id].object);
          grid.container.children[this.infos.id].object = null;
          this.infos.object = null;
        }

      } else {

        if (!map.tiles[this.infos.id].secondLayer) {
          map.tiles[this.infos.id].secondLayer = {
            texture: textureName,
            accessible: objectSpecs[textureName].accessible,
            deadly: objectSpecs[textureName].deadly
          };
        } else {
          map.tiles[this.infos.id].secondLayer.texture = textureName;
          map.tiles[this.infos.id].secondLayer.accessible = objectSpecs[textureName].accessible;
          map.tiles[this.infos.id].secondLayer.deadly = objectSpecs[textureName].deadly;
        }

        // S'il y a déjà un objet à cet endroit, on le remplace
        if (grid.container.children[this.infos.id].object) {
          grid.container.children[this.infos.id].object.texture = PIXI.loader.resources[textureName].texture;
          grid.container.children[this.infos.id].object.resetHeight(grid.container.children[this.infos.id].object.texture.height);
        }
        // Sinon on crée un nouvel objet
        else {
          let location = {
            id: this.infos.id,
            x: this.infos.x,
            y: this.infos.y
          };
          this.infos.object = map.tiles[this.infos.id].secondLayer;
          let object = new MapObject(textureName, this.infos.id, location.x, location.y, location, this.infos);
          object.alpha = 0.9;
          grid.container.addChild(object);
          grid.container.children[this.infos.id].object = object;

          // Reorder objects for better depth
          // // Sort objects into a new array
          let mapObjects =  grid.container.children
            .filter(child => child.type === 'MapObject')
            .sort((a, b) => {
              return (a.id - b.id);
            });
          // // Remove the unordered objects from the grid
          grid.container.children.filter(object => {
            if (object.type === 'MapObject') {
              grid.container.removeChild(object);
            }
          });
          // // Reinsert the ordered objects into the grid
          mapObjects.filter(object => {
            grid.container.addChild(object);
          });
        }
      }
    }
    // For a ui button
    else if (selectedButton.type === 'ui') {
      console.log(selectedButton, textureName);
      console.log(cat);
      // Case de départ
      if (textureName === 'start' && this.infos.id !== map.player.goalTileId) {
        map.player.originTileId = this.infos.id;
        let startTile = grid.container.children[this.infos.id];
        cat.x = startTile.infos.x;
        cat.y = startTile.infos.y;
      }
      // Case de fin
      else if (textureName === 'goal' && this.infos.id !== map.player.originTileId) {
        map.player.goalTileId = this.infos.id;
        let goalTile = grid.container.children[this.infos.id];
        wool.x = goalTile.infos.x;
        wool.y = goalTile.infos.y;
        console.log(map.player.goalTileId);
      } else if ((textureName === 'start' && this.infos.id === map.player.goalTileId) || (textureName === 'goal' && this.infos.id === map.player.originTileId)) {
        alert("Le chat et la pelote ne peuvent pas être sur la même case");
      }
    }
  }

  if (!this.highlight) {
    this.highlight = true;
    this.highlightOn();
  } else {
    this.highlight = false;
    this.highlightOff();
    return;
  }

  grid.container.children.filter(child => {
    if (child.type === 'MapTile' && child.infos.id !== this.infos.id) {
      child.highlight = false;
      child.highlightOff();
    }
  });

  console.log(this.infos);
};
