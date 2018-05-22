var idTmr;
function  getExplorer() {
    var explorer = window.navigator.userAgent ;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if(explorer.indexOf("Chrome") >= 0){
        return 'Chrome';
    }
    //Opera
    else if(explorer.indexOf("Opera") >= 0){
        return 'Opera';
    }
    //Safari
    else if(explorer.indexOf("Safari") >= 0){
        return 'Safari';
    }
}
function exportTableById(tableid) {//整个表格拷贝到EXCEL中
    if(getExplorer()=='ie'){
        var curTbl = document.getElementById(tableid);
        var oXL = new ActiveXObject("Excel.Application");
        //创建AX对象excel
        var oWB = oXL.Workbooks.Add();
        //获取workbook对象
        var xlsheet = oWB.Worksheets(1);
        //激活当前sheet
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        //把表格中的内容移到TextRange中
        sel.select();
        //全选TextRange中内容
        sel.execCommand("Copy");
        //复制TextRange中内容 
        xlsheet.Paste();
        //粘贴到活动的EXCEL中      
        oXL.Visible = true;
        //设置excel可见属性

        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
        } catch (e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            //xls.visible = false;
            oXL.Quit();
            oXL = null;
            //结束excel进程，退出完成
            //window.setInterval("Cleanup();",1);
            idTmr = window.setInterval("Cleanup();", 1);

        }
    }else{
        tableToExcel(tableid)
    }
}
function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}
var tableToExcel = (function() {
      var uri = 'data:application/vnd.ms-excel;base64,',
      template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="Content-Type" charset=utf-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g,
            function(m, p) { return c[p]; }) }
        return function(table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
      }
    })()



var div_app = new Vue({
    el: "#log-div",
    data: {
        log_data:[],
        currentItem: "ALL LOG",
        columnItem: ['remote_addr','remote_user','time_local','http_user_agent'],
        itemList: ['ALL','IP','TIME',"AGENT"],
    }
});

//itemName: address so on...
function selectLogType(itemName){
    //remote_addr   remote_user   time_local  http_user_agent 
    var columnData = {
        ALL: ['remote_addr','remote_user','time_local','http_user_agent'],
        IP: ['IP','count'],
        TIME: ['TIME','count'],
        AGENT: ['AGENT','count']
    };
    var urlList = {
        ALL: 'get_all_log',
        IP: 'get_log_by_ip',
        TIME: 'get_log_by_time',
        AGENT: 'get_log_by_agent'
    };

    div_app.currentItem = itemName + " LOG";
    $.get("http://182.254.154.18/log-sum/index.php/Log_data/"+urlList[itemName],
        function(data, status){
            if(status != "success"){
                alert("获取数据失败");
                return;
            }
            console.log(data);
            if(itemName != "ALL"){
                var res = [];
                //把返回的data中的_id列改成各自的列名称
                for(var index in data[0]['result']){
                    var tmp = {};
                    tmp['count'] = data[0]['result'][index]['count'];
                    tmp[columnData[itemName][0]] = data[0]['result'][index]['_id'];
                    res.push(tmp);
                }
                div_app.log_data = res;
                console.log(res);
            }else{
                div_app.log_data = data;
            }
            
            div_app.columnItem = columnData[itemName];
    });
}

//init
selectLogType("ALL");

