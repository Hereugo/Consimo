function getParent(element, amount) {
    if (amount == 0) return element;
    return getParent($(element)[0].parentNode, amount - 1);
}

$.fn.class = function(){
  return Array.prototype.slice.call( $(this)[0].classList );
}

// Custom file drop extension
$.fn.extend({
    filedrop: function (options) {
        var defaults = {
            callback : null
        }
        options =  $.extend(defaults, options)
        return this.each(function() {
            var files = []
            var $this = $(this)
            // Stop default browser actions
            $this.bind('dragover', function(event) {
                event.stopPropagation();
                $this.css('color', '#0088CC');
                event.preventDefault();
            })
            $this.bind('dragleave', function(event) {
                event.stopPropagation();
                $this.css('color', '#172b4d');
                event.preventDefault();
            });


            // Catch drop event
            $this.bind('drop', function(event) {
                // Stop default browser actionsevent.stopPropagation()
                event.preventDefault()
                $this.css('color', '#172b4d');
                // Get all files that are dropped
                files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files
                // Convert uploaded file to data URL and pass trought callbackif(options.callback) {
                    var reader = new FileReader()
                    reader.onload = function(event) {
                        options.callback(event.target.result)
                    }
                    reader.readAsDataURL(files[0])
            })
        })
    }
})
// Event listener filedropper
$('.drop-box').filedrop({
    callback : function(fileEncryptedData) {
        var img = $('.drop-box img');
        img.attr('src', fileEncryptedData);

        $('.drop-box-input').css('display', 'none');
    }
})


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

function fillAdvanceSettings(wind) {
    console.log(wind);
    let command_input = $(`.advance_settings .${wind.id} .command_input`);
    let input_text = $(`.advance_settings .${wind.id} .input_text`);
    let variable_name = $(`.advance_settings .${wind.id} .output_var_name`);
    let img = $(`.advance_settings .${wind.id}.drop-box img`);

    command_input.val(wind.command_name || "");
    input_text.val(wind.message.text || "");
    variable_name.val(wind.variable_name || "");

    img.attr('src', wind.message.photo || "");
    if (img.attr('src') == "") {
        $('.drop-box-input').css('display', 'block');
    }
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
    fillAdvanceSettings(wind);

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
