function getParent(element, amount) {
    if (amount == 0) return element;
    return getParent($(element)[0].parentNode, amount - 1);
}

$.fn.class = function(){
  return Array.prototype.slice.call( $(this)[0].classList );
}
function template(strings, ...keys) {
  return (function(...values) {
    var dict = values[values.length - 1] || {};
    var result = [strings[0]];
    keys.forEach(function(key, i) {
      var value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  });
}
function get(id, block_name='#') {
    if (block_name == '#') {
        return $(`#${id}`);
    } else {
        return $(`.${id}${block_name}`);
    }
}

function findWindById(id) {
    for (let i=0; i<winds.length; i++) {
        if (winds[i].id == id)
            return winds[i];
    }
    return null;
}


function updateEverything() {
    for (let i=0; i<winds.length; i++) {
        winds[i].updateEverything();
    }
}

function zoom(type) {
    if (type == 'out') {
        currentScale = Math.max(currentScale - incScale, minScale);
    } else if (type == 'in') {
        currentScale = Math.min(currentScale + incScale, maxScale);
    }
    $('.container').css('font-size', `${currentScale}px`);
    updateEverything();
    $('.currentScale').html(`${Math.floor(currentScale / maxScale * 100)}%`);
}

function runFunctionInWindow(function_name, id, ...args) {
    findWindById(id)[function_name](...args);
}