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
var winds = [];


jsPlumb.ready(function () {
    function button(text) {
        this.text = text;
    }
    function input_wind() {
        this.id = "dynamic_" + winds.length;
        this.token = winds.length;
        this.command_name = "";
        this.message = {
            album: [],
            text: "",
        }
        this.variable_name = "";

        this.allowed_advances = "001101";

        this.updateEverything = function() {
            get(this.id, '.input_text').val(this.message.text);
            get(this.id, '.command_input').val(this.command_name);
            get(this.id, '.output_var_name').val(this.variable_name);

            get(this.id).css({'height':'auto', 'width':'auto'});
            plumb.repaintEverything();
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
                    let variable_name = $(`.advance_settings .${this.id} .output_var_name`);
                    if (variable_name.val() == "") variable_name.val(makeid(6));

                    this.command_name = command_input.val();
                    this.message.text = input_text.val();
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

            winds[this.token] = null;
        }
    }
    function url_wind() {
        this.id = "dynamic_" + winds.length;
        this.token = winds.length;

        this.updateEverything = function() {
            get(this.id).css({'height':'auto', 'width':'auto'});
            plumb.repaintEverything();            
        }

        this.onEdit = function() {
            console.log("hello?");
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

            winds[this.token] = null;
   
        }
    }
    function wind() {
        this.id = "dynamic_" + winds.length;
        this.token = winds.length;
        this.command_name = "";
        this.message = {
            album: [],
            text: "",
        };

        this.button_layout = [];

        this.allowed_advances = "001110";

        this.updateEverything = function() {
            get(this.id, '.input_text').val(this.message.text);
            get(this.id, '.command_input').val(this.command_name);

            get(this.id).css({'height':'auto', 'width':'auto'});
            plumb.repaintEverything();
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
                    result[i].push(new button(input.value));
                }
            }

            this.buttons_layout = result;
            console.log(this);
        }
        this.update_buttons_input = function() {
            let rows = get(this.id, `.buttons_container:not('.advance') .row`);
            console.log(rows);
            for (let i=0; i<rows.length - 1; i++) {
                let row = rows[i];
                let arr = $(row).find('input');
                for (let j=0; j<arr.length; j++) {
                    let input = arr[j];
                    input.value = this.buttons_layout[i][j].text;
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
                    let buttons_container = get(this.id, '.buttons_container');

                    this.command_name = command_input.val();
                    this.message.text = input_text.val();
                    this.readButtons('advance');
                    
                    get(this.id, '.row_button').each(function(i, obj) {
                        plumb.removeAllEndpoints(obj.id);
                    });

                    let button_panel = $(`.advance_settings .${this.id} .button_panel`);
                    button_panel.find('.advance').removeClass('advance');
                    button_panel.find('.button_add').addClass('edit');
                    buttons_container.html(button_panel.find('.buttons_container').html());
                    buttons_container.css('overflow-x', 'hidden');

                    button_panel.find('.buttons_container').html(newAdvanceRowHTML).addClass('advance');

                    get(this.id, '.wind_button').each(function(i, obj) {
                        addpoints($(`#${obj.id}`), 'button');
                    });

                    this.update_buttons_input();

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

                    this.update_buttons_input();

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

            winds[this.token] = null;
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
            this.updateEverything();
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

        addpoints(get(newWind.id), 'block');
    }

    //Create new button for block
    var addButton = function() { // live

        var id = findInClassesId($(this).class(), "dynamic");
        var block = get(id);

        console.log(id);

        var row = getParent(this, 1);
        var buttons_container = getParent(row, 1);
        var advanceOptions = $(buttons_container).hasClass('advance');

        console.log(row);


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
        console.log(node);
        switch(type) {
            case 'block': {
                plumb.addEndpoint(node, anEndpointDestination);
                break;
            }
            case 'button': {
                plumb.addEndpoint(node, anEndpointSource);
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
            case 'block': {
                calculateEndpointBlock(node, outputAr);                 
                break;
            }
            case 'button': {
                calculateEndpointButton(inputAr);
                break;
            }
        }

        plumb.repaintEverything();
    }

    //recalculate endpoint anchor position manually
    function calculateEndpointBlock(node, endpointArray) {
        if (endpointArray.length == 0) return;
        endpointArray[0].anchor.x = 0;
        endpointArray[0].anchor.y = 0; // calculated by rem / height
    }
    function calculateEndpointButton(endpointArray) {
        if (endpointArray.length == 0) return;
        endpointArray[0].anchor.x = 1; //Right
        endpointArray[0].anchor.y = 0.5; //Middle
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
        let buttons_container = get(wind.id, '.buttons_container');
        let button_panel = $(`.advance_settings .${wind.id} .button_panel`);

        command_input.val('');
        input_text.val('');
        variable_name.val('');
        button_panel.find('.buttons_container').html(newAdvanceRowHTML).addClass('advance');
        console.log($(`.advance_settings .buttons_container .button_add`));
        $(`.advance_settings .buttons_container .button_add`).click(addButton);

        $('.advance').removeClass(`${wind.id}`);
        $('.advance_settings').removeClass('active_sliding_settings');
    }


    // INIT
    (function() {
        $(".button_add_window").click(function() {
            create_wind('message_wind');
        });
        $(".button_add_window_url").click(function() {
            create_wind('url_wind');
        });
        $('.button_add_window_input').click(function() {
            create_wind('input_wind');
        });


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
            maxConnections: -1,
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