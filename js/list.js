/* jshint esversion: 6 */

console.info(`${logPreface("JS")} list.js loaded`);

$(function () {

  /**
   * Fill event overview list upon loading the page
   */
  getEvents().then(function (data) {
    initListOfEvents(data);
  }).catch(function (e) {
    console.warn(e);
  });

   /**
   * Enable boostrap tooltips & time picker
   */
  $('[data-toggle="tooltip"]').tooltip();
  $('.clockpicker').clockpicker();

  /**
   * Intialise handler for the button toolbar
   */
  $("#expandAll").on("click", function () {
    $('.collapse.multi-collapse').addClass('show');
  });
  $("#collapseAll").on("click", function () {
    $('.collapse.multi-collapse').removeClass('show');
  });
  $("#sortNew").on("click", function () {
    getEvents().then(function (data) {
      initListOfEvents(data, "new", true);
      if ($("#searchBar").val() != 0) {
        $("#searchBar").trigger("onkeyup");
      }
    }).catch(function (e) {
      console.warn(e);
    });
    $('#sortOld').removeClass('active');
    $('#sortNew').addClass('active');
  });
  $("#sortOld").on("click", function () {
    getEvents().then(function (data) {
      initListOfEvents(data, "old", true);
      if ($("#searchBar").val() != 0) {
        $("#searchBar").trigger("onkeyup");
      }
    }).catch(function (e) {
      console.warn(e);
    });
    $('#sortNew').removeClass('active');
    $('#sortOld').addClass('active');
  });

  /**
   * Initialise to-the-top button
   */
  let btn = $("#btn-go-top");
  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      btn.css("display", "block");
    } else {
      btn.css("display", "none");
    }
  });
  btn.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({
      scrollTop: 0
    }, "300");
  });

});


/**
 * Initialises Event overview list
 * @param {JSON} JSONdata - JSON event data
 * @param {string} order - Order in which the list should be sorted, values `new` `old`
 * @param {*} reload - Whether the list should be completely reloaded
 */
function initListOfEvents(JSONdata, order = "new", reload = false) {
  let unorderedDaysWithEvent = new Map();
  let orderedDaysWithEvent = new Map();
  JSONdata.forEach((entry) => {
    if (!unorderedDaysWithEvent.has(dateFormat(entry.start))) {
      unorderedDaysWithEvent.set(
        dateFormat(entry.start),
        createCollapse(toUNIX(entry.start))
      );
    }
  });

  orderedDaysWithEvent = sortMapByDate(unorderedDaysWithEvent, order);

  JSONdata.forEach((entry) => {
    let eventCard = createEventCard(entry);
    let cardHolder = orderedDaysWithEvent.get(dateFormat(entry.start)).getElementsByClassName("card-body")[0];

    if ($(cardHolder).children().length != 0) {
      let placed = false;
      $(cardHolder).children().each(function () {
        if (new Date(`1/1/2000/${$(this).attr("data-time")}`) >= new Date(`1/1/2000/${$(eventCard).attr("data-time")}`)) {
          $(this).before($(eventCard));
          placed = true;
          return false;
        }
      });
      if (!placed) {
        cardHolder.appendChild(eventCard);
      }
    } else {
      cardHolder.appendChild(eventCard);
    }
  });
  let accordion = document.getElementById("event-accordion");
  if (reload) {
    $(accordion).empty();
  }
  orderedDaysWithEvent.forEach((collapse) => {
    accordion.appendChild(collapse);
  });

/**
 * Scroll element for current day (next day) into view
 */
  if (document.getElementById("list-today") != null) {
    document.getElementById("list-today").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  } else if (document.getElementById("list-tomorrow") != null) {
    document.getElementById("list-tomorrow").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

/**
 * Creates an event card which is part of a collapsible list
 * @param {(number|string)} time - Unix timestamp of the event
 * @returns {HTMLDivElement} HTML Node / Element
 */
function createCollapse(time) {
  let today = false;
  let id = time;
  let dateDisplay = singleDateDisplay(fromUNIX(time));

  let collapse = document.createElement("div");
  collapse.className = "card";

  let collapseHeader = document.createElement("div");
  collapseHeader.className = "card-header";

  let collapseTitle = document.createElement("h2");
  collapseTitle.className = "mb-0";

  let collapseBtn = document.createElement("button");
  collapseBtn.className = "btn btn-link btn-block text-left collapsed";

  let todayDate = new Date();

  if (isSameDay(time, toUNIX(todayDate))) {
    collapseBtn.innerHTML =
      `${dateDisplay} <span class='badge badge-primary' id='list-today'>Today</span>`;
    today = true;
  } else if (isTomorrow(time, toUNIX(todayDate))) {
    collapseBtn.innerHTML =
      `${dateDisplay} <span class='badge badge-secondary' id='list-tomorrow'>Tomorrow</span>`;
  } else {
    collapseBtn.innerText = dateDisplay;
  }
  $(collapseBtn).attr("type", "button");
  $(collapseBtn).attr("data-toggle", "collapse");
  $(collapseBtn).attr("data-target", `#id${id}`);

  collapseBody = document.createElement("div");
  collapseBody.className = "collapse multi-collapse";
  if (today) {
    collapseBody.className = `${collapseBody.className} show`;
  }
  $(collapseBody).attr("id", `id${id}`);

  collapseBodyCardHolder = document.createElement("div");
  collapseBodyCardHolder.className = "card-body";
  collapseBodyCardHolder.id = "card-body";

  collapseTitle.appendChild(collapseBtn);
  collapseHeader.appendChild(collapseTitle);
  collapseBody.appendChild(collapseBodyCardHolder);
  collapse.appendChild(collapseHeader);
  collapse.appendChild(collapseBody);

  return collapse;
}

/**
 * Searchbar handler, hides or shows matching results in the list while typing
 */
function searchBar() {
  let term, i, clearText;
  term = $("#searchBar").val().toUpperCase();
  cardTitle = $("#event-accordion").find(".card-title");

  $('.collapse.multi-collapse').addClass('show');

  for (i = 0; i < cardTitle.length; i++) {
    clearText = cardTitle[i].innerText;
    cardTitle[i].innerHTML = clearText;
    index = clearText.toUpperCase().indexOf(term);
    if (index >= 0) {
      if (term.length >= 1) {
        cardTitle[i].innerHTML = `<span class='text-muted'>${clearText.substring(0, index)}</span>${clearText.substring(index, index + term.length)}<span class='text-muted'>${clearText.substring(index + term.length)}</span>`;
      }
      // Show event card as title matches the search
      $(cardTitle).eq(i).parents().eq(2).show();
      // Show parent since atleast 1 child is visible
      $(cardTitle).eq(i).parents().eq(5).show();
    } else {
      // Hide event card since title is not matching search critera
      $(cardTitle).eq(i).parents().eq(2).hide();
    }

    // Hide parent if no child is visible
    if ($(cardTitle).eq(i).parents().eq(3).children().filter(":visible").length == 0) {
      $(cardTitle).eq(i).parents().eq(5).hide();
    }
  }

  if ($("#event-accordion").children().filter(":visible").length == 0) {
    $("#search-invalid").show();
  } else {
    $("#search-invalid").hide();
  }
}