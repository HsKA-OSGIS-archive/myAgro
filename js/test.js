var data = [ [ 1, 2, 3 ], [ 4, 5, 6 ], [7, 8, 9 ] ];

var html = '<table><thead><tr>...</tr></thead><tbody>';
for (var i = 0, len = data.length; i < len; ++i) {
    html += '<tr>';
    for (var j = 0, rowLen = data[i].length; j < rowLen; ++j ) {
        html += '<td>' + data[i][j] + '</td>';
    }
    html += "</tr>";
}
html += '</tbody><tfoot><tr>....</tr></tfoot></table>';

$('#test').append(html);