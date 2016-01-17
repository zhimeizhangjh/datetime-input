function DateTimeInput() {
    var formation = 'yyyy-mm-dd';

    var keyCodes = {
        left: 37,
        right: 39,
        delete: 8,
        tab: 9,
        enter: 13,
        number: {
            max: 57,
            min: 48
        }
    };

    this.set = function (ele) {
        var type = toString.call(ele);

        if(type == '[object Array]' || type == '[object HTMLCollection]'){
            Array.prototype.forEach.call(ele, function(item){
                var dateTimeInputSetter = new DateTimeInputSetter(item);
                dateTimeInputSetter.init();
            });
        }
        else if(type == '[object HTMLInputElement]'){
            var dateTimeInputSetter = new DateTimeInputSetter(ele);
            dateTimeInputSetter.init();
        }
        else{
            throw new Error('Parameter "ele" must be HTMLInputElement or HTMLCollection!');
        }

    };

    function DateTimeInputSetter(input) {
        var Utility = {
            getCursortPosition: function (ctrl) {
                //获取光标位置函数
                var CaretPos = 0;
                // IE Support
                if (document.selection) {
                    ctrl.focus();
                    var Sel = document.selection.createRange();
                    Sel.moveStart('character', -ctrl.value.length);
                    CaretPos = Sel.text.length;
                }
                // Firefox support
                else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
                    CaretPos = ctrl.selectionStart;
                }
                return (CaretPos);
            },
            setCaretPosition: function (ctrl, pos) {
                //设置光标位置函数
                if (ctrl.setSelectionRange) {
                    ctrl.focus();
                    ctrl.setSelectionRange(pos, pos);
                } else if (ctrl.createTextRange) {
                    var range = ctrl.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }
            }
        };


        this.init = function () {
            input.value = formation;
            bindEvents();
        };

        function bindEvents() {
            input.onkeydown = function (e) {
                var keyCode = e.keyCode;
                if (keyCode == keyCodes.tab || keyCode == keyCodes.enter) {
                    return true;
                }
                if (isKeyAcceptable(keyCode)) {
                    handleKeyCode(keyCode);
                }
                e.preventDefault();
                e.returnValue = false;
                return false;
            };

            input.onclick = function (e) {
                var curPos = getCursortPosition();
                var curIndex = getNextInsertIndex();

                if (curPos > curIndex) {
                    setCaretPosition(curIndex);
                }
            }
        }

        function handleKeyCode(keyCode) {
            var curPos = getCursortPosition();
            var curIndex = getNextInsertIndex();
            if (keyCode >= keyCodes.number.min && keyCode <= keyCodes.number.max) {
                if (curIndex >= formation.length && curPos >= curIndex) {
                    return;
                }
                insertLetter(keyCode);
            }
            else if (keyCode == keyCodes.delete) {
                deleteLetter();
            }
            else if (keyCode == keyCodes.left) {
                setCaretPosition(curPos - 1);
            }
            else if (keyCode == keyCodes.right) {
                var curIndex = getNextInsertIndex();
                if (curPos < curIndex) {
                    setCaretPosition(curPos + 1);
                }
            }
        }

        function deleteLetter() {
            var curPos = getCursortPosition();
            var curIndex = getNextInsertIndex();
            var prevVal = input.value;
            var newVal;
            if(curPos == 0){
                return;
            }
            if (curPos == curIndex) {
                curIndex = minusNextInsertIndexByOne();
                newVal = prevVal.substr(0, curIndex) + formation.substr(curIndex, 1) + prevVal.substr(curIndex + 1);
                input.value = newVal;
                setCaretPosition(curIndex);
            }
            else {
                newVal = prevVal.substr(0, curPos - 1) + formation.substr(curPos - 1, 1) + prevVal.substr(curPos);
                input.value = newVal;
                setCaretPosition(curPos - 1);
            }
        }

        function getNextInsertIndex() {
            return input.data ? (input.data.currentIndex || 0) : 0;
        }

        function setNextInsertIndex(index) {
            if (!input.data) {
                input.data = {
                    currentIndex: 0
                };
            }
            input.data.currentIndex = index;
        }

        function addNextInsertIndexByOne() {
            var curIndex = getNextInsertIndex();
            var newIndex = ++curIndex;
            setNextInsertIndex(newIndex);
            return newIndex;
        }

        function minusNextInsertIndexByOne() {
            var curIndex = getNextInsertIndex();
            var newIndex = --curIndex;
            newIndex = newIndex >= 0 ? newIndex : 0;
            setNextInsertIndex(newIndex);
            return newIndex;
        }

        function isKeyAcceptable(keyCode) {
            var isAcceptable = false;
            if (keyCode == keyCodes.left
                || keyCode == keyCodes.right
                || keyCode == keyCodes.delete
                || (keyCode >= keyCodes.number.min && keyCode <= keyCodes.number.max)) {
                isAcceptable = true;
            }
            return isAcceptable;
        }

        function insertLetter(keyCode) {
            var prevVal = input.value;
            var curPos = getCursortPosition();
            var curIndex = getNextInsertIndex();
            var letterToInsert = keyCode - 48;
            var newVal;
            var newCursorPos;
            if (curPos == 4 || curPos == 7) {
                curPos += 1;
            }
            if (curIndex <= curPos) {
                curIndex = addNextInsertIndexByOne();
                newVal = (prevVal.substr(0, curIndex - 1)) + letterToInsert + prevVal.substr(curIndex);
                input.value = newVal;
                if (curIndex == 4 || curIndex == 7) {
                    curIndex = addNextInsertIndexByOne();
                }
                newCursorPos = curIndex;
                setCaretPosition(newCursorPos);
            }
            else {
                newVal = (prevVal.substr(0, curPos)) + letterToInsert + prevVal.substr(curPos + 1);
                input.value = newVal;
                newCursorPos = curPos + 1;
                if (curIndex == 4 || curIndex == 7) {
                    newCursorPos = curPos + 1;
                }
                setCaretPosition(newCursorPos);
            }
        }

        function getCursortPosition() {
            return Utility.getCursortPosition(input);
        }


        function setCaretPosition(pos) {
            return Utility.setCaretPosition(input, pos);
        }
    }


}