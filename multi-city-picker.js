/**
 * Created by cbjiang on 16/7/5.
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals.
        factory(jQuery);
    }
})(function ($) {

    'use strict';

    if (typeof $.fn.citypicker === 'undefined') {
        throw new Error('The file "city-picker.js" must be included first!');
    }

    var NAMESPACE = 'multicitypicker';

    function MultiCityPicker(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, MultiCityPicker.DEFAULTS, $.isPlainObject(options) && options);
        this.init();
    }

    MultiCityPicker.prototype = {
        constructor: MultiCityPicker,

        init: function () {
            this.render();
            this.bind();
        },

        render: function () {
            this.$citypickerid=this.guid();
            this.$tableid=this.guid();
            this.$element.addClass('multi-city-picker-div');
            var citypickerrow='<div class="group-input" ><input id="'+this.$citypickerid+
                '" class="form-control" readonly type="text" value="" data-toggle="city-picker">'+
                '<input class="form-control" readonly type="text" value="" data-toggle="city-picker-detail" >'+
                '</div><div class="group-btn"><button type="button" class="btn btn-success multi-city-addbtn"><i class="fa fa-plus"></button></div>';
            this.$citypickerrow=$(citypickerrow).appendTo(this.$element);
            $('#'+this.$citypickerid).citypicker(this.options.citypicker);
            var table='<table id="'+this.$tableid+'" class="table table-striped table-hover table-bordered font-xs">' +
                '<thead><tr>'+
                '<th style="font-size:11px !important;">区域</th>'+
                '<th style="font-size:11px !important;">详细</th>'+
                '<th style="font-size:11px !important;">地址</th>'+
                '<th width="28px" style="font-size:11px !important;">操作</th>'+
                '</tr></thead></table>';
            $(table).insertAfter(this.$element);
            this.$table=$('#'+this.$tableid).DataTable({
                info:false,
                searching:false,
                paging: false,
                ordering:false,
                rowReorder: true,
                aoColumnDefs: [
                    {sDefaultContent: '',aTargets: [ '_all' ]}],
                aoColumns: [
                    { data:"ADDR",visible:false },
                    { data:"ADDRDETAIL",visible:false },
                    { data:"ADDRFULL" },
                    { data:"OP",className:"text-center" },
                ],
                language: { emptyTable: "未添加地址"}
            });
        },

        guid:function () {
            function S4() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        },

        bind:function(){
            var $this = this;

            this.$element.on('click','.multi-city-addbtn',function(){
                var addr=$('#'+$this.$citypickerid).data('citypicker').$element.val();
                var addrDetail=$('#'+$this.$citypickerid).data('citypicker').$detailElement.val();
                var addrFull=addr+(addr!=''&&addrDetail!=''?'/':'')+addrDetail;
                if(addrFull!=null && addrFull!=''){
                    var tableData=$this.$table.data();
                    if(tableData.length < $this.options.limitSize){
                        for(var i=0;i<tableData.length;i++){
                            if(tableData[i].ADDRFULL==addrFull){
                                toastUtil.error('添加失败','该地址已存在！');
                                return;
                            }
                        }
                        var data={};
                        data.ADDR=addr;
                        data.ADDRDETAIL=addrDetail;
                        data.ADDRFULL=addrFull;
                        data.OP='<a class="table-row-del"><i class="fa fa-times"></i></a>'
                        $this.$table.row.add(data).draw(false);
                        $('#'+$this.$citypickerid).data('citypicker').reset();
                    }else{
                        toastUtil.error('添加失败','添加的地址个数已达到上限（'+$this.options.limitSize+'个）！');
                        return;
                    }
                }
            });

            $('#'+this.$tableid).on('click','.table-row-del',function(){
                var rowIdx=$this.$table.cell($(this).parent()).index().row;
                $this.$table.row(rowIdx).remove().draw( false );
            });
        },

        reset: function () {
            $('#'+this.$citypickerid).data('citypicker').reset();
            this.$table.rows().remove().draw(false);
        },

        getValue:function(){
            var data=[];
            var tableData=this.$table.data();
            for(var i=0;i<tableData.length;i++){
                var obj={};
                obj.ADDR=tableData[i].ADDR;
                obj.ADDRDETAIL=tableData[i].ADDRDETAIL;
                data.push(obj);
            }
            return data;
        }

    };

    MultiCityPicker.DEFAULTS = {
        citypicker:{
            simple: false,
            responsive: false,
            placeholder: '请选择省/市/区',
            level: 'detail',
            province: '',
            city: '',
            district: ''
        },
        limitSize:999,
    };

    MultiCityPicker.setDefaults = function (options) {
        $.extend(MultiCityPicker.DEFAULTS, options);
    };

    // Save the other multicitypicker
    MultiCityPicker.other = $.fn.MultiCityPicker;

    // Register as jQuery plugin
    $.fn.multicitypicker = function (option) {
        var args = [].slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this);
            var data = $this.data(NAMESPACE);
            var options;
            var fn;

            if (!data) {
                if (/destroy/.test(option)) {
                    return;
                }

                options = $.extend({}, $this.data(), $.isPlainObject(option) && option);
                $this.data(NAMESPACE, (data = new MultiCityPicker(this, options)));
            }

            if (typeof option === 'string' && $.isFunction(fn = data[option])) {
                fn.apply(data, args);
            }
        });
    };

    $.fn.multicitypicker.Constructor = MultiCityPicker;
    $.fn.multicitypicker.setDefaults = MultiCityPicker.setDefaults;

    // No conflict
    $.fn.multicitypicker.noConflict = function () {
        $.fn.multicitypicker = MultiCityPicker.other;
        return this;
    };

    $(function () {
        $('[data-toggle="multi-city-picker"]').multicitypicker();
    });
});