var headers, rows;

$(function() {
  $("#csv-upload").submit(function(e) {
    e.preventDefault();
    var file = $("#csv-file")[0].files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function(e) {
      var csvdata = e.target.result.toString();
      processCsv(csvdata);
    });
    reader.readAsBinaryString(file);
  });

  $("#download").click(function() {
    $("#download-area").append(`<a href='${encodeURI(exportCsv())}' download='export.csv' id='download-link'>download</a>`);
    $(this).hide();
  });

  $("#download-link").click(function() {
    $("#download").show();
    $("#download-link").remove();
  });
});

$(document).on("change", ".editable", function(e) {
  rows[$(event.target).data("row")][$(event.target).data("header")] = $(event.target).val();
});

function toggleDropdown(element) {
  $(element).children(".dropdown-content").toggle();
}

function addRow() {
  var arr = {};
  for (var i = 0; i < headers.length; i++) {
    arr[headers[i]] = "";
  }
  rows.push(arr);
  displayCsv(headers, rows);
}

function deleteRows() {
  var toRemove = []
  for (var i = 0; i < rows.length; i++) {
    var blank = true;
    for (header of headers) {
      if (rows[i][header] != "") {
        blank = false;
      }
    }
    if (blank) {
      toRemove.push(i)
    }
  }
  toRemove.sort(function(a, b) {
    return b - a;
  });
  for (var index of toRemove) {
    rows.splice(index, 1);
  }
  displayCsv(headers, rows);
}

function processCsv(content) {
  var lines = content.replace(/\"/g, "").split(/\r\n|\n/);
  headers = lines[0].split(",");
  rows = [];
  for (var i = 1; i < lines.length; i++) {
    var data = lines[i].split(",");
    if (data.length == headers.length) {
      var arr = {};
      for (var j = 0; j < headers.length; j++) {
        arr[headers[j]] = data[j] || "";
      }
      rows.push(arr);
    }
  }
  displayCsv(headers, rows);
}

function displayCsv() {
  $("#output").html("<table id='csv-content'><tr id='header-row'></tr></table><button onclick='addRow()'>Add Row</button> <button onclick='deleteRows()'>Delete Blank Rows</button>");
  for (var header of headers) {
    $("#header-row").append(
      `<td>
        ${header}
        <div class='dropdown' onclick='toggleDropdown(this)'>
          :
          <div class='dropdown-content'>
            <p class='column-operation' onclick='renameColumn("${header}")'>Rename Column</p>
            <hr />
            <p class='column-operation' onclick='number("${header}")'>Number Column</p>
            <p class='column-operation' onclick='fillColumn("${header}")'>Fill Column</p>
            <p class='column-operation' onclick='emptyColumn("${header}")'>Clear Column</p>
            <hr />
            <p class='column-operation' onclick='sort("${header}")'>Sort</p>
            <p class='column-operation' onclick='invsort("${header}")'>Reverse Sort</p>
            <hr />
            <p class='column-operation' onclick='leftColumn("${header}")'>Add Left Column</p>
            <p class='column-operation' onclick='rightColumn("${header}")'>Add Right Column</p>
            <p class='column-operation' onclick='deleteColumn("${header}")'>Delete Column</p>
          </div>
        </div>
      </td>`
    );
  }
  for (var row of rows) {
    var formattedRow = "";
    for (var header of headers) {
      formattedRow += `<td><input type='text' class='editable' value='${row[header]}' data-row='${rows.indexOf(row)}' data-header='${header}'></td>`;
    }
    $("#csv-content").append(`<tr>${formattedRow}</tr>`);
  }
}

function exportCsv() {
  var csvString = "data:text/csv;charset=utf-8,";
  for (var header of headers) {
    csvString += (headers.indexOf(header) == headers.length - 1) ? header + "\n" : header + ",";
  }
  for (var row of rows) {
    for (var header of headers) {
      csvString += (headers.indexOf(header) == headers.length - 1) ? row[header] + "\n" : row[header] + ",";
    }
  }
  return csvString;
}

function number(header) {
  for (var i = 0; i < rows.length; i++) {
    rows[i][header] = (i + 1).toString();
  }
  displayCsv(headers, rows);
}

function deleteColumn(header) {
  if (headers.length == 1) {
    alert("You cannot remove the last column!");
    return;
  }
  for (var i = 0; i < rows.length; i++) {
    delete rows[i][header];
  }
  headers.splice(headers.indexOf(header), 1);
  displayCsv(headers, rows);
}

function leftColumn(header) {
  var columnName = `new ${Math.floor(Math.random() * 899) + 100}`;
  headers.splice(headers.indexOf(header), 0, columnName);
  for (var i = 0; i < rows.length; i++) {
    rows[i][columnName] = "";
  }
  displayCsv(headers, rows);
}

function rightColumn(header) {
  var columnName = `new ${Math.floor(Math.random() * 899) + 100}`;
  headers.splice(headers.indexOf(header) + 1, 0, columnName)
  for (var i = 0; i < rows.length; i++) {
    rows[i][columnName] = "";
  }
  displayCsv(headers, rows);
}

function fillColumn(header) {
  var toFill = prompt("What would you like to fill the column with?");
  for (var i = 0; i < rows.length; i++) {
    rows[i][header] = toFill;
  }
  displayCsv(headers, rows);
}

function emptyColumn(header) {
  for (var i = 0; i < rows.length; i++) {
    rows[i][header] = "";
  }
  displayCsv(headers, rows);
}

function renameColumn(header) {
  do {
    var columnName = prompt("Enter a new column name");
  } while (headers.indexOf(columnName) != -1);
  if (!columnName) {
    return;
  }
  headers[headers.indexOf(header)] = columnName;
  for (var row of rows) {
    Object.defineProperty(row, columnName, Object.getOwnPropertyDescriptor(row, header));
    delete row[header];
  }
  displayCsv(headers, rows);
}

function sort(header) {
  rows.sort(function(a, b) {
    return a[header].localeCompare(b[header]);
  });
  displayCsv(headers, rows);
}

function invsort(header) {
  rows.sort(function(a, b) {
    return b[header].localeCompare(a[header]);
  });
  displayCsv(headers, rows);
}
