function DateTimeInput(option){
    var _opt = _.extend({
    }, option);

    this.initializeInput = function(ele){
        ele.value = 'yyyy/mm/dd hh:mm:ss'
    }

}