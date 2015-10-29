class XLSXUtils {
  static arrayToXLSX(name, data) {
    let wsName = name;
    let wb = {
      Sheets: {},
      Props: {},
      SSF: {},
      SheetNames: []
    };
    let wbopts = { bookType:'xlsx', bookSST:false, type:'binary' };
    let ws = {}
    let range = {s: {c:0, r:0}, e: {c:0, r:0 }};

    /* Iterate through each element in the structure */
    for(var row = 0; row != data.length; ++row) {
      if(range.e.r < row) range.e.r = row;
      for(var column = 0; column != data[row].length; ++column) {
        if(range.e.c < column) range.e.c = column;

        /* create cell object: .v is the actual data */
        var cell = { v: data[row][column] };
        if(cell.v == null) continue;

        /* create the correct cell reference */
        var cellRef = XLSX.utils.encode_cell({c:column,r:row});

        /* determine the cell type */
        if(typeof cell.v === 'number') cell.t = 'n';
        else if(typeof cell.v === 'boolean') cell.t = 'b';
        else cell.t = 's';

        /* add to structure */
        ws[cellRef] = cell;
      }
    }
    ws['!ref'] = XLSX.utils.encode_range(range);

    /* add worksheet to workbook */
    wb.SheetNames.push(wsName);
    wb.Sheets[wsName] = ws;

    /* write file */
    let wbout = XLSX.write(wb, wbopts);

    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    /* the saveAs call downloads a file on the local machine */
    saveAs(new Blob([s2ab(wbout)],{type:""}), `${name}.xlsx`)
  }
}
