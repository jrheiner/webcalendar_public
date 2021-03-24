/* jshint esversion: 6 */

console.info(`${logPreface("JS")} calendar.js loaded`);

var currentMonth;
var currentYear;
var currentDay;

/**
 * Fix visual representation of stacked modals
 * https://stackoverflow.com/a/24914782
 */
$(document).on('show.bs.modal', '.modal', function () {
  let zIndex = 1040 + (10 * $('.modal:visible').length);
  $(this).css('z-index', zIndex);
  setTimeout(function () {
    $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
  }, 0);
});

$(function () {

  /**
   * Enable boostrap tooltips & time picker
   */
  $('[data-toggle="tooltip"]').tooltip();
  $('.clockpicker').clockpicker();

  /**
   * Initialise calendar view for current month
   */
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  getEvents().then(function (data) {
    buildCalendarTable(currentYear, currentMonth, data);
  }).catch(function (e) {
    console.warn(e);
  });

  /**
   * Custom event for handling event updates
   */
  $("#calendar-root").on("event:change", function () {
    getEvents().then(function (data) {
      buildCalendarTable(currentYear, currentMonth, data);
    }).catch(function (e) {
      console.warn(e);
    });
  });

  /**
   * Show event list of the selected date upon opening the details modal
   */
  $("#eventListModal").on("show.bs.modal", function (event) {
    // Reload event list if a event is changed
    $("#eventListModal").off("event:change").on("event:change", function () {
      showEventList(currentDay, currentMonth, currentYear);
    });
    let button = $(event.relatedTarget);
    let day = button.data("day");
    currentDay = day;
    let month = button.data("month");
    let year = button.data("year");
    let modal = $(this);

    modal.find(".modal-title").html("Events");
    showEventList(day, month, year);
  });

});

/**
 * Display event list for a specific date in the details modal 
 * @param {number} day - Day index
 * @param {number} month - Month index
 * @param {number} year - Year
 */
function showEventList(day, month, year) {
  let root = document.getElementById("eventListModalBody");
  $(root).html("");
  getEvents().then(function (data) {
    data.forEach(element => {
      let start = new Date(element.start);
      let end = new Date(element.end);
      let calendarIndex = new Date(`${year}-${month+1}-${day}`);
      if (calendarIndex >= start && calendarIndex <= end || isSameDay(toUNIX(calendarIndex), toUNIX(start))) {
        let eventCard = createEventCard(element);
        if ($(root).children().length != 0) {
          let placed = false;
          $(root).children().each(function () {
            // Insert new event card at correct position
            if (new Date(`1/1/2000/${$(this).attr("data-time")}`) >= new Date(`1/1/2000/${$(eventCard).attr("data-time")}`)) {
              $(this).before($(eventCard));
              placed = true;
              return false;
            }
          });
          if (!placed) {
            root.appendChild(eventCard);
          }
        } else {
          root.appendChild(eventCard);
        }
      }
    });
    if ($(root).children().length == 0) {
      let notice = document.createElement("span");
      $(notice).html(`<h4>This day has no events.</h4> <span class="text-muted">Press the  <kbd><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-calendar-plus-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM0 5h16v9a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5zm8.5 3.5a.5.5 0 0 0-1 0V10H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V11H10a.5.5 0 0 0 0-1H8.5V8.5z"/>
    </svg></kbd>  button to add one. You find it in the toolbar.</span>`);
      root.appendChild(notice);
    }
  }).catch(function (e) {
    console.warn(e);
  });
}

/**
 * Go back one month in the caledar view, rebuilds the table
 */
function goBackward() {
  if (currentMonth == 0) {
    getEvents().then(function (data) {
      buildCalendarTable(currentYear - 1, 11, data);
      currentYear = currentYear - 1;
      currentMonth = 11;
    }).catch(function (e) {
      console.warn(e);
    });
  } else {
    getEvents().then(function (data) {
      buildCalendarTable(currentYear, currentMonth - 1, data);
      currentMonth = currentMonth - 1;
    }).catch(function (e) {
      console.warn(e);
    });

  }
}

/**
 * Go forward one month in the caledar view, rebuilds the table
 */
function goForward() {
  if (currentMonth == 11) {
    getEvents().then(function (data) {
      buildCalendarTable(currentYear + 1, 0, data);
      currentYear = currentYear + 1;
      currentMonth = 0;
    }).catch(function (e) {
      console.warn(e);
    });
  } else {
    getEvents().then(function (data) {
      buildCalendarTable(currentYear, currentMonth + 1, data);
      currentMonth = currentMonth + 1;
    }).catch(function (e) {
      console.warn(e);
    });

  }
}

/**
 * Go current month in the caledar view, rebuilds the table
 */
function goToday() {
  getEvents().then(function (data) {
    let date = new Date();
    currentYear = date.getFullYear();
    currentMonth = date.getMonth();
    buildCalendarTable(date.getFullYear(), date.getMonth(), data);
    let todayCell = $("#calendar-table").find(".calendar-today");
    todayCell.addClass("impulse");
    setTimeout(function () {
      todayCell.removeClass("impulse");
    }, 1000);
  }).catch(function (e) {
    console.warn(e);
  });
}

months = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Builds and fills the calendar view table for a spoecific month and year based on event data
 * @param {number} year - Year
 * @param {number} month - Month index
 * @param {JSON} JSONdata - JSON event data
 */
function buildCalendarTable(year, month, JSONdata) {
  $("#calendar-root").html("");
  $("#control-currentMonth").text(`${months[month]} ${year}`);
  let firstDay = (new Date(year, month).getDay() + 6) % 7;
  let lastDay = new Date(year, month + 1, 0).getDate();
  let id = 1;
  cellIndex = 1;
  let cell;

  let table = $("<table></table>").addClass("table table").attr("id", "calendar-table");
  thead = $("<thead class='thead'><tr><th>Montag</th><th>Dienstag</th><th>Mittwoch</th><th>Donnerstag</th><th>Freitag</th><th>Samstag</th><th>Sonntag</th></tr></thead>");
  table.append(thead);
  for (let rowIndex = 1; rowIndex < 7; rowIndex++) {
    row = $("<tr></tr>").addClass("calendar-row");
    for (let i = 1; i < 8; i++) {
      if (cellIndex <= firstDay || id > lastDay) {
        cell = $("<td></td>").addClass("calendar-offday");
        row.append(cell);
      } else {
        cell = $("<td></td>");
        cell.addClass("calendar-day");
        cell.attr("id", "calendar-day" + id);
        cell.attr("data-toggle", "modal");
        cell.attr("data-target", "#eventListModal");
        cell.attr("data-day", id);
        cell.attr("data-month", month);
        cell.attr("data-year", year);
        if (
          month == new Date().getMonth() &&
          id == new Date().getDate() &&
          year == new Date().getFullYear()
        ) {
          cell.addClass("calendar-today");
        }
        cell.append(`<h2>${id}</h2>`);
        let root = document.createElement("ul");
        $(root).attr("id", `day${id}`);
        root.className = "list-group list-group-flush";
        JSONdata.forEach(element => {
          let start = new Date(element.start);
          let end = new Date(element.end);
          let calendarIndex = new Date(`${year}-${month+1}-${id}`);
          // Handle multi-day events
          if (calendarIndex >= start && calendarIndex <= end || isSameDay(toUNIX(calendarIndex), toUNIX(start))) {
            let li = document.createElement("li");
            if (isSameDay(toUNIX(calendarIndex), toUNIX(start))) {
              $(li).addClass(`list-group-item in-calendar-li ${getStatusClass(element.status)}`).html(`${new Date(element.start).toLocaleTimeString(["de-DE"], {
                hour: '2-digit',
                minute: '2-digit'
              })} <b>${element.title}</b>`);
            } else {
              $(li).addClass(`list-group-item ${getStatusClass(element.status)}`).html(`<b>${element.title}</b>`);
            }
            $(li).attr("data-time", new Date(element.start).toLocaleTimeString(["de-DE"], {
              hour: '2-digit',
              minute: '2-digit'
            }));

            // Insert event card at correct position
            if ($(root).children().length != 0) {
              let placed = false;
              $(root).children().each(function () {
                if (new Date(`1/1/2000/${$(this).attr("data-time")}`) >= new Date("1/1/2000/" + $(li).attr("data-time"))) {
                  $(this).before($(li));
                  placed = true;
                  return false;
                }
              });
              if (!placed) {
                root.appendChild(li);
              }
            } else {
              root.appendChild(li);
            }
          }
        });
        cell.append(root);
        row.append(cell);
        id++;
      }
      cellIndex++;
    }
    table.append(row);
  }
  $("#calendar-root").append(table);
}

/**
 * Gets css class to visualize event status
 * @param {string} status - Event status, values `Busy` `Tentative` `Free`
 * @returns {string} CSS class
 */
function getStatusClass(status) {
  switch (status) {
    case "Busy":
      status = "status-blue";
      break;
    case "Tentative":
      status = "status-blue stripes";
      break;
    case "Free":
      status = "status-purple stripes";
      break;
    default:
      status = "";
      break;
  }
  return status;
}


