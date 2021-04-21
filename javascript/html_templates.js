const defaultBlockHTML = template`
    <div class="window" id="${0}">
        <div class="${0} message_panel">
            <div class="${0} title_container">
                <div class="${0} title name_bot"> Message Handler </div>

                <ul class="${0} title_settings">
                    <li class="item_setting edit_window"> <i class="${0} fas fa-edit" onclick="runFunctionInWindow('onEdit', '${0}')"></i> </li>
                    <li class="item_setting delete_window"> <i class="${0} fas fa-trash-alt" onclick="runFunctionInWindow('onDelete', '${0}')"></i> </li>
                </ul>
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
            <div class="${0} edit button row_button save_button" onclick="runFunctionInWindow('onSave', '${0}')">
                <div class="text">Save</div>
            </div>
            <div class="${0} edit button row_button discard_button" onclick="runFunctionInWindow('onDiscard', '${0}')">
                <div class="text">Discard</div>
            </div>
        </div>
    </div>
`;

const newButtonHTML = template`
    <div id="${1}" class="${0} in_progress button row_button">
        <input type="text" class="${0} readonly overflow_text" placeholder="Button"/>
        <div class="${0} button_delete" onclick="runFunctionInWindow('onDeleteButton', '${0}', '${1}')">
            <i class="${0} fas fa-trash-alt"></i>
        </div>
    </div> 
`;
const newButtonAddHTML = template`
    <div class="${0} edit button button_add button_add_last">
        <div class="text">Add</div>
    </div>
`;


const newRowHTML = template`
    <div class="${0} row">
        <div class="${0} edit button button_add button_add_last">
            <div class="text">Add</div>
        </div>
    </div>
`;


const defaultURLblockHTML = template`
    <div class="window" id=${0}>
        <div class="${0} message_panel">
            <div class="${0} title_container">
                <div class="${0} title name_bot"> URL Handler </div>

                <ul class="${0} title_settings">
                    <li class="item_setting edit_window"> <i class="${0} fas fa-edit" onclick="runFunctionInWindow('onEdit', '${0}')"></i> </li>
                    <li class="item_setting delete_window"> <i class="${0} fas fa-trash-alt" onclick="runFunctionInWindow('onDelete', '${0}')"></i> </li>
                </ul>
            </div>

            <div class="${0} command_panel">
                <div class="${0} edit title"> URL Panel </div>

                <input type="text" class="${0} url_input readonly" placeholder="https://example.com" readonly/>
            </div>
        </div>

        <div class="row" style="margin-top: 1rem; width: 100%;">
            <div class="${0} edit button row_button save_button" onclick="runFunctionInWindow('onSave', '${0}')">
                <div class="text">Save</div>
            </div>
            <div class="${0} edit button row_button discard_button" onclick="runFunctionInWindow('onDiscard', '${0}')">
                <div class="text">Discard</div>
            </div>
        </div>
    </div>
`