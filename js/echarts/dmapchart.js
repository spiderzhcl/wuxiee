var ECharts = {
    ChartConfig: function(container, option) {

        var chart_path = "../../js/echarts/echarts"; //配置图表请求路径 
        var map_path = "../../js/echarts/echarts-map"; //配置地图的请求路径 

        require.config({//引入常用的图表类型的配置
            paths: {
                echarts: chart_path,
                'echarts/chart/bar': chart_path,
                'echarts/chart/pie': chart_path,
                'echarts/chart/line': chart_path,
                'echarts/chart/k': chart_path,
                'echarts/chart/scatter': chart_path,
                'echarts/chart/radar': chart_path,
                'echarts/chart/chord': chart_path,
                'echarts/chart/force': chart_path,
                'echarts/chart/map': map_path
            }
        });
        this.option = {chart: {}, option: option, container: container};
        return this.option;
    },
    ChartDataFormate: {
        FormateNOGroupData: function(data) {
            //data的格式如上的Result1，这种格式的数据，多用于饼图、单一的柱形图的数据源
            var categories = [];
            var datas = [];
            for (var i = 0; i < data.length; i++) {
                categories.push(data[i].xtitle || "");
                datas.push({name: data[i].xtitle, value: data[i].datavalue || 0});
            }
            return {category: categories, data: datas};
        },
        FormateGroupData: function(data, type, is_stack) {
            //data的格式如上的Result2，type为要渲染的图表类型：可以为line，bar，is_stack表示为是否是堆积图，这种格式的数据多用于展示多条折线图、分组的柱图
            var chart_type = 'line';
            if (type)
                chart_type = type || 'line';
            var xAxis = [];
            var group = [];
            var series = [];
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < xAxis.length && xAxis[j] !== data[i].xtitle; j++)
                    ;
                if (j === xAxis.length)
                    xAxis.push(data[i].xtitle);
                for (var k = 0; k < group.length && group[k] !== data[i].grouptitle; k++)
                    ;
                if (k === group.length)
                    group.push(data[i].grouptitle);
            }


            for (var i = 0; i < group.length; i++) {
                var temp = [];
                for (var k = 0; k < xAxis.length; k++) {
                    for (var j = 0; j < data.length; j++) {
                        if (group[i] === data[j].grouptitle && xAxis[k] === data[j].xtitle) {
                            if (type === "map") {
                                temp.push({name: data[j].xtitle, value: data[i].datavalue});
                            } else {
                                temp.push(data[j].datavalue);
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
        },
        FormateMutilGroupData: function(data, type, is_stack) {
            //data的格式如上的Result2，type为要渲染的图表类型：可以为line，bar，is_stack表示为是否是堆积图，这种格式的数据多用于展示多条折线图、分组的柱图
            var chart_type = 'line';
            if (type)
                chart_type = type || 'line';
            var xAxis = [];
            var group = [];
            var series = [];
            for (var idx in data[0]) {
                if (idx.substring(0, 5) === 'group') {
                    group.push(idx.substring(5, idx.lenght));
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
    }
    ,
    ChartOptionTemplates: {
        CommonOption: {
            //通用的图表基本配置 
            tooltip: {
                trigger: 'axis'//tooltip触发方式:axis以X轴线触发,item以每一个数据项触发 
            },
            toolbox: {
                show: true, //是否显示工具栏 
                feature: {
                    mark: true,
                    dataView: {readOnly: false}, //数据预览 
                    restore: true, //复原 
                    saveAsImage: true //是否保存图片 
                }
            }
        },
        CommonLineOption: {//通用的折线图表的基本配置 
            tooltip: {
                trigger: 'axis'
            },
            calculable: true,
            toolbox: {
                show: true,
                feature: {
                    dataView: {readOnly: false}, //数据预览
                    restore: true, //复原
                    saveAsImage: true, //是否保存图片
                    magicType: ['line', 'bar']//支持柱形图和折线图的切换 
                }
            }
        },
        Pie: function(data, name, showtitle) {
            //data:数据格式：{name：xxx,value:xxx}...
            var pie_datas = ECharts.ChartDataFormate.FormateNOGroupData(data);
            var option = {
                title: {
                    text: showtitle
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}/%)',
                    show: true
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: []//pie_datas.category
                },
                calculable: true,
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: true},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                series: [
                    {
                        name: name || "",
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '50%'],
                        data: pie_datas.data
                    }
                ]
            };
            return $.extend({}, ECharts.ChartOptionTemplates.CommonOption, option);
        },
        Lines: function(data, name, showtitle, is_stack, mutil) {
            //data:数据格式：{name：xxx,group:xxx,value:xxx}... 
            var stackline_datas;
            if (mutil === 'mutilgroup') {
                stackline_datas = ECharts.ChartDataFormate.FormateMutilGroupData(data, 'line', is_stack);
            } else {
                stackline_datas = ECharts.ChartDataFormate.FormateGroupData(data, 'line', is_stack);
            }
//            console.log(stackline_datas);
            var option = {
                animation: false,
                title: {
                    text: showtitle
                },
//                dataRange: {
//                    min: 0,
//                    max: 100,
//                    y: 'center',
//                    text: ['高', '低'], // 文本，默认为数值文本
//                    color: ['lightgreen', 'yellow'],
//                    calculable: true
//                },
                dataZoom: {
                    show: true,
                    realtime: true,
                    start: 50,
                    end: 100
                },
                legend: {data: stackline_datas.category
                },
                calculable: true,
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    feature: {
                        mark: {show: true},
                        dataZoom: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                xAxis: [{
                        type: 'category', //X轴均为category，Y轴均为value 
                        data: stackline_datas.xAxis,
                        boundaryGap: false//数值轴两端的空白策略 
                    }],
                yAxis: [{
                        name: name || '',
                        type: 'value', axisLabel: {
                            formatter: '{value}'
                        },
                        splitArea: {show: true}
                    }],
                series: stackline_datas.series
            };
            return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
        },
        Bars: function(data, name, showtitle, is_stack) {
            //data:数据格式：{name：xxx,group:xxx,value:xxx}...
            var bars_dates = ECharts.ChartDataFormate.FormateGroupData(data, 'bar', is_stack);
            var option = {
                animation: false,
                title: {
                    text: showtitle
                },
                legend: {
                    data: bars_dates.category
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataZoom: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                xAxis: [{
                        type: 'category',
                        data: bars_dates.xAxis,
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            rotate: 0,
                            margion: 8
                        }
                    }],
                yAxis: [{
                        type: 'value',
                        name: name || '',
                        splitArea: {show: true}
                    }],
                series: bars_dates.series
            };
            return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
        },
        XBars: function(data, name, showtitle, is_stack) {
            //data:数据格式：{name：xxx,group:xxx,value:xxx}...
            var bars_dates = ECharts.ChartDataFormate.FormateGroupData(data, 'bar', is_stack);
            var option = {
                animation: false,
                title: {
                    text: showtitle
                },
                legend: {
                    data: bars_dates.category
                },
                dataZoom: {
//                    orient: 'vertical',
                    show: true,
                    realtime: true,
                    start: 80,
                    end: 100
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataZoom: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                yAxis: [{
                        type: 'category',
                        data: bars_dates.xAxis,
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            rotate: 0,
                            margion: 8
                        }
                    }],
                xAxis: [{
                        type: 'value',
                        position: 'top',
                        name: name || '',
                        splitArea: {show: true}
                    }],
                series: bars_dates.series
            };
            return $.extend({}, ECharts.ChartOptionTemplates.CommonLineOption, option);
        }
    }
    ,
    Charts: {
        RenderChart: function(option) {
            require([
                'echarts',
                'echarts/chart/line',
                'echarts/chart/bar',
                'echarts/chart/pie',
                'echarts/chart/k',
                'echarts/chart/scatter',
                'echarts/chart/radar',
                'echarts/chart/chord',
                'echarts/chart/force',
                'echarts/chart/map'
            ],
                    function(ec) {
                        echarts = ec;
                        if (option.chart && option.chart.dispose)
                            option.chart.dispose();
                        option.chart = echarts.init(option.container);
                        window.onresize = option.chart.resize;
//                        console.log(option);
                        option.chart.clear;
                        option.chart.setOption(option.option, true);
                    });
        }
    },
    RenderMap: function(option) {
    }
};
  