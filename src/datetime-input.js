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
        ele.forEach(function (item) {
            init(item);
        });
    };

    function init(input) {
        input.value = formation;
        bindEvents(input);
    }

    function bindEvents(input) {
        input.onkeydown = function (e) {
            var keyCode = e.keyCode;
            if(keyCode == keyCodes.tab || keyCode == keyCodes.enter){
                return true;
            }
            if (isKeyAcceptable(keyCode)) {
                handleKeyCode(input, keyCode);
            }
            e.preventDefault();
            e.returnValue = false;
            return false;
        };

        input.onclick = function (e) {
            var curPos = getCursortPosition(input);
            var curIndex = getNextInsertIndex(input);
            if (curPos > curIndex) {
                setCaretPosition(input, curIndex);
            }
        }
    }

    function handleKeyCode(input, keyCode) {
        var curPos = getCursortPosition(input);
        var curIndex = getNextInsertIndex(input);
        if (keyCode >= keyCodes.number.min && keyCode <= keyCodes.number.max) {
            if (curIndex >= formation.length && curPos >= curIndex) {
                return;
            }
            insertLetter(input, keyCode);
        }
        else if (keyCode == keyCodes.delete) {
            deleteLetter(input);
        }
        else if (keyCode == keyCodes.left) {
            setCaretPosition(input, curPos - 1);
        }
        else if (keyCode == keyCodes.right) {
            var curIndex = getNextInsertIndex(input);
            if (curPos < curIndex) {
                setCaretPosition(input, curPos + 1);
            }
        }
    }

    function deleteLetter(input) {
        var curPos = getCursortPosition(input);
        var curIndex = getNextInsertIndex(input);
        var prevVal = input.value;
        var newVal;
        if(curPos == curIndex) {
            curIndex = minusNextInsertIndexByOne(input);
            newVal = prevVal.substr(0, curIndex) + formation.substr(curIndex, 1) + prevVal.substr(curIndex + 1);
            input.value = newVal;
            setCaretPosition(input, curIndex);
        }
        else{
            newVal = prevVal.substr(0, curPos - 1) + formation.substr(curPos - 1, 1) + prevVal.substr(curPos);
            input.value = newVal;
            setCaretPosition(input, curPos - 1);
        }
    }

    function getNextInsertIndex(input) {
        return input.data ? (input.data.currentIndex || 0) : 0;
    }

    function setNextInsertIndex(input, index) {
        if (!input.data) {
            input.data = {
                currentIndex: 0
            };
        }
        input.data.currentIndex = index;
    }

    function addNextInsertIndexByOne(input) {
        var curIndex = getNextInsertIndex(input);
        var newIndex = ++curIndex;
        setNextInsertIndex(input, newIndex);
        return newIndex;
    }

    function minusNextInsertIndexByOne(input) {
        var curIndex = getNextInsertIndex(input);
        var newIndex = --curIndex;
        newIndex = newIndex >= 0 ? newIndex : 0;
        setNextInsertIndex(input, newIndex);
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

    function insertLetter(input, keyCode) {
        var prevVal = input.value;
        var curPos = getCursortPosition(input);
        var curIndex = getNextInsertIndex(input);
        var letterToInsert = keyCode - 48;
        var newVal;
        var newCursorPos;
        if(curPos == 4 || curPos == 7){
            curPos += 1;
        }
        //console.log('keyCode:' + keyCode);
        //console.log('curPos:' + curPos);
        //console.log('curIndex:' + curIndex);


        if(curIndex <= curPos){
            curIndex = addNextInsertIndexByOne(input);
            newVal = (prevVal.substr(0, curIndex - 1)) + letterToInsert + prevVal.substr(curIndex);
            input.value = newVal;
            if (curIndex == 4 || curIndex == 7) {
                curIndex = addNextInsertIndexByOne(input);
            }
            newCursorPos = curIndex;
            setCaretPosition(input, newCursorPos);
        }
        else{
            newVal = (prevVal.substr(0, curPos)) + letterToInsert + prevVal.substr(curPos + 1);
            input.value = newVal;
            newCursorPos = curPos + 1;
            if(curIndex == 4 || curIndex == 7){
                newCursorPos = curPos + 1;
            }
            setCaretPosition(input, newCursorPos);
        }
    }

    function getCursortPosition(ctrl) {
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
    }


    function setCaretPosition(ctrl, pos) {
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
}