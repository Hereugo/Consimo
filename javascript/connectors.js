var plumb = null;
var anEndpointSource = null;
var anEndpointDestination = null;


var $container = $('.container');

var $panzoom = null;
var currentScale = 12;
var minScale = 6;
var maxScale = 24;
var incScale = 2;

var LIMIT_BUTTONS_ROW = 4;
var LIMIT_BUTTONS_COL = 4;
var allButtons = 0;
var allwinds = 0;
var winds = [];


jsPlumb.ready(function () {
    function button(text, id) {
        this.text = text;
        this.id = id;
    }
    function input_wind() {
        this.type = 'input_wind';
        this.id = "dynamic_" + winds.length;
        this.token = winds.length;
        this.command_name = "";
        this.message = {
            photo: "",
            text: "",
        }
        this.variable_name = "";

        this.buttons_layout = [];
        this.allowed_advances = "101101";

        this.updateEverything = function() {
            get(this.id, '.input_text').val(this.message.text);
            get(this.id, '.command_input').val(this.command_name);
            get(this.id, '.output_var_name').val(this.variable_name);

            get(this.id, '.message_image').attr('src', this.message.photo);
            if (this.message.photo != "")
                get(this.id, '.message_panel').css('border-radius', '0 0 0.5em 0.5em');
            else
                get(this.id, '.message_panel').css('border-radius', '0.5em'); 


            get(this.id).css({'height':'auto', 'width':'auto'});

            fixEndpoints(get(this.id), this.type);
            // plumb.repaintEverything();
        }

        this.onCopy = function() {
            create_wind(this.type);
            
            let wind = winds[winds.length-1];

            wind.command_name = this.command_name;
            wind.variable_name = this.variable_name;
            wind.message = this.message;

            wind.updateEverything();
        }

        this.onEdit = function() {
            // Set to Edit view
            get(this.id, '.edit').css('display', 'block');
            get(this.id, '.readonly').prop('readonly', false);
            get(this.id, '.command_input').css('display', 'block');

            this.updateEverything();
        }
        this.onSave = function(type) {
            switch(type) {
                case 'wind': {        
                    /// UPDATE IN WIND
                    ///#####################################################################
                    let command_input = get(this.id, '.command_input');
                    let input_text = get(this.id, '.input_text');
                    let variable_name = get(this.id, '.output_var_name');
                    if (variable_name.val() == "") variable_name.val(makeid(6));

                    this.command_name = command_input.val();
                    this.message.text = input_text.val();
                    this.variable_name = variable_name.val();

                    // Change back to normal view
                    if (this.command_name == "") command_input.css('display', 'none');
                    get(this.id, '.edit').css('display', 'none');
                    get(this.id, '.readonly').prop('readonly', true);
                    this.updateEverything();
                    ///#####################################################################
                    break;
                }
                case 'advance': {
                    /// UPDATE IN ADVANCE
                    ///#####################################################################
                    let command_input = $(`.advance_settings .${this.id} .command_input`);
                    let input_text = $(`.advance_settings .${this.id} .input_text`);
                    let img = $(`.advance_settings .${this.id}.drop-box img`);
                    let variable_name = $(`.advance_settings .${this.id} .output_var_name`);
                    if (variable_name.val() == "") variable_name.val(makeid(6));

                    this.command_name = command_input.val();
                    this.message.text = input_text.val();
                    this.message.photo = img.attr('src');
                    this.variable_name = variable_name.val();

                    get(this.id, '.edit').css('display', 'none');
                    get(this.id, '.readonly').prop('readonly', true);
                    this.updateEverything();

                    clearAdvanceSettings(this);
                    ///#####################################################################
                    break;
                }
            }
        }
        this.onDiscard = function(type) {
            switch(type) {
                case 'wind': {
                    /// UPDATE IN WIND
                    ///#####################################################################
                    let command_input = get(this.id, '.command_input');
                    let input_text = get(this.id, '.input_text');
                    let variable_name = get(this.id, '.output_var_name');

                    command_input.val(this.command_name);
                    input_text.val(this.message.text);
                    variable_name.val(this.variable_name);

                    get(this.id, '.edit').css('display', 'none');
                    get(this.id, '.readonly').prop('readonly', true);
                    this.updateEverything();
                    ///#####################################################################
                    break;
                }
                case 'advance': {
                    /// UPDATE IN ADVANCE
                    ///#####################################################################
                    get(this.id, '.edit').css('display', 'none');
                    get(this.id, '.readonly').prop('readonly', true);
                    this.updateEverything();

                    clearAdvanceSettings(this);
                    ///#####################################################################
                    break;
                }
            }

        }

        this.onDelete = function() {
            plumb.removeAllEndpoints(this.id);
            plumb.remove(this.id);

            winds.splice(this.token, 1);
        }
    }
    function url_wind() {
        this.type = 'url_wind';
        this.id = "dynamic_" + winds.length;
        this.token = winds.length;

        this.buttons_layout = [];
        this.url = "";

        this.updateEverything = function() {
            get(this.id, '.url_input').val(this.url);
            get(this.id).css({'height':'auto', 'width':'auto'});
            plumb.repaintEverything();            
        }

        this.onCopy = function() {
            create_wind(this.type);
            
            let wind = winds[winds.length-1];

            wind.url = this.url;

            wind.updateEverything();
        }

        this.onEdit = function() {
            get(this.id, '.url_input').prop('readonly', false);
            get(this.id, '.edit').css('display', 'block');
            
            this.updateEverything();
        }

        this.onSave = function() {
            let url_input = get(this.id, '.url_input');
            this.url = url_input.val();

            url_input.prop('readonly', true);
            get(this.id, '.edit').css('display', 'none');
        
            this.updateEverything();
        }

        this.onDiscard = function() {
            let url_input = get(this.id, '.url_input');

            url_input.val(this.url);

            url_input.prop('readonly', true);
            get(this.id, '.edit').css('display', 'none');
        
            this.updateEverything();
        }

        this.onDelete = function() {
            plumb.removeAllEndpoints(this.id);
            plumb.remove(this.id);

            winds.splice(this.token, 1);
        }
    }
    function wind() {
        this.type = 'message_wind';
        this.id = "dynamic_" + winds.length;
        this.token = winds.length;
        this.command_name = "";
        this.message = {
            photo: "",
            text: "",
        };

        this.buttons_layout = [];
        this.allowed_advances = "101110";

        this.updateEverything = function() {
            
            get(this.id, '.input_text').val(this.message.text);
            get(this.id, '.message_image').attr('src', this.message.photo);
            if (this.message.photo != "")
                get(this.id, '.message_panel').css('border-radius', '0 0 0.5em 0.5em');
            else
                get(this.id, '.message_panel').css('border-radius', '0.5em'); 

            get(this.id, '.command_input').val(this.command_name);

            get(this.id).css({'height':'auto', 'width':'auto'});


            fixEndpoints(get(this.id), this.type);
            // plumb.repaintEverything();
        }

        this.readButtons = function(type) {
            let rows;
            let result = [];
            switch(type) {
                case 'wind': {
                    rows = get(this.id, `.buttons_container:not('.advance') .row`);
                    break;
                }
                case 'advance': {
                    rows = $(`.advance_settings .${this.id} .buttons_container .row`);
                    break;
                }
            }

            for (let i=0; i<rows.length - 1; i++) {
                let row = rows[i];

                result.push([]);
                let arr = $(row).find('input');
                for (let j=0; j<arr.length; j++) {
                    let input = arr[j];
                    let id = $(getParent(input, 1)).attr('id')

                    result[i].push(new button(input.value, id));
                }
            }

            this.buttons_layout = result;
        }
        this.update_buttons_input = function(buttons_layout) {
            let rows = get(this.id, `.buttons_container:not('.advance') .row`);
            console.log(rows);
            for (let i=0; i<rows.length - 1; i++) {
                let row = rows[i];
                let arr = $(row).find('input');
                for (let j=0; j<arr.length; j++) {
                    let input = arr[j];
                    input.value = buttons_layout[i][j].text;
                }
            }
        }
        this.onEdit = function() {
            // Set to Edit view
            get(this.id, '.edit').css('display', 'block');
            get(this.id, '.readonly').prop('readonly', false);
            get(this.id, '.wind_button').removeClass('noHover');
            get(this.id, '.command_input').css('display', 'block');

            this.updateEverything();
        }
        this.onCopy = function() {
            create_wind(this.type);
            
            let wind = winds[winds.length-1];

            wind.command_name = this.command_name;
            wind.message = this.message;

            let buttons_container = get(this.id, '.buttons_container').clone();
            get(wind.id, '.buttons_container').replaceWith(buttons_container);
            get(wind.id, ` .${this.id}`).removeClass(`${this.id}`).addClass(`${wind.id}`);
            get(wind.id, '.row_button:not(.save_button):not(.discard_button)').each(function (i, obj) {
                obj.id = "button_"+allButtons;
                allButtons++;
                addpoints($(`#${obj.id}`), 'button');
            });
            get(wind.id, '.button_add').click(addButton);
            wind.readButtons('wind');

            wind.updateEverything();
        }
        this.onSave = function(type) {
            switch(type) {
                case 'wind': {
                    /// UPDATE IN WIND
                    ///#####################################################################
                    let command_input = get(this.id, '.command_input');
                    let input_text = get(this.id, '.input_text');

                    this.command_name = command_input.val();
                    this.message.text = input_text.val();

                    // Change back to normal view
                    get(this.id, '.in_progress').removeClass('in_progress');
                    get(this.id, '.in_delete').each(function(i, obj) {
                        plumb.removeAllEndpoints(obj.id);
                        obj.remove();
                    });

                    this.readButtons('wind');
                    if (this.command_name == "") command_input.css('display', 'none');

                    get(this.id, '.edit').css('display', 'none');
                    get(this.id, '.readonly').prop('readonly', true);
                    get(this.id, '.wind_button').addClass('noHover');
                    this.updateEverything();
                    ///#####################################################################
                    break;
                }
                case 'advance': {
                    /// UPDATE FROM ADVANCE SETTINGS
                    ///#####################################################################
                    let command_input = $(`.advance_settings .${this.id} .command_input`);
                    let input_text = $(`.advance_settings .${this.id} .input_text`);
                    let img = $(`.advance_settings .${this.id}.drop-box img`);
                    let buttons_container = get(this.id, '.buttons_container');

                    this.command_name = command_input.val();
                    this.message.text = input_text.val();
                    this.message.photo = img.attr('src');

                    this.readButtons('advance');
                    
                    get(this.id, '.row_button').each(function(i, obj) {
                        plumb.removeAllEndpoints(obj.id);
                    });

                    let button_panel = $(`.advance_settings .${this.id} .button_panel`);
                    button_panel.find('.advance').removeClass('advance');
                    button_panel.find('.button_add').addClass('edit');
                    buttons_container.html(button_panel.find('.buttons_container').html());
                    buttons_container.find('.button_add').click(addButton);
                    buttons_container.css('overflow-x', 'hidden');

                    button_panel.find('.buttons_container').html(newAdvanceRowHTML).addClass('advance');

                    get(this.id, '.wind_button').each(function(i, obj) {
                        addpoints($(`#${obj.id}`), 'button');
                    });

                    this.update_buttons_input(this.buttons_layout);

                    get(this.id, '.edit').css('display', 'none');
                    get(this.id, '.readonly').prop('readonly', true);
                    get(this.id, '.wind_button:not(.advance)').addClass('noHover');
                    this.updateEverything();

                    clearAdvanceSettings(this);
                    ///#####################################################################   
                }
            }
        }
        this.onDiscard = function(type) {
            switch(type) {
                case 'wind': {
                    /// UPDATE IN WIND
                    ///#####################################################################   
                    let command_input = get(this.id, '.command_input');
                    let input_text = get(this.id, '.input_text');
                    
                    command_input.val(this.command_name);
                    input_text.val(this.message.text);

                    get(this.id, '.in_delete').each(function (i, obj) {
                        $(obj).removeClass('in_delete');
                        if ($(obj).class().some((className) => className === 'row')) {
                            addpoints($(obj).children(':first'), 'button');
                        } else {
                            addpoints($(obj), 'button');
                        }
                    });
                    get(this.id, '.in_progress').each(function(i, button) {
                        let row = $(`#${button.id}`).parent();
                        plumb.removeAllEndpoints(button.id);
                        if (row.children().length == 2) {
                            row.remove();
                        } else {
                            button.remove();
                        }
                    });

                    this.update_buttons_input(this.buttons_layout);

                    get(this.id, '.edit').css('display', 'none');
                    get(this.id, '.readonly').prop('readonly', true);
                    get(this.id, '.wind_button:not(.advance)').addClass('noHover');
                    this.updateEverything();
                    ///#####################################################################   
                    break;
                }
                case 'advance': {
                    /// UPDATE IN ADVANCE
                    ///#####################################################################   
                    get(this.id, '.edit').css('display', 'none');
                    get(this.id, '.readonly').prop('readonly', true);
                    get(this.id, '.wind_button:not(.advance)').addClass('noHover');
                    this.updateEverything();

                    clearAdvanceSettings(this);
                    ///#####################################################################
                    break;
                }
            }
        }

        this.onDelete = function() {
            plumb.removeAllEndpoints(this.id);
            plumb.remove(this.id);

            winds.splice(this.token, 1);
        }

        this.onDeleteButton = function(button_id) {
            let button = $(`#${button_id}`);
            let row = button.parent();

            if (row.children().length == 2) {
                row.addClass('in_delete');
            } else {
                button.addClass('in_delete');
            }
            plumb.removeAllEndpoints(button_id);
            
            get(this.id).css({'height':'auto', 'width':'auto'});
            plumb.repaintEverything();
        }
    }

    function create_wind(type) {
        var newWind = null;

        console.log(type);
        switch(type) {
            case 'message_wind': {
                newWind = new wind();        
                $('.panzoom').prepend(defaultBlockHTML(newWind.id));
                $(`#${newWind.id} .button_add`).click(addButton);
                break;
            }
            case 'url_wind': {
                newWind = new url_wind();
                $('.panzoom').prepend(defaultURLblockHTML(newWind.id));
                break;
            }
            case 'input_wind': {
                newWind = new input_wind();
                $('.panzoom').prepend(defaultInputblockHTML(newWind.id));
            }
        }
        allwinds++;

        let $window = $(window);
        let pos = $('.panzoom').offset();
        get(newWind.id).css({left: ($window.width() - get(newWind.id).width())/2 - pos.left,
                             top: ($window.height() - get(newWind.id).height())/2 - pos.top})

        winds.push(newWind);

        get(newWind.id).draggable({
            start: function(e){
                var pz = $container.find(".panzoom");
                $(this).css("cursor","move");
                pz.panzoom("disable");
            },
            drag: function(e, ui){
                plumb.repaintEverything();
                $('.wind_settings').removeClass('active_wind_settings');
            },
            stop: function(e, ui){
                plumb.repaintEverything();
                $(this).css("cursor","");
                $container.find(".panzoom").panzoom("enable");
            }
        });

        addpoints(get(newWind.id), newWind.type);
    }

    //Create new button for block
    var addButton = function() { // live

        var id = findInClassesId($(this).class(), "dynamic");
        var block = get(id);

        var row = getParent(this, 1);
        var buttons_container = getParent(row, 1);
        var advanceOptions = $(buttons_container).hasClass('advance');

        if ($(row).children(`.button:not('.in_delete')`).length + 1 > LIMIT_BUTTONS_ROW) {
            alert('Too many buttons in one column!')
            return;
        }
        if ($(row).is(':last-child') && $(buttons_container).children(`.row:not('.in_delete')`).length + 1 > LIMIT_BUTTONS_COL) {
            alert('Too many buttons in one row!');
            return;
        }

        let button_id = "button_"+allButtons;
        let newButton = $.parseHTML(newButtonHTML(id, button_id));
        allButtons++;

        $(this).before(newButton);

        // check if this is the last row, if true then create new row
        if ($(row).is(':last-child')) {
            $(this).removeClass('button_add_last');

            if (advanceOptions) {
                $(newRowHTML(id, "advance", "")).appendTo(buttons_container);
                $(`.${id}.advance.buttons_container .row:last-child .button_add`).click(addButton).css('display', 'block');
            } else {
                $(newRowHTML(id, "", "edit")).appendTo(buttons_container);
                $(`.${id}.buttons_container .row:last-child .button_add`).click(addButton).css('display', 'block');
            }
        }

        $(block).css({'height':'auto', 'width':'auto'});

        if (advanceOptions) {
            return;
        }

        addpoints($(`#${button_id}`), 'button');
    }


    function addpoints(node, type) {
        switch(type) {
            case 'button': {
                plumb.addEndpoint(node, anEndpointSource);
                break;
            }
            default: {
                plumb.addEndpoint(node, anEndpointDestination);
                if (type == 'input_wind') {
                    plumb.addEndpoint(node, anEndpointSource);
                }
                break;
            }
        }
        fixEndpoints(node, type);
    }

    //Fixes endpoints for specified target
    function fixEndpoints(node, type) {
        var endpoints = plumb.getEndpoints(node);
        var inputAr = $.grep(endpoints, (elementOfArray, indexInArray) => {
            return elementOfArray.isSource; //input
        });
        var outputAr = $.grep(endpoints, (elementOfArray, indexInArray) => {
            return elementOfArray.isTarget; //output
        });

        switch(type) {
            case 'button': {
                calculateEndpointButton(inputAr);
                break;
            }
            default: {
                if (type != 'input_wind')
                    calculateEndpointBlock(node, outputAr, []);
                else
                    calculateEndpointBlock(node, outputAr, inputAr);
                break;
            }
        }

        plumb.repaintEverything();
    }

    //recalculate endpoint anchor position manually
    function calculateEndpointBlock(node, endpointArray, endpointArray2) {
        if (endpointArray.length == 0) return;
        let node2 = node.find('.message_panel');

        let A = node.offset().top;
        let B = node2.offset().top;

        console.log(A, B)

        endpointArray[0].anchor.x = 0; // Left
        endpointArray[0].anchor.y = (B - A)/node.height(); // Top

        if (endpointArray2.length == 0) return;
        endpointArray2[0].anchor.x = 1; // Right
        endpointArray2[0].anchor.y = (B - A)/node.height(); // Top
    }
    function calculateEndpointButton(endpointArray) {
        if (endpointArray.length == 0) return;
        endpointArray[0].anchor.x = 1; // Right
        endpointArray[0].anchor.y = 0.5; // Middle
    }

    _.defer(function(){
        $panzoom = $container.find('.panzoom').panzoom({
            cursor: "",
            ignoreChildrensEvents:true,
        }).on("panzoomstart",function(e,pz,ev){
            $panzoom.css("cursor","move");
        })
        .on("panzoomend",function(e,pz){
            $panzoom.css("cursor","");
        });

        $panzoom.parent()
        .on('mousewheel.focal', function( e ) {
            e.preventDefault();
            var deltaY = e.deltaY || e.originalEvent.wheelDeltaY || (-e.originalEvent.deltaY);
            var deltaX = e.deltaX || e.originalEvent.wheelDeltaX || (-e.originalEvent.deltaX);
            $panzoom.panzoom("pan",deltaX/2,deltaY/2,{
              animate: true,
              relative: true,
            });
        })
        .on("mousedown touchstart",function(ev){
            var matrix = $container.find(".panzoom").panzoom("getMatrix");
            var offsetX = matrix[4];
            var offsetY = matrix[5];
            var dragstart = {x:ev.pageX,y:ev.pageY,dx:offsetX,dy:offsetY};
            $(ev.target).css("cursor","move");
            $(this).data('dragstart', dragstart);
        })
        .on("mousemove touchmove", function(ev){
            var dragstart = $(this).data('dragstart');
            if(dragstart) {
                var deltaX = dragstart.x-ev.pageX;
                var deltaY = dragstart.y-ev.pageY;
                var matrix = $container.find(".panzoom").panzoom("getMatrix");
                matrix[4] = parseInt(dragstart.dx)-deltaX;
                matrix[5] = parseInt(dragstart.dy)-deltaY;
                $container.find(".panzoom").panzoom("setMatrix",matrix);
            }
        })
        .on("mouseup touchend touchcancel", function(ev){
              $(this).data('dragstart',null);
              $(ev.target).css("cursor","");
        });
    });

    function clearAdvanceSettings(wind) {
        console.log(wind);
        let command_input = $(`.advance_settings .${wind.id} .command_input`);
        let input_text = $(`.advance_settings .${wind.id} .input_text`);
        let variable_name = $(`.advance_settings .${wind.id} .output_var_name`);
        let button_panel = $(`.advance_settings .${wind.id} .button_panel`);
        let img = $(`.advance_settings .${wind.id}.drop-box img`);

        command_input.val('');
        input_text.val('');
        variable_name.val('');
        img.attr('src', '');
        button_panel.find('.buttons_container').html(newAdvanceRowHTML).addClass('advance');
        $(`.advance_settings .buttons_container .button_add`).click(addButton);

        $('.advance').removeClass(`${wind.id}`);
        $('.advance_settings').removeClass('active_sliding_settings');
    }


    function exportt() {
        function save_scripts(wid) {
            let wind = findWindById(wid);
            let buttons = wind.buttons_layout;
            let result = {};

            if (buttons.length != 0) {
                var keyformats = "";
                let buttons = wind.buttons_layout;
                for (let i=0; i<buttons.length; i++) {
                    for (let j=0; j<buttons[i].length; j++) {
                        let u = findWindById(graph[wid][buttons[i][j].id]);
                        if (u.type == "url_wind") {
                            keyformats += keyformat('url');
                        } else {
                            keyformats += keyformat('callback'); 
                        }
                        if (i != buttons.length - 1 || j != buttons[i].length - 1) {
                            keyformats += ",\n\t\t";
                        }
                    }
                }
                result['keyformats'] = keyformats;
            }

            if (wind.type == "input_wind") {
                result['next_step'] = (wid in graph[wid])?graph[wid][wid]:"buffer_step";
                result['var_name'] = wind.variable_name;
            }

            let command_n = wind.command_name.substring(1);
            if (command_n != "") {
                result['command'] = command(command_n);
            }

            return result;
        }
        function generate_code_script(wid, vars) {
            console.group("Code script");
            let wind = findWindById(wid);
            console.log(wind, wid);
            console.log(vars);

            // generate script code
            var send_message;
            let buttons = wind.buttons_layout;


            let re = /\{\w+\}/g;
            let vars_ = re[Symbol.match](wind.message.text) || [], vars__string = "";
            console.log(vars_);
            for (let i=0; i<vars_.length; i++) {
                vars__string += `users[clid]['${vars_[i].substring(1, vars_[i].length - 1)}']${((i != vars_.length-1)?", ":"")}`;
            }
            if (vars__string != "") vars__string = `.format(${vars__string})`;
            console.log(vars__string);

            if (buttons.length == 0)
                if (wind.message.photo == "")
                    send_message = sMessage(wid, vars__string);
                else
                    send_message = sPhotoMessage(wid, vars__string);
            else
                if (wind.message.photo == "")
                    send_message = keyboard(vars['keyformats'], wid, vars__string);
                else
                    send_message = keyboardPhoto(vars['keyformats'], wid, vars__string);

            let func = message(wid, 
                               send_message, 
                               (('command' in vars)?vars['command']:""), 
                               ((wind.type == "input_wind")?var_text(vars['next_step'], vars['var_name']):""));
            console.log(func);
            console.groupEnd();
            return func;
        }

        function generate_code_config(wid) {
            console.group("Code config");
            let wind = findWindById(wid);

            let buttons = wind.buttons_layout;
            var buttonformats = "";

            for (let i=0; i<buttons.length; i++) {
                var temp = "\t\t\t[\n";
                for (let j=0; j<buttons[i].length; j++) {
                    let u = graph[wid][buttons[i][j].id];
                    let uwind = findWindById(u);

                    temp += buttonformat(buttons[i][j].text, u, uwind.url || "");
                    temp += (j != buttons[i].length - 1)?",\n":"\n";
                }
                temp += `\t\t\t]${(i != buttons.length - 1)?',\n':'\n'}`
                buttonformats += temp;
            }

            var photo = "";
            if (wind.message.photo != "") {
                photos.push(wind.message.photo);
                photo = photoformat(photos.length - 1);
            }

            var sub_tree = textformat(wid, wind.message.text.replace(/\{\w+\}/g, "{}"), buttonformats, photo);
            console.log(sub_tree);
            console.groupEnd();
            return sub_tree;
        }


        function dfs(v) {
            functions[v] = save_scripts(v);
            tree += generate_code_config(v);
            was[v] = true;

            for (let bid in graph[v]) {
                let u = graph[v][bid];
                let uwid = findWindById(u);
                if (uwid.type == "url_wind") continue;
                if (!was[u]) dfs(u);
            }
        }

        var graph = {}, was = {};
        var functions = {}, functions_string = "";
        var variables_string = "";
        var tree = "";
        var photos = [];

        for (let i=0; i<winds.length; i++) {
            graph[winds[i].id] = {};
            functions[winds[i].id] = {};
        }

        for (let i=0; i<winds.length; i++) {
            let wind = winds[i];

            //get inputs 
            let connections = plumb.getConnections({target: wind.id})
            console.log(connections);
            for (let i=0; i<connections.length; i++) {
                let source = connections[i].source;

                let v = findInClassesId($(source).class(), 'dynamic') || $(source).attr('id');
                let u = wind.id;

                graph[v][source.id] = u;
            }
        }
        console.log(graph);


        for (let i=0; i<winds.length; i++) {
            if (!was[winds[i].id]) dfs(winds[i].id);
        }


        for (let i=0; i<winds.length; i++) {
            let wind = winds[i];
            functions_string += generate_code_script(wind.id, functions[wind.id]);
            if (wind.type == "input_wind")
                variables_string += `\t'${wind.variable_name}': "",\n`;
        }

        // string based python files
        var code = template_code_script(functions_string);
        var config = template_code_config(tree, variables_string);
        var func = template_code_func;


        function download(obj, photos) {
            let zip = new JSZip();
            console.log(obj);
            for (let filename in obj) {
                zip.file(filename, obj[filename]);
            }
            for (let i=0; i<photos.length; i++) {
                let filename = `${i}.png`;
                zip.file(filename, convertBase64ToFile(photos[i], filename));
            }

            zip.generateAsync({type: "blob"}).then(function(content) {
              saveAs(content, "consimo_bot.zip");
            });
        }

        var obj = {'app.py': code, 'config.py': config, 'func.py': func};

        download(obj, photos);
    }


    // INIT
    (function() {
        $(".button_export").click(() => exportt());
        $(".button_add_window").click(() => create_wind('message_wind'));
        $(".button_add_window_url").click(() => create_wind('url_wind'));
        $('.button_add_window_input').click(() => create_wind('input_wind'));

        $('.button_add').click(addButton);

        let color = "gray";
        plumb = jsPlumb.getInstance({
            DragOptions: { cursor: "pointer", zIndex: 2000 },
            PaintStyle: { strokeStyle: color, lineWidth: 2 },
            EndpointStyle: { radius: 5, fillStyle: color },
            HoverPaintStyle: {strokeStyle: "#ec9f2e" },
            EndpointHoverStyle: {fillStyle: "#ec9f2e" },
            Container: $('#container_points'),
        });

        anEndpointSource = {
            endpoint: ["Rectangle", {width: 10, height: 10}],
            isSource: true,
            isTarget: false,
            maxConnections: 1,
            connectorOverlays:[ 
                [ "Arrow", { width:10, length:10, location:1, id:"arrow" } ],
            ],
            connector:[ "Flowchart", {cornerRadius:15}],
            anchor: [1, 0, 1, 0]
        };

        anEndpointDestination = {
            endpoint: "Dot",
            isSource: false,
            isTarget: true,
            maxConnections: -1,
            connectorStyle: {
                dashstyle: "2 4"
            },
            anchor: [0, 1, -1, 0]
        };
    })();
});