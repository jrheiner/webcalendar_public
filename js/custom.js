/* jshint esversion: 6 */

console.info(`${logPreface("JS")} custom.js loaded`);

///////////////////
// API FUNCTIONS //
///////////////////

// Error message if we dont reach the server
var errorDetails = {
    "code": "0",
    "description": "Client configuration error<br>Check <u><a href='ReadMe.md.html' target='_blank' rel='noopener' class='text-danger'>ReadMe.md</a></u> for more information"
};

/**
 * API-Request for deleting an event
 * @param {number} id - Event id
 * @returns {Promise} Resolves or rejects (with error data) the promise
 */
function deleteEvent(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
                url: `http://dhbw.radicalsimplicity.com/calendar/${getDatabaseUser()}/events/${id}`,
                method: "DELETE",
                timeout: 5000
            })
            .done(function () {
                console.log(`${logPreface("XHR")} deleteEvent(${id}) success`);
                showNotification("success", "Success!", "Event deleted.");
                resolve();
            })
            .fail(function (xhr, status, error) {
                if (xhr.responseText != undefined) {
                    errorDetails = JSON.parse(xhr.responseText);
                }
                if (error.statusText == "timeout") {
                    showNotification("error", "Request timeout!", "Failed to delete event.");
                } else {
                    showNotification("error", "Request failed!", `Failed to delete event. <br> <small class='text-monospace font-italic text-danger'> Code ${errorDetails.code}: ${errorDetails.description}</small>`);
                }
                reject(xhr.responseText);
            });
    });
}

/**
 * API-Request to get all events for the current user
 * @returns {Promise} Resolves or rejects (with error data) the promise
 */
function getEvents() {
    return new Promise(function (resolve, reject) {
        $.ajax({
                url: `http://dhbw.radicalsimplicity.com/calendar/${getDatabaseUser()}/events/`,
                method: "GET",
                timeout: 5000
            })
            .done(function (data) {
                console.log(`${logPreface("XHR")} getEvents() success`);
                resolve(data);
            })
            .fail(function (xhr, status, error) {
                if (xhr.responseText != undefined) {
                    errorDetails = JSON.parse(xhr.responseText);
                }
                if (error.statusText == "timeout") {
                    showNotification("error", "Request timeout!", "Failed to load events.");
                } else {
                    showNotification("error", "Request failed!", `Failed to load events. <br> <small class='text-monospace font-italic text-danger'> Code ${errorDetails.code}: ${errorDetails.description}</small>`);
                }
                reject(xhr.responseText);
            });
    });
}

/**
 * API-Request to get event data for a specific event
 * @param {number} id - Event id
 * @returns {Promise} Resolves or rejects (with error data) the promise
 */
function getEventsDetails(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
                url: `http://dhbw.radicalsimplicity.com/calendar/${getDatabaseUser()}/events/${id}`,
                method: "GET",
                timeout: 5000
            })
            .done(function (data) {
                console.log(`${logPreface("XHR")} getEventsDetails(${id}) success`);
                resolve(data);
            })
            .fail(function (xhr, status, error) {
                if (xhr.responseText != undefined) {
                    errorDetails = JSON.parse(xhr.responseText);
                }
                if (error.statusText == "timeout") {
                    showNotification("error", "Request timeout!", "Failed to load event details.");
                } else {
                    showNotification("error", "Request failed!", `Failed to load event details. <br> <small class='text-monospace font-italic text-danger'> Code ${errorDetails.code}: ${errorDetails.description}</small>`);
                }
                reject(xhr.responseText);
            });
    });
}

/**
 * API-Request to get all categories of the current user
 * @returns {Promise} Resolves or rejects (with error data) the promise
 */
function getCategories() {
    return new Promise(function (resolve, reject) {
        $.ajax({
                url: `http://dhbw.radicalsimplicity.com/calendar/${getDatabaseUser()}/categories/`,
                method: "GET",
                timeout: 5000
            })
            .done(function (data) {
                console.log(`${logPreface("XHR")} getCategories() success`);
                resolve(data);
            })
            .fail(function (xhr, status, error) {
                if (xhr.responseText != undefined) {
                    errorDetails = JSON.parse(xhr.responseText);
                }
                if (error.statusText == "timeout") {
                    showNotification("error", "Request timeout!", "Failed to load categories.");
                } else {
                    showNotification("error", "Request failed!", `Failed to load categories. <br> <small class='text-monospace font-italic text-danger'> Code ${errorDetails.code}: ${errorDetails.description}</small>`);
                }
                reject(xhr.responseText);
            });
    });
}

/**
 * API-Request to add a new event
 * @param {(JSON | string)} data - JSON event data
 * @returns {Promise} Resolves or rejects (with error data) the promise
 */
function addEvent(data) {
    return new Promise(function (resolve, reject) {
        $.ajax({
                type: "POST",
                url: `http://dhbw.radicalsimplicity.com/calendar/${getDatabaseUser()}/events/`,
                data: JSON.stringify(data),
                dataType: "json",
                timeout: 5000
            })
            .done(function (data) {
                console.group(`${logPreface("XHR")} addEvent(data) success`);
                console.table(data);
                console.groupEnd();
                showNotification("success", "Success!", `Added <i>${data.title}</i> as new event.`);
                resolve(data);
            })
            .fail(function (xhr, status, error) {
                if (xhr.responseText != undefined) {
                    errorDetails = JSON.parse(xhr.responseText);
                }
                if (error.statusText == "timeout") {
                    showNotification("error", "Request timeout!", "Failed to add new event.");
                } else {
                    showNotification("error", "Request failed!", `Failed to add new event. <br> <small class='text-monospace font-italic text-danger'> Code ${errorDetails.code}: ${errorDetails.description}</small>`);
                }
                reject(errorDetails);
            });
    });
}

/**
 * API-Request to edit an existing event
 * @param {(JSON | string)} data - Updated JSON event data 
 * @param {number} id - Event id
 * @returns {Promise} Resolves or rejects (with error data) the promise
 */
function editEvent(data, id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
                type: "PUT",
                url: `http://dhbw.radicalsimplicity.com/calendar/${getDatabaseUser()}/events/${id}`,
                data: JSON.stringify(data),
                dataType: "json",
                timeout: 5000
            })
            .done(function (data) {
                console.group(`${logPreface("XHR")} editEvent(data, ${id}) success`);
                console.table(data);
                console.groupEnd();
                showNotification("success", "Success!", `Updated <i>${data.title}</i>.`);
                resolve(data);
            })
            .fail(function (xhr, status, error) {
                if (xhr.responseText != undefined) {
                    errorDetails = JSON.parse(xhr.responseText);
                }
                if (error.statusText == "timeout") {
                    showNotification("error", "Request timeout!", "Failed to update event.");
                } else {
                    showNotification("error", "Request failed!", `Failed to update event. <br> <small class='text-monospace font-italic text-danger'> Code ${errorDetails.code}: ${errorDetails.description}</small>`);
                }
                reject(errorDetails);
            });
    });
}

/**
 * API-Request to create a new category
 * @param {string} name - Category name
 * @returns {Promise} Resolves or rejects (with error data) the promise
 */
function createCategory(name) {
    data = {
        "name": name
    };
    return new Promise(function (resolve, reject) {
        $.ajax({
                type: "POST",
                url: `http://dhbw.radicalsimplicity.com/calendar/${getDatabaseUser()}/categories/`,
                data: JSON.stringify(data),
                dataType: "json",
                timeout: 5000
            })
            .done(function (data) {
                console.log(`${logPreface("XHR")} createCategory(${name}) success`);
                showNotification("success", "Success!", `Added <i>${name}</i> as new category.`);
                resolve(data);
            })
            .fail(function (xhr, status, error) {
                if (xhr.responseText != undefined) {
                    errorDetails = JSON.parse(xhr.responseText);
                }
                if (error.statusText == "timeout") {
                    showNotification("error", "Request timeout!", "Failed to new category.");
                } else {
                    showNotification("error", "Request failed!", `Failed to new category. <br> <small class='text-monospace font-italic text-danger'> Code ${errorDetails.code}: ${errorDetails.description}</small>`);
                }
                reject(errorDetails);
            });
    });
}

/**
 * API-Request to delete a category
 * @param {number} id - Category id
 * @returns {Promise} Resolves or rejects (with error data) the promise
 */
function deleteCategory(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
                url: `http://dhbw.radicalsimplicity.com/calendar/${getDatabaseUser()}/categories/${id}`,
                method: "DELETE",
                timeout: 5000
            })
            .done(function () {
                console.log(`${logPreface("XHR")} deleteCategory(${id}) success`);
                showNotification("success", "Success!", "Category deleted.");
                resolve();
            })
            .fail(function (xhr, status, error) {
                if (xhr.responseText != undefined) {
                    errorDetails = JSON.parse(xhr.responseText);
                }
                if (error.statusText == "timeout") {
                    showNotification("error", "Request timeout!", "Failed to delete category.");
                } else {
                    showNotification("error", "Request failed!", `Failed to delete category. <br> <small class='text-monospace font-italic text-danger'> Code ${errorDetails.code}: ${errorDetails.description}</small>`);
                }
                reject(xhr.responseText);
            });
    });
}

/**
 * API-Request to remove the image from an specific event
 * @param {number} id - Event id
 * @returns {Promise} Resolves or rejects (with error data) the promise
 */
function deleteImageFromEvent(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
                url: `http://dhbw.radicalsimplicity.com/calendar/${getDatabaseUser()}/images/${id}`,
                method: "DELETE",
                timeout: 5000
            })
            .done(function () {
                console.log(`${logPreface("XHR")} deleteImageFromEvent(${id}) success`);
                resolve();
            })
            .fail(function (xhr, status, error) {
                if (xhr.responseText != undefined) {
                    errorDetails = JSON.parse(xhr.responseText);
                }
                if (error.statusText == "timeout") {
                    showNotification("error", "Request timeout!", "Failed to delete image.");
                } else {
                    showNotification("error", "Request failed!", `Failed to delete image. <br> <small class='text-monospace font-italic text-danger'> Code ${errorDetails.code}: ${errorDetails.description}</small>`);
                }
                reject(xhr.responseText);
            });
    });
}


///////////////////////
// UTILITY FUNCTIONS //
///////////////////////

/**
 * Gets the defult image index
 * @returns {number} Index of the selected placeholder image
 */
function getDefaultImage() {
    let index = Number(localStorage.getItem("defaultImage")) || 3;
    setDefaultImage(index);
    return Number(index);
}

/**
 * Sets a default image index 
 * @param {(number | string)} index - New placeholder index
 */
function setDefaultImage(index) {
    localStorage.setItem("defaultImage", index);
}

/**
 * Gets the current (or default) database user
 * @returns {string} Database user
 */
function getDatabaseUser() {
    let id = localStorage.getItem("databaseUser") || "6177815";
    setDatabaseUser(id);
    return id;
}

/**
 * Sets a new database user that should be used in all API interactions
 * @param {(number | string)} id - New database user id
 */
function setDatabaseUser(id) {
    localStorage.setItem("databaseUser", id);
}

/**
 * Builds event card based on event data
 * @param {JSON} eventData - Event data
 * @returns {HTMLDivElement} Complete event card including image and buttons
 */
function createEventCard(eventData) {
    let card = document.createElement("div");
    card.className = "card";
    $(card).attr("data-time", new Date(eventData.start).toLocaleTimeString(["de-DE"], {
        hour: '2-digit',
        minute: '2-digit'
    }));
    $(card).attr("id", `event-${eventData.id}`);

    let cardRow = document.createElement("div");
    cardRow.className = "row no-gutters";

    let cardCol = document.createElement("div");
    cardCol.className = "col-sm-1";

    let cardImg = document.createElement("img");
    cardImg.className = "img-fluid rounded ml-2 mt-2 mb-2";
    $(cardImg).attr("src", eventData.imageurl || `img/default/${getDefaultImage()}_placeholder.png`);

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    let title = document.createElement("h5");
    title.innerText = eventData.title;
    title.className = "card-title";

    let subtitle = document.createElement("h6");
    subtitle.innerText = doubleTimeDisplay(eventData.start, eventData.end);
    subtitle.className = "card-subtitle mb-2 text-muted";

    let cardDetailBtn = document.createElement("button");
    cardDetailBtn.className = "btn btn-outline-success btn-sm mr-3";
    cardDetailBtn.innerHTML = "Details";
    $(cardDetailBtn).attr("type", "button");
    $(cardDetailBtn).attr("data-toggle", "modal");
    $(cardDetailBtn).attr("data-target", "#modal-details");
    $(cardDetailBtn).attr("data-id", eventData.id);

    let cardEditBtn = document.createElement("button");
    cardEditBtn.className = "btn btn-outline-primary btn-sm mx-1";
    cardEditBtn.innerHTML = `<svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg>`;
    $(cardEditBtn).attr("type", "button");
    $(cardEditBtn).attr("data-toggle", "modal");
    $(cardEditBtn).attr("data-target", "#modal-edit");
    $(cardEditBtn).attr("data-id", eventData.id);

    let cardDeleteBtn = document.createElement("button");
    cardDeleteBtn.className = "btn btn-outline-danger btn-sm mx-1";
    cardDeleteBtn.innerHTML = `<svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
  </svg>`;
    $(cardDeleteBtn).attr("type", "button");
    $(cardDeleteBtn).attr("data-toggle", "modal");
    $(cardDeleteBtn).attr("data-target", "#modal-delete");
    $(cardDeleteBtn).attr("data-name", eventData.title);
    $(cardDeleteBtn).attr("data-start", eventData.start);
    $(cardDeleteBtn).attr("data-end", eventData.end);
    $(cardDeleteBtn).attr("data-organizer", eventData.organizer);
    $(cardDeleteBtn).attr("data-id", eventData.id);

    cardCol.appendChild(cardImg);

    cardBody.appendChild(title);
    cardBody.appendChild(subtitle);
    cardBody.appendChild(cardDetailBtn);
    cardBody.appendChild(cardEditBtn);
    cardBody.appendChild(cardDeleteBtn);
    cardRow.appendChild(cardCol);
    cardRow.appendChild(cardBody);
    card.appendChild(cardRow);

    return card;
}

/**
 * Wrapper to initiate the category selection for an existing event
 * @param {JSON} eventCategories - Categories of the current event
 */
function getCategoriesForEvent(eventCategories) {
    getCategories().then(function (data) {
        loadCategories(data, eventCategories);
    }).catch(function (e) {
        console.warn(e);
    });
}

/**
 * Load the category selection checkboxes and precheck them based on the event
 * @param {JSON} categories - All existing categories
 * @param {(JSON | string)} eventCategories - Categories of the specific event (that should be prechecked)
 */
function loadCategories(categories, eventCategories) {
    let formGroup = document.getElementById("category-checkboxes");
    let label = document.createElement("div");
    label.className = "pt-2 pb-1";
    label.innerText = "Categories";

    let helptext = document.createElement("small");
    helptext.className = "form-text text-muted";
    helptext.innerText = "Optional.";

    let root = document.createElement("div");

    categories.forEach((category) => {
        let checked = false;
        if (JSON.stringify(eventCategories).includes(category.name)) {
            checked = true;
        }
        let checkbox = buildCheckbox(
            `checkbox${category.id}`,
            category.name,
            checked
        );
        root.appendChild(checkbox);
    });
    $(formGroup).empty();
    $(formGroup).append(label);
    $(formGroup).append(root);
}

/**
 * Build a category selection checkbox
 * @param {number} id - Category id 
 * @param {string} name - Category name
 * @param {boolean} checked - Whether the checkbox should be prechecked
 */
function buildCheckbox(id, name, checked) {
    let root = document.createElement("div");
    root.className = "form-check form-check-inline p-1";

    input = document.createElement("input");
    input.className = "form-check-input";
    input.id = id;
    $(input).attr("type", "checkbox");
    $(input).attr("name", id);
    $(input).prop("checked", checked);

    label = document.createElement("label");
    label.className = "form-check-label";
    $(label).attr("for", id);
    label.innerText = name;

    root.appendChild(input);
    root.appendChild(label);

    return root;
}

/**
 * Read data from the form and create a JSON object
 * @param {HTMLFormElement} form - From selector
 * @param {string} imagedata - Base64 Imagedata, optional
 */
function formToJson(form, imagedata = null) {
    let data = $(form).serializeArray();
    categoriesArray = [];
    data.forEach(element => {
        if (element.name.includes("checkbox")) {
            categoriesArray.push({
                "id": element.name.slice(8)
            });
        }
    });
    let JSONData = {
        title: data[0].value,
        location: data[1].value,
        organizer: data[2].value,
        start: `${data[4].value}T${data[5].value}`,
        end: `${data[6].value}T${data[7].value}`,
        status: $("#input-status").val(),
        allday: false,
        webpage: data[3].value,
        imagedata: imagedata,
        categories: categoriesArray,
        extra: data[data.length - 1].value || null
    };
    return JSONData;
}

/**
 * Sort a map with dates as key
 * @param {Map} map - Map to sort
 * @param {string} order - Order, values `new` `old`
 */
function sortMapByDate(map, order = "new") {
    let mapArray = [];
    map.forEach(function (value, key) {
        mapArray.push([key, value]);
    }, map);
    mapArray.sort(function compare(a, b) {
        let dateA = new Date(a[0]);
        let dateB = new Date(b[0]);
        if (order == "new") {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });
    let sortedMap = new Map();
    mapArray.map((element) => {
        sortedMap.set(element[0], element[1]);
    });
    return sortedMap;
}

/**
 * Create a valid ICS string (file content)
 * @param {(number | string)} id - Event id
 * @param {string} name - Event name
 * @param {string} organizer - Event organizer
 * @param {(string | null)} url - Event webpage
 * @param {(string | null)} location - Event location
 * @param {string} description - Event description
 * @param {Date} start - Event start time (ISO format required)
 * @param {Date} end - Event end time (ISO format required)
 * @returns {string} Event as ICS event string
 */
function createICSString(id, name, organizer, url, location, description, start, end) {
    let ics = `
BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:-//DHBW Webcalendar//6177815//EN\r
BEGIN:VTIMEZONE\r
TZID:Europe/Berlin\r
BEGIN:DAYLIGHT\r
TZOFFSETFROM:+0100\r
TZOFFSETTO:+0200\r
TZNAME:CEST\r
DTSTART:19700329T020000\r
RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=3\r
END:DAYLIGHT\r
BEGIN:STANDARD\r
TZOFFSETFROM:+0200\r
TZOFFSETTO:+0100\r
TZNAME:CET\r
DTSTART:19701025T030000\r
RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=-1SU;BYMONTH=10\r
END:STANDARD\r
END:VTIMEZONE\r
BEGIN:VEVENT\r
UID:${id}\r
DTSTAMP:${new Date().toISOString().replace(/-|:|\.|Z/gi, "").slice(0, -3)}Z\r
DTSTART:${end}Z\r
DTEND:${start}Z\r
SUMMARY:${name}\r
ORGANIZER:${organizer}\r
URL:${url ? url : "No webpage available"}\r
LOCATION:${location ? location : "No location available"}\r
DESCRIPTION:${description.trim()}\r
END:VEVENT\r
END:VCALENDAR\r`;
    return ics.trim();
}


////////////////////////////
// NOTIFICATION FUNCTIONS //
////////////////////////////

/**
 * Show a toast notification to the user
 * @param {string} type - Notification type, values `success` `info` `error` 
 * @param {string} title - Notification title (HTML allowed)
 * @param {string} message - Notitication message (HTML allowed)
 */
function showNotification(type, title, message) {
    let toast = buildToast();
    let types = {
        "error": {
            "icon": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-exclamation-triangle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
          </svg>&nbsp;&nbsp;`,
            "color": "bg-danger"
        },
        "info": {
            "icon": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-info-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>&nbsp;&nbsp;`,
            "color": "bg-info"
        },
        "success": {
            "icon": `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check-square-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>&nbsp;&nbsp;`,
            "color": "bg-success"
        }
    };
    $(toast).addClass(types[type].color);
    $(toast).find("strong").html(types[type].icon + title);
    $(toast).find("small").text(timestampDE());
    $(toast).find(".toast-body").html(message);
    $("#notification-holder").prepend(toast);
    $(toast).toast('show');
}

/**
 * Build a empty toast notification frame
 * @returns {HTMLDivElement} - Toast HTML element
 */
function buildToast() {
    root = document.createElement("div");
    $(root).addClass("toast");
    $(root).attr("role", "alert");
    $(root).attr("data-autohide", true);
    $(root).attr("data-delay", 15000);

    header = document.createElement("div");
    $(header).addClass("toast-header");

    title = document.createElement("strong");
    $(title).addClass("mr-auto");

    timestamp = document.createElement("small");
    $(timestamp).addClass("ml-4");

    closeBtn = document.createElement("button");
    $(closeBtn).addClass("ml-2 mb-1 close").html("<span>&times;</span>");
    $(closeBtn).attr("data-dismiss", "toast");

    body = document.createElement("div");
    $(body).addClass("toast-body bg-light");

    header.appendChild(title);
    header.appendChild(timestamp);
    header.appendChild(closeBtn);

    root.appendChild(header);
    root.appendChild(body);

    return root;
}


////////////////////
// DATE FUNCTIONS //
////////////////////

/**
 * Converts a date to a unix timestamp
 * @param {date} d - Date
 * @returns {number} Unix timestamp
 */
function toUNIX(d) {
    return new Date(d).getTime() / 1000;
}

/**
 * Converts a unix timestamp to a date object
 * @param {(string | number)} t - Unix timestamp 
 * @returns {Date} Date
 */
function fromUNIX(t) {
    return new Date(t * 1000);
}

/**
 * Converts a date to an user friendly string including date and time
 * @param {Date} d 
 * @returns {string} String representation
 */
function singleDateTimeDisplay(d) {
    let date = new Date(d);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hour = date.getHours();
    min = date.getMinutes();
    return `${year}.${addLeadingZero(month)}.${addLeadingZero(day)} ${addLeadingZero(hour)}:${addLeadingZero(min)}`;
}

/**
 * Converts a date to an user friendly string including only date
 * @param {Date} d 
 * @returns {string} String representation
 */
function singleDateDisplay(d) {
    weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    let date = new Date(d);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    weekday = date.getDay();

    return `${weekdays[weekday]} ${addLeadingZero(day)}.${addLeadingZero(month)}.${year}`;
}

/**
 * Converts two dates to a user friendly string including date and time
 * @param {Date} d1 
 * @param {Date} d2 
 * @returns {string} String representation
 */
function doubleDateTimeDisplay(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    year1 = date1.getFullYear();
    month1 = date1.getMonth() + 1;
    day1 = date1.getDate();
    hour1 = date1.getHours();
    min1 = date1.getMinutes();

    year2 = date2.getFullYear();
    month2 = date2.getMonth() + 1;
    day2 = date2.getDate();
    hour2 = date2.getHours();
    min2 = date2.getMinutes();

    if (isSameDay(toUNIX(date1), toUNIX(date2))) {
        return `${addLeadingZero(day1)}.${addLeadingZero(month1)}.${year1} ${addLeadingZero(hour1)}:${addLeadingZero(min1)} - ${addLeadingZero(hour2)}:${addLeadingZero(min2)}`;
    }
    return `${addLeadingZero(day1)}.${addLeadingZero(month1)}.${year1} ${addLeadingZero(hour1)}:${addLeadingZero(min1)} - ${addLeadingZero(day2)}.${addLeadingZero(month2)}.${year2} ${addLeadingZero(hour2)}:${addLeadingZero(min2)}`;
}

/**
 * Converts two dates to a user friendly string including only date
 * @param {Date} d1 
 * @param {Date} d2 
 * @returns {string} String representation
 */
function doubleTimeDisplay(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    hour1 = date1.getHours();
    min1 = date1.getMinutes();

    year2 = date2.getFullYear();
    month2 = date2.getMonth() + 1;
    day2 = date2.getDate();
    hour2 = date2.getHours();
    min2 = date2.getMinutes();

    if (isSameDay(toUNIX(date1), toUNIX(date2))) {
        return addLeadingZero(hour1) + ":" + addLeadingZero(min1) + " - " + addLeadingZero(hour2) + ":" + addLeadingZero(min2);
    }
    return addLeadingZero(hour1) + ":" + addLeadingZero(min1) + " - " + addLeadingZero(day2) + "." + addLeadingZero(month2) + "." + year2 + " " + addLeadingZero(hour2) + ":" + addLeadingZero(min2);
}

/**
 * Formats date to only include date, month and year
 * @param {Date} d - Date to format
 * @returns {string} Date string `YYYY-MM-dd`
 */
function dateFormat(d) {
    let date = new Date(d);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    return year + "-" + month + "-" + day;
}

/**
 * Gets a timestamp in the 24H (DE) format including hours, minutes and seconds
 * @returns {string} Timestamp `HH:mm:ss`
 */
function timestampDE() {
    let date = new Date();
    hour = date.getHours();
    min = date.getMinutes();
    sec = date.getSeconds();
    return `${addLeadingZero(hour)}:${addLeadingZero(min)}:${addLeadingZero(sec)}`;
}

/**
 * Utitlity Function to add logging timestamp and type
 * @param {string} type - Log type
 * @returns {string} String for prepending
 */
function logPreface(type) {
    return `[${timestampDE()}] - ${type} -`;
}

/**
 * Checks if two dates are on the same day (ignoring time)
 * @param {Date} t1 - First date
 * @param {Date} t2 - Second date
 * @returns {boolean}
 */
function isSameDay(t1, t2) {
    date1 = fromUNIX(t1);
    date2 = fromUNIX(t2);
    return (
        date1.getFullYear() == date2.getFullYear() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getDate() == date2.getDate()
    );
}

/**
 * Checks whether date 1 is the day after date 2 (ignoring time)
 * @param {Date} t1 - First date
 * @param {Date} t2 - Second date
 * @returns {boolean}
 */
function isTomorrow(t1, t2) {
    date1 = fromUNIX(t1);
    date2 = fromUNIX(t2);
    date2.setDate(date2.getDate() + 1);
    return isSameDay(toUNIX(date1), toUNIX(date2));
}

/**
 * Add a leading zero to a number for date display
 * @param {number} number 
 * @returns {string} Number as string
 */
function addLeadingZero(number) {
    if (number < 10) {
        number = "0" + number;
    }
    return number;
}