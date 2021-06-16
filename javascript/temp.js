function getParent(element, amount) {
    if (amount == 0) return element;
    return getParent($(element)[0].parentNode, amount - 1);
}

$.fn.class = function(){
  return Array.prototype.slice.call( $(this)[0].classList );
}

$.event.props.push('dataTransfer');
$('.drop_box').on({
    dragenter: function(e) {
        $(this).css('color', 'lightBlue');
    },
    dragleave: function(e) {
        $(this).css('color', 'white');
    },
    drop: function(e) {
        console.log("ok?");
        e.stopPropagation();
        e.preventDefault();

        var file = e.dataTransfer.files[0];
        var fileReader = new FileReader();

        var this_obj = $(this);

        fileReader.onload = (function(file) {
            return function(event) {
                // Preview
                $(this_obj).html('<img style="max-width: 200px; max-height: 200px;" src="' + event.target.result + '">');
            };
        })(file);

        fileReader.readAsDataURL(file);         
    }
});

$(document).click(function(e) {
    console.log(e.target);
    if (!($(e.target).hasClass('wind_setting_button'))) {
        $('.wind_settings').removeClass('active_wind_settings');
    }
});

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
   return result.join('');
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

function findInClassesId(c, str) {
    for (let i=0; i<c.length; i++) {
        if (c[i].includes(str))
            return c[i];
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

function runFunctionInWindow(e, function_name, ...args) {
    let id = findInClassesId($(e).class(), 'dynamic');
    findWindById(id)[function_name](...args);
}


function show_settings(id) {
    let wind_settings = get(id, '.wind_settings');
    wind_settings.addClass('active_wind_settings');
}

function showAdvanceSettings(id) {
    let advance_settings = $('.advance_settings');
    let menu = $('.menu');

    if (advance_settings.hasClass(`active_sliding_settings`)) {
        updateWindFromAdvance(advance_settings[0], 'Discard');
    } 
    advance_settings.addClass(`active_sliding_settings`);

    $('.advance').addClass(`${id}`);

    let wind = findWindById(id);
    let panels = $(`.advance_settings .panels`).children();
    for (let i=0, j=0; i<wind.allowed_advances.length; i++, j+=2) {
        if (wind.allowed_advances[i] == '1') {
            $(panels[j]).removeClass('hide');
            $(panels[j+1]).removeClass('hide');
        } else {
            $(panels[j]).addClass('hide');
            $(panels[j+1]).addClass('hide');
        }
    }

    menu.removeClass('active_sliding_settings');
}

function showMenuSettings() {
    let menu = $('.menu');

    if (menu.hasClass('active_sliding_settings')) {
        menu.removeClass('active_sliding_settings');
    } else {
        menu.addClass('active_sliding_settings');
    }
}

function updateWindFromAdvance(e, type) {
    switch(type) {
        case 'Save': {
            runFunctionInWindow(e, 'onSave', 'advance'); 
            break;
        }
        case 'Discard': {
            runFunctionInWindow(e, 'onDiscard', 'advance');
            break;
        }
    }
}
