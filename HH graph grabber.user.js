// ==UserScript==
//@name         HH graph grabber
//@namespace    http://omnigon.com/
//@version      1.01
//@description  enter something useful
//@author       Anton Zykov
//@match        https://spb.hh.ru/employer/vacancy/stat/*
//@require http://code.jquery.com/jquery-latest.js
//@require https://datejs.googlecode.com/files/date.js
//@updateUrl https://raw.githubusercontent.com/Aggtaa/HH-stats-export/master/HH%20graph%20grabber.user.js
//@grant        none
// ==/UserScript==

$(document).ready(function() {
    
    $('.navi__menu').find('.navi-row > ul:first-child').append('<li class="navi-item navi-item_level-1 HH-Navi-MenuItems-Item HH-Navi-MenuResizer-MovingItem"><div class="navi-item__switcher HH-Navi-MenuItems-Switcher" aria-haspopup="true"><a id="super_button">Export</a></div></li>');
    
    $('#super_button').on('click', function () {
        var json = $('script[data-name="HH/Employer/Vacancy/StatGraph"]').attr('data-params');
        var obj = JSON.parse(json);
        var stats = obj.data.stats;
        var events = obj.trl.events;
        
        var html = "<table><thead><tr><th>Date</th><th>Views</th><th>Responses</th><th>Updated</th></tr></thead>\r\n";
        var csv = "";
        for (var i = 0; i < stats.length; i++)
        {
            if (stats[i].views == null)
                continue;
            
            var str = '';
            if (stats[i].events) {
                for (var j = 0; j < stats[i].events.length; j++)
                {
                    if (str != '')
                        str += ', ';
                    var evt = events[stats[i].events[j]];
                    if (typeof(evt) == 'undefined')
                        evt = '?' + stats[i].events[j];
                    str += evt;
                }
            }
            html += "<tr><td>" + stats[i].date + "</td><td>" + stats[i].views + "</td><td>" + stats[i].responses + "</td><td>" + str + "</td></tr>\r\n";
            csv += '"' + stats[i].date + '","' + stats[i].views + '","' + stats[i].responses + '","' + str + "\"\r\n";
        }
        html += '</table>';

        console.log(html, stats);
        //$('.vacancy-stat').prepend('<input id="export_inp" type="text" value="' + html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + '" />');
        //$("#export_inp").select();
        window.prompt("Copy to clipboard (Ctrl+C/Cmd+C) and paste into MS Excel", html);
    });
});