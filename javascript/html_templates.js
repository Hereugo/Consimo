const defaultBlockHTML = template`
    <div class="window" id="${0}">
        <div class="${0} message_panel">
            <div class="${0} title_container">
                <div class="${0} title name_bot"> Обработка сообщения </div>

                <div class="${0} wind_setting_button" onclick="show_settings('${0}')">
                    <i class="far fa-ellipsis-h noHover"></i>

                    <div class="${0} wind_settings">
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onEdit')">
                            <i class="${0} fas fa-edit noHover"></i> Быстрое редактирование
                        </div>
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onDelete')">
                            <i class="${0} fas fa-trash-alt noHover"></i> Удалить
                        </div>
                        <hr>
                        <div class="${0} wind_settings_item" onclick="showAdvanceSettings('${0}')">
                            <i class="${0} fas fa-cogs noHover"></i> Дополнительные параметры
                        </div>
                        <div class="${0} wind_settings_item">
                            <i class="${0} fas fa-times noHover"></i> Закрыть
                        </div>
                    </div>
                </div>
            </div>

            <div class="${0} command_panel">
                <div class="${0} edit title"> Панель команды </div>

                <input type="text" class="${0} command_input readonly" placeholder="/start" readonly/>
            </div>

            <div class="${0} message_text_panel">
                <div class="${0} edit title"> Панель сообщения </div>

                <textarea class="${0} input_text readonly" placeholder="Это сообщение-заполнитель" readonly></textarea>
            </div>
        </div>

        <div class="${0} button_panel">
            <div class="${0} edit title"> Панель кнопок </div>

            <div class="${0} buttons_container">
                <div class="${0} row">
                    <div class="${0} edit button button_add button_add_last">
                        <div class="text"><i class="fas fa-plus-square"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" style="margin-top: 1em; width: 100%;">
            <div class="${0} edit button row_button save_button" onclick="runFunctionInWindow(this, 'onSave', 'wind')">
                <div class="text">Сохранить</div>
            </div>
            <div class="${0} edit button row_button discard_button" onclick="runFunctionInWindow(this, 'onDiscard', 'wind')">
                <div class="text">Отбросить</div>
            </div>
        </div>
    </div>
`;

const defaultURLblockHTML = template`
    <div class="window" id=${0}>
        <div class="${0} message_panel">
            <div class="${0} title_container">
                <div class="${0} title name_bot"> Обработчик ссылок </div>

                <div class="${0} wind_setting_button" onclick="show_settings('${0}')">
                    <i class="far fa-ellipsis-h noHover"></i>

                    <div class="${0} wind_settings">
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onEdit')">
                            <i class="${0} fas fa-edit noHover"></i> Быстрое редактирование
                        </div>
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onDelete')">
                            <i class="${0} fas fa-trash-alt noHover"></i> Удалить
                        </div>
                        <hr>
                        <div class="wind_settings_item">
                            <i class="${0} fas fa-times noHover"></i> Закрыть
                        </div>
                    </div>
                </div>
            </div>

            <div class="${0} command_panel">
                <div class="${0} edit title"> Панель URL </div>

                <input type="text" class="${0} url_input readonly" placeholder="https://example.com" readonly/>
            </div>
        </div>

        <div class="row" style="margin-top: 1rem; width: 100%;">
            <div class="${0} edit button row_button save_button" onclick="runFunctionInWindow(this, 'onSave', 'wind')">
                <div class="text">Сохранить</div>
            </div>
            <div class="${0} edit button row_button discard_button" onclick="runFunctionInWindow(this, 'onDiscard', 'wind')">
                <div class="text">Отбросить</div>
            </div>
        </div>
    </div>
`;

const defaultInputblockHTML = template`
    <div class="window" id="${0}">
        <div class="${0} message_panel">
            <div class="${0} title_container">
                <div class="${0} title name_bot"> Обработчик ввода </div>

                <div class="${0} wind_setting_button" onclick="show_settings('${0}')">
                    <i class="far fa-ellipsis-h noHover"></i>

                    <div class="${0} wind_settings">
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onEdit')">
                            <i class="${0} fas fa-edit noHover"></i> Быстрое редактирование
                        </div>
                        <div class="${0} wind_settings_item" onclick="runFunctionInWindow(this, 'onDelete')">
                            <i class="${0} fas fa-trash-alt noHover"></i> Удалить
                        </div>
                        <hr>
                        <div class="${0} wind_settings_item" onclick="showAdvanceSettings('${0}')">
                            <i class="${0} fas fa-cogs noHover"></i> Дополнительные параметры
                        </div>
                        <div class="wind_settings_item">
                            <i class="${0} fas fa-times noHover"></i> Закрыть
                        </div>
                    </div>
                </div>
            </div>

            <div class="${0} command_panel">
                <div class="${0} edit title"> Панель команды </div>

                <input type="text" class="${0} command_input readonly" placeholder="/start" readonly/>
            </div>

            <div class="${0} message_text_panel">
                <div class="${0} edit title"> Панель сообщения </div>

                <textarea class="${0} input_text readonly" placeholder="Это сообщение-заполнитель" readonly></textarea>
            </div>

            <div class="${0} output_panel">
                <div class="title"> Ответ записан в: </div>
                <input type="text" class="${0} output_var_name readonly" placeholder="Имя переменной" readonly/>
            </div>
        </div>

        <div class="row" style="margin-top: 1rem; width: 100%;">
            <div class="${0} edit button row_button save_button" onclick="runFunctionInWindow(this, 'onSave', 'wind')">
                <div class="text">Сохранить</div>
            </div>
            <div class="${0} edit button row_button discard_button" onclick="runFunctionInWindow(this, 'onDiscard', 'wind')">
                <div class="text">Отбросить</div>
            </div>
        </div>
    </div>
`;

const newButtonHTML = template`
    <div id="${1}" class="${0} in_progress button row_button wind_button">
        <input type="text" class="${0} readonly overflow_text input_button" placeholder="Кнопка"/>
        <div class="${0} button_delete" onclick="runFunctionInWindow(this, 'onDeleteButton', '${1}')">
            <i class="${0} fas fa-trash-alt"></i>
        </div>
    </div> 
`;

const newRowHTML = template`
    <div class="${0} ${1} row">
        <div class="${0} ${1} ${2} button button_add button_add_last">
            <div class="text"><i class="fas fa-plus-square"></i></div>
        </div>
    </div>
`;

const newAdvanceRowHTML = `
    <div class="advance row">
        <div class="advance button button_add button_add_last">
            <div class="text"><i class="fas fa-plus-square"></i></div>
        </div>
    </div>
`;