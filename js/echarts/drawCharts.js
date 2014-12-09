function DrawPie(data, id, showtitle) {
    var option = ECharts.ChartOptionTemplates.Pie(data, showtitle);
    var container = document.getElementById(id);
    opt = ECharts.ChartConfig(container, option);
    ECharts.Charts.RenderChart(opt);
}
function DrawBar(data, id, showtitle) {
    var option = ECharts.ChartOptionTemplates.Bars(data, showtitle);
    var container = document.getElementById(id);
    opt = ECharts.ChartConfig(container, option);
    ECharts.Charts.RenderChart(opt);
}
function DrawLines(data, id, showtitle) {
    var option = ECharts.ChartOptionTemplates.Lines(data, showtitle);
    var container = document.getElementById(id);
    opt = ECharts.ChartConfig(container, option);
    ECharts.Charts.RenderChart(opt);
}

function DrawLinesMutil(data, id, showtitle) {
    var option = ECharts.ChartOptionTemplates.Lines(data, showtitle,'','','mutilgroup');
    var container = document.getElementById(id);
    opt = ECharts.ChartConfig(container, option);
    ECharts.Charts.RenderChart(opt);
}

function DrawXBar(data, id, showtitle) {
    var option = ECharts.ChartOptionTemplates.XBars(data, showtitle);
    var container = document.getElementById(id);
    opt = ECharts.ChartConfig(container, option);
    ECharts.Charts.RenderChart(opt);
}