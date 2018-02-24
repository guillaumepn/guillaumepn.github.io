class Grid {
    // Properties
    constructor(horizontalTiles, verticalTiles, tileWidth, tileHeight) {
        this.horizontalTiles = horizontalTiles;
        this.verticalTiles = verticalTiles;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }
    // Methods
    draw() {
        console.log(
            `
            ${this.horizontalTiles} et ${this.verticalTiles} 
            `
        );
    }
}

module.exports = Grid;