const defaultBlockHTML = template`
    <div class="window" id="${0}">
        <div class="${0} message_panel">
            <div class="${0} title_container">
                <div class="${0} title name_bot"> Message Handler </div>

                <div class="${0} wind_setting_button" onclick="show_settings('${0}')">
                    <i class="far fa-ellipsis-h noHover"></i>

                    <div class="${0} wind_settings">
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onEdit')">
                            <i class="${0} fas fa-edit noHover"></i> Quick edit
                        </div>
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onDelete')">
                            <i class="${0} fas fa-trash-alt noHover"></i> Delete
                        </div>
                        <hr>
                        <div class="${0} wind_settings_item" onclick="showAdvanceSettings('${0}')">
                            <i class="${0} fas fa-cogs noHover"></i> Advance settings
                        </div>
                        <div class="${0} wind_settings_item">
                            <i class="${0} fas fa-times noHover"></i> Exit
                        </div>
                    </div>
                </div>
            </div>

            <div class="${0} command_panel">
                <div class="${0} edit title"> Command Panel </div>

                <input type="text" class="${0} command_input readonly" placeholder="/start" readonly/>
            </div>

            <div class="${0} message_text_panel">
                <div class="${0} edit title"> Message Panel </div>

                <textarea class="${0} input_text readonly" placeholder="This is a placeholder message" readonly></textarea>
            </div>
        </div>

        <div class="${0} button_panel">
            <div class="${0} edit title"> Button Panel </div>

            <div class="${0} buttons_container">
                <div class="${0} row">
                    <div class="${0} edit button button_add button_add_last">
                        <div class="text">Add</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 1em; width: 100%;">
            <div class="${0} edit button row_button save_button" onclick="runFunctionInWindow(this, 'onSave', 'wind')">
                <div class="text">Save</div>
            </div>
            <div class="${0} edit button row_button discard_button" onclick="runFunctionInWindow(this, 'onDiscard')">
                <div class="text">Discard</div>
            </div>
        </div>
    </div>
`;

const defaultURLblockHTML = template`
    <div class="window" id=${0}>
        <div class="${0} message_panel">
            <div class="${0} title_container">
                <div class="${0} title name_bot"> URL Handler </div>

                <div class="${0} wind_setting_button" onclick="show_settings('${0}')">
                    <i class="far fa-ellipsis-h noHover"></i>

                    <div class="${0} wind_settings">
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onEdit')">
                            <i class="${0} fas fa-edit noHover"></i> Quick edit
                        </div>
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onDelete')">
                            <i class="${0} fas fa-trash-alt noHover"></i> Delete
                        </div>
                        <hr>
                        <div class="wind_settings_item">
                            <i class="${0} fas fa-times noHover"></i> Exit
                        </div>
                    </div>
                </div>
            </div>

            <div class="${0} command_panel">
                <div class="${0} edit title"> URL Panel </div>

                <input type="text" class="${0} url_input readonly" placeholder="https://example.com" readonly/>
            </div>
        </div>

        <div class="row" style="margin-top: 1rem; width: 100%;">
            <div class="${0} edit button row_button save_button" onclick="runFunctionInWindow(this, 'onSave', 'wind')">
                <div class="text">Save</div>
            </div>
            <div class="${0} edit button row_button discard_button" onclick="runFunctionInWindow(this, 'onDiscard')">
                <div class="text">Discard</div>
            </div>
        </div>
    </div>
`;

const defaultInputblockHTML = template`
    <div class="window" id="${0}">
        <div class="${0} message_panel">
            <div class="${0} title_container">
                <div class="${0} title name_bot"> Input Handler </div>

                <div class="${0} wind_setting_button" onclick="show_settings('${0}')">
                    <i class="far fa-ellipsis-h noHover"></i>

                    <div class="${0} wind_settings">
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onEdit')">
                            <i class="${0} fas fa-edit noHover"></i> Quick edit
                        </div>
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onDelete')">
                            <i class="${0} fas fa-trash-alt noHover"></i> Delete
                        </div>
                        <hr>
                        <div class="${0} wind_settings_item" onclick="showAdvanceSettings('${0}')">
                            <i class="${0} fas fa-cogs noHover"></i> Advance settings
                        </div>
                        <div class="wind_settings_item">
                            <i class="${0} fas fa-times noHover"></i> Exit
                        </div>
                    </div>
                </div>
            </div>

            <div class="${0} command_panel">
                <div class="${0} edit title"> Command Panel </div>

                <input type="text" class="${0} command_input readonly" placeholder="/start" readonly/>
            </div>

            <div class="${0} message_text_panel">
                <div class="${0} edit title"> Message Panel </div>

                <textarea class="${0} input_text readonly" placeholder="This is a placeholder message" readonly></textarea>
            </div>

            <div class="${0} output_panel">
                <div class="title"> Output stored in: </div>
                <input type="text" class="${0} output_var_name readonly" placeholder="Variable name" readonly/>
            </div>
        </div>

        <div class="row" style="margin-top: 1rem; width: 100%;">
            <div class="${0} edit button row_button save_button" onclick="runFunctionInWindow(this, 'onSave', 'wind')">
                <div class="text">Save</div>
            </div>
            <div class="${0} edit button row_button discard_button" onclick="runFunctionInWindow(this, 'onDiscard')">
                <div class="text">Discard</div>
            </div>
        </div>
    </div>
`;

const newButtonHTML = template`
    <div id="${1}" class="${0} in_progress button row_button wind_button">
        <input type="text" class="${0} readonly overflow_text input_button" placeholder="Button"/>
        <div class="${0} button_delete" onclick="runFunctionInWindow(this, 'onDeleteButton', '${1}')">
            <i class="${0} fas fa-trash-alt"></i>
        </div>
    </div> 
`;

const newRowHTML = template`
    <div class="${0} ${1} row">
        <div class="${0} ${1} ${2} button button_add button_add_last">
            <div class="text">Add</div>
        </div>
    </div>
`;

const newAdvanceRowHTML = `
    <div class="advance row">
        <div class="advance button button_add button_add_last">
            <div class="text">Add</div>
        </div>
    </div>
`;