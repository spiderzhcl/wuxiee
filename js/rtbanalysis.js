function FormateGroupData(data, type, is_stack) {
    //data的格式如上的Result2，type为要渲染的图表类型：可以为line，bar，is_stack表示为是否是堆积图，这种格式的数据多用于展示多条折线图、分组的柱图
    var chart_type = 'line';
    if (type)
        chart_type = type || 'line';
    var xAxis = [];
    var group = [];
    var series = [];
    for (var idx in data[0]) {
        if (idx.substring(0, 5) === 'group') {
            group.push(idx.substring(5, idx.length));
        }
    }
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < xAxis.length && xAxis[j] !== data[i].xtitle; j++)
            ;
        if (j === xAxis.length)
            xAxis.push(data[i].xtitle);
//                for (var k = 0; k < group.length && group[k] !== data[i].grouptitle; k++)
//                    ;
//                if (k === group.length)
//                    group.push(data[i].grouptitle);
    }


    for (var i = 0; i < group.length; i++) {
        var temp = [];
        for (var k = 0; k < xAxis.length; k++) {
            for (var j = 0; j < data.length; j++) {
                if (xAxis[k] === data[j].xtitle) {
                    for (var idx in data[j]) {
                        if (idx === 'group' + group[i]) {
                            if (type === "map") {
                                temp.push({name: data[j].xtitle, value: data[j][idx]});
                            } else {
                                temp.push(data[j][idx]);
                            }

                        }
                    }
                }
            }
        }
        switch (type) {
            case 'bar':
//                        var series_temp = {name: group[i], data: temp, type: chart_type, markPoint: {data: [{type: 'max', name: '最大值'}, {type: 'min', name: '最小值'}]}};
                var series_temp = {name: group[i], data: temp, type: chart_type};
                if (is_stack)
                    series_temp = $.extend({}, {stack: 'stack'}, series_temp);
                break;
            case 'xbar':
//                        var series_temp = {name: group[i], data: temp, type: chart_type, markPoint: {data: [{type: 'max', name: '最大值'}, {type: 'min', name: '最小值'}]}};
                var series_temp = {name: group[i], data: temp, type: chart_type};
                if (is_stack)
                    series_temp = $.extend({}, {stack: 'stack'}, series_temp);
                break;
            case 'map':
                var series_temp = {
                    name: group[i], type: chart_type, mapType: 'china', selectedMode: 'single',
                    itemStyle: {
                        normal: {label: {show: true}},
                        emphasis: {label: {show: true}}
                    },
                    data: temp
                };
                break;
            case 'line':
//                        var series_temp = {name: group[i], data: temp, type: chart_type, markPoint: {data: [{type: 'max', name: '最大值'}, {type: 'min', name: '最小值'}]}};
                var series_temp = {name: group[i], data: temp, type: chart_type};
                if (is_stack)
                    series_temp = $.extend({}, {stack: 'stack'}, series_temp);
                break;
            default:
//                        var series_temp = {name: group[i], data: temp, type: chart_type , markPoint: {data: [{type: 'max', name: '最大值'}, {type: 'min', name: '最小值'}]}};
                var series_temp = {name: group[i], data: temp, type: chart_type};
        }
        series.push(series_temp);
    }
    return {category: group, xAxis: xAxis, series: series};
}

function FormateNOGroupData(data) {
    //data的格式如上的Result1，这种格式的数据，多用于饼图、单一的柱形图的数据源
    var categories = [];
    var datas = [];
    for (var i = 0; i < data.length; i++) {
        categories.push(data[i].xtitle || "");
        datas.push({name: data[i].xtitle, value: data[i].datavalue || 0});
    }
    return {category: categories, data: datas};
}

function getDataByKey(data, divid) {
    var shobby = "<ul>";
    var hid = '';
    var ii = 0;
    for (var item in data) {
        if (data[item] !== '0') {
            var str = new Array();
            str = data[item].split("_");
            shobby = shobby + "<li><span onclick='campaign(" + str[1] + " )' class='btn'>" + str[1] + "</span></li>";
            ii++;
        }
    }
    shobby = shobby + "</ul>";
    $("#" + divid).html(shobby);
}

function getCampaignDetail(data, divid) {
    var shobby = "<ul>";
    for (var item in data) {
        if (data[item] !== '0') {
            shobby = shobby + "<li><span onclick='campaigndetail(" + item + " )' class='btn'>" + item + "</span>" + data[item] + "</li>";
        }
    }
    shobby = shobby + "</ul>";
    $("#" + divid).html(shobby);
}

function campaign(campaign) {
    var channel = $("#channel").val();
    var day = $("#daydata").val();
    $("#campaign").val(campaign);
    $.ajax({
        type: "GET",
        url: "http://localhost/dmap/rtbcampaign",
        callback: "receive",
        dataType: "jsonp",
        jsonp: "callback",
        data: {'ch': channel, 'day': day, 'camp': campaign},
        async: false,
        success: function (resultdata) {
            console.log(getCampaignDetail(resultdata, 'bscost_div2'));
        },
        error: function (e) {
        }
    });
}

function getDataByKey2(data, getkey) {
    for (var keys in data) {
        for (var key in data[keys]) {
            if (key === getkey) {
                return data[keys][key];
            }
        }
    }
}