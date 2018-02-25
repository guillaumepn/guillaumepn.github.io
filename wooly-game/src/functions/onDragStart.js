module.exports = function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.8;
    this.dragging = true;
};