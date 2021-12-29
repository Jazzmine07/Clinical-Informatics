// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable();
});

$(document).ready(function() {
  $('#HATable').DataTable();
});

$(document).ready(function() {
  $('#nurseAssignedTask').DataTable();
});

$(document).ready(function() {
  $('#nurseClinicVisits').DataTable();
});

$(document).ready(function() {
  $('#doctorIncidenceReports').DataTable();
});

$(document).ready(function() {
  $('#doctorAssignedTask').DataTable();
});

$(document).ready(function() {
  $('#usedMedicineTable').DataTable();
});

$(document).ready(function() {
  //$('#medicineTable').DataTable();
  $('#medicineTable').DataTable({
    paging: false,
    order: [[1, 'asc']],
    rowGroup: {
        endRender: function (rows, group ) {
            var total = rows
                .data()
                .pluck(2)
                .reduce( function (a, b) {
                    return a + b.replace(/[^\d]/g, '')*1;
                }, 0);

            return ' Total Quantity: '+
                $.fn.dataTable.render.number(',', '.', 0).display( total );
        },
        dataSrc: 1
    }
  });
});

$(document).ready(function() {
  $('#supplyTable').DataTable({
    order: [[1, 'asc']],
    rowGroup: {
        endRender: function (rows, group ) {
            var total = rows
                .data()
                .pluck(2)
                .reduce( function (a, b) {
                    return a + b.replace(/[^\d]/g, '')*1;
                }, 0);

            return ' Total Quantity: '+
                $.fn.dataTable.render.number(',', '.', 0).display( total );
        },
        dataSrc: 1
    }
  });
});

$(document).ready(function() {
  $('#dentalTable').DataTable({
    pageLength: 100,
    order: [[1, 'asc']],
    rowGroup: {
        endRender: function (rows, group ) {
            var total = rows
                .data()
                .pluck(2)
                .reduce( function (a, b) {
                    return a + b.replace(/[^\d]/g, '')*1;
                }, 0);

            return ' Total Quantity: '+
                $.fn.dataTable.render.number(',', '.', 0).display( total );
        },
        dataSrc: 1
    }
  });
});

$(document).ready(function() {
  $('#onGoingTable').DataTable();
});

$(document).ready(function() {
  $('#upcomingTable').DataTable();
});

$(document).ready(function() {
  $('#pastTable').DataTable();
});
