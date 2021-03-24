/* jshint esversion: 6 */

console.info(`${logPreface("JS")} popup.js loaded`);

/**
 * Update modal content when opening
 */
$(function () {
    /**
     * Update deletion modal content to fit for selected event
     */
    $("#modal-delete").on("show.bs.modal", function (event) {
        let button = $(event.relatedTarget);
        let name = button.data("name");
        let timeS = button.data("start");
        let timeE = button.data("end");
        let organizer = button.data("organizer");
        let id = button.data("id");
        let modal = $(this);

        console.log(`${logPreface("EVENT")} Delete confirmation: ${name}`);

        modal.find(".modal-title").html(`Delete <i>${name}</i>?`);
        modal
            .find("#delete-event")
            .html(`<b>Name:</b> ${name}<span class='text-muted'> (Id: ${id})</span>`);
        modal
            .find("#delete-time")
            .html(`<b>Time:</b> ${doubleDateTimeDisplay(timeS, timeE)}`);
        modal
            .find("#delete-organizer")
            .html(`<b>Organizer:</b> ${organizer}`);
        modal
            .find("#delete-confirm")
            .off("click")
            .on("click", function () {
                $("#modal-delete").modal("hide");
                deleteEvent(id).then(function () {
                    getEvents().then(function (data) {
                        try {
                            initListOfEvents(data, "new", true);
                        } catch (ReferenceError) {
                            $("#eventListModal").trigger("event:change");
                            $("#calendar-root").trigger("event:change");
                        }
                    }).catch(function (e) {
                        console.warn(e);
                    });
                }).catch(function (e) {
                    $("#modal-delete").modal("hide");
                    console.warn(e);
                });
            });
    });

    /**
     * Update details modal for selected event
     */
    $("#modal-details").on("show.bs.modal", function (event) {
        let button = $(event.relatedTarget);
        let id = button.data("id");
        let modal = $(this);

        console.log(`${logPreface("EVENT")} Show details: id=${id}`);


        getEventsDetails(id).then(function (data) {
            let title = data.title;
            let start = data.start;
            let end = data.end;
            let organizer = ` <a href="mailto:${data.organizer}">${data.organizer}</a>`;
            let location = data.location ? `${data.location} <a href="http://maps.google.com/?q=${data.location}" target="_blank" rel="noopener">(Search on Google Maps)</a>` : "No location available.";
            let status = data.status;
            //let allday = data.allday;
            let webpage = data.webpage ? `<a href="${data.webpage}">${data.webpage}</a>` : "No webpage available.";
            let imageurl = data.imageurl || `img/default/${getDefaultImage()}_placeholder.png`;
            let categories = data.categories;
            let extra = data.extra || "No description available";

            switch (status) {
                case "Busy":
                    status = `<h4><span class="badge status-blue striped">Busy</span></h4>`;
                    break;
                case "Tentative":
                    status = `<h4><span class="badge status-blue stripes">Tentative</span></h4>`;
                    break;
                case "Free":
                    status = `<h4><span class="badge status-purple stripes">Free</span></h4>`;
                    break;
                default:
                    status = `<h4><span class="badge badge-warning">No status</span></h4>`;
                    break;
            }

            modal.find(".modal-title").html(`<i>${title}</i> details`);

            modal.find(".card-title").text(title);
            modal
                .find("#modal-details-time")
                .html(`${doubleDateTimeDisplay(start, end)}&emsp;${status}`);

            modal.find("#popup-modal-img").attr("src", imageurl);
            modal
                .find("#modal-details-org-loc")
                .html(
                    `Organized by <i>${organizer}</i>, Location: <i>${location}</i>`
                );
            modal
                .find("#modal-details-web")
                .html(webpage);
            modal.find("#modal-details-extra").text(extra);
            let categoryString = "";
            if (categories.length) {
                categories.forEach((element) => {
                    categoryString = `${categoryString}<span class='badge badge-pill badge-secondary'> ${element.name}</span> `;
                });
            } else {
                categoryString = "No categories assigned.";
            }
            modal
                .find("#modal-details-category")
                .html(categoryString);

            let icsStart = new Date(start).toISOString().replace(/-|:|\.|Z/gi, "").slice(0, -3);
            let icsEnd = new Date(end).toISOString().replace(/-|:|\.|Z/gi, "").slice(0, -3);

            modal
                .find("#download-ics")
                .attr("href", `data:text/calendar;charset=utf8,${escape(createICSString(id, title, data.organizer, data.webpage, data.location, extra, icsStart,icsEnd))}`).attr("download", `${title}.ics`);
        }).catch(function (e) {
            console.warn(e);
        });
    });

    /**
     * Update form modal depending on action (add or edit) and selected event
     */
    $("#modal-edit").on("show.bs.modal", function (event) {
        let isNewEvent;
        $("#editForm").removeClass("was-validated");
        $("#editForm")[0].reset();
        if ($(".custom-file-label").text() != "Choose file...") {
            $(".custom-file-label").text("Choose file...");
        }
        $("#form-fileupload-preview").attr("src", `img/default/${getDefaultImage()}_placeholder.png`);
        $("#fileupload-feedback").html("");
        $("#fileupload-delete").css("display", "none");

        let button = $(event.relatedTarget);
        let modal = $(this);
        let id = button.data("id") || "";

        if (id == "") {
            isNewEvent = true;
            $("#edit-form-save").html('Add event').prop("disabled", false);
            modal.find(".modal-title").html("Add new event");
            console.log(`${logPreface("EVENT")} Add event modal`);

            let now = new Date();
            modal.find("#input-start-date").val(now.toISOString().substring(0, 10));
            modal.find("#input-end-date").val(now.toISOString().substring(0, 10));
            now.setHours(now.getHours() + 1);
            modal.find("#input-start-time").val(`${now.getHours()}:00`);
            now.setHours(now.getHours() + 1);
            modal.find("#input-end-time").val(`${now.getHours()}:00`);

            getCategoriesForEvent("");
        } else {
            getEventsDetails(id).then(function (data) {
                let title = data.title;
                let start = data.start;
                let end = data.end;
                let organizer = data.organizer;
                let location = data.location;
                let status = data.status;
                //let allday = data.allday;
                let imageurl = data.imageurl;
                let webpage = data.webpage;
                let categories = data.categories;
                let extra = data.extra;

                $("#fileupload-delete").attr("data-id", id);
                $("#edit-form-save").html('Save edits').prop("disabled", false);
                modal.find(".modal-title").html(`Edit <i>${title}</i> details`);
                console.log(`${logPreface("EVENT")} Edit modal: ${title}`);
                modal.find("#input-title").val(title);
                modal.find("#input-location").val(location);
                modal.find("#input-organizer").val(organizer);
                modal.find("#input-start-date").val(start.substring(0, 10));
                modal.find("#input-end-date").val(end.substring(0, 10));
                modal.find("#input-start-time").val(`${addLeadingZero(new Date(start).getHours())}:${addLeadingZero(new Date(start).getMinutes())}`);
                modal.find("#input-end-time").val(`${addLeadingZero(new Date(end).getHours())}:${addLeadingZero(new Date(end).getMinutes())}`);

                if (imageurl != null) {
                    $("#fileupload-delete").css("display", "block");
                    $("#form-fileupload-preview").attr("src", imageurl);
                    let path = imageurl.split(/[\/ ]+/).pop();
                    $(".custom-file-label").text(path);
                }
                modal.find("#input-web").val(webpage);
                modal.find("#input-status").val(status);
                getCategoriesForEvent(categories);
                modal.find("#form-textarea").val(extra);
            }).catch(function (e) {
                console.warn(e);
            });
        }


        // DELETE IMAGE
        $("#fileupload-delete").off("click").on("click", function (event) {
            let eventId = $(event.target).data("id");
            $(this).prop("disabled", true);
            deleteImageFromEvent(eventId).then(function () {
                $(".custom-file-label").text("Choose file...");
                $("#form-fileupload-preview").attr("src", `img/default/${getDefaultImage()}_placeholder.png`);
                $(`#event-${eventId}`).find("img").attr("src", `img/default/${getDefaultImage()}_placeholder.png`);
                $("#fileupload-delete").trigger("mouseleave");
                $("#fileupload-delete").css("display", "none");
                $("#fileupload-delete").prop("disabled", false);
            }).catch(function (e) {
                console.warn(e);
                $("#fileupload-delete").prop("disabled", false);
            });
        });

        $(function () {
            $("#fileupload-delete").hover(function () {
                $("#form-fileupload-preview").css("border-color", "#dc3545");
                $("#form-fileupload-preview").css("opacity", "0.5");
            }, function () {
                $("#form-fileupload-preview").css("border-color", "#dee2e6");
                $("#form-fileupload-preview").css("opacity", "1");
            });
        });



        // SUBMIT FORM
        $("#edit-form-save").off("click").on("click", function () {
            $("#edit-form-submit").trigger("click");
            if (($("#editForm")[0].checkValidity() === true)) {
                $(this).html(`Adding event <div class="spinner-border spinner-border-sm" role="status">`);
                $(this).prop("disabled", true);

                // https://stackoverflow.com/questions/17710147/image-convert-to-base64
                let file = document.querySelector("input[type=file]").files[0];
                let fileReader = new FileReader();
                let imagedata;
                fileReader.onloadend = function () {
                    imagedata = fileReader.result;
                    if (isNewEvent) {
                        initAddEvent(imagedata);
                    } else {
                        initEditEvent(id, imagedata);
                    }
                };
                if (file != undefined) {
                    fileReader.readAsDataURL(file);
                } else {
                    if (isNewEvent) {
                        initAddEvent();
                    } else {

                        initEditEvent(id);
                    }
                }
            }
        });
    });
});

/**
 * Initiate adding a new event
 * @param {(string | null)} fileData - Base64 Imagedata, optional
 */
function initAddEvent(fileData = null) {
    let JSONdata = formToJson($("#editForm"), fileData);
    addEvent(JSONdata).then(function () {
        $(this).html('Add event');
        $(this).prop("disabled", true);
        $("#modal-edit").modal("hide");
        getEvents().then(function (data) {
            try {
                initListOfEvents(data, "new", true);
            } catch (ReferenceError) {
                $("#calendar-root").trigger("event:change");
            }
        }).catch(function (e) {
            console.warn(e);
        });
    }).catch(function (e) {
        console.warn(e);
        $(this).html('Add event');
        $(this).prop("disabled", false);
        $("#modal-edit").modal("hide");
    });
}

/**
 * Initiate updating an existing event
 * @param {number} id - Id of the event
 * @param {(string | null)} fileData - Base64 Imagedata, optional
 */
function initEditEvent(id, fileData = null) {
    let JSONdata = formToJson($("#editForm"), fileData);
    editEvent(JSONdata, id).then(function () {
        $(this).html('Save');
        $(this).prop("disabled", true);
        $("#modal-edit").modal("hide");
        getEvents().then(function (data) {
            try {
                initListOfEvents(data, "new", true);
            } catch (ReferenceError) {
                $("#eventListModal").trigger("event:change");
                $("#calendar-root").trigger("event:change");
            }
        }).catch(function (e) {
            console.warn(e);
        });
    }).catch(function (e) {
        console.warn(e);
        $(this).html('Save');
        $(this).prop("disabled", false);
        $("#modal-edit").modal("hide");
    });
}

/**
 * Initialse form validation handler
 */
$(function () {
    $(function () {
        // Default HTML5 input type validation
        let form = document.getElementById("editForm");
        form.addEventListener(
            "submit",
            function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add("was-validated");
            },
            false
        );
    });

    // Custom validation to handle images
    $(".custom-file-input").on("change", function () {
        let preview = $("#form-fileupload-preview");
        let file = document.querySelector('input[type=file]').files;
        validImageTypes = ["image/jpeg", "image/png"];
        let isValidType = $.inArray(file[0].type, validImageTypes) > -1;
        let isValidSize = file[0].size < 500000;
        if (file && file[0] && isValidSize && isValidType) {
            let reader = new FileReader();
            reader.onload = function (data) {
                $("#fileupload-feedback").html(`<span class="text-success font-italic">Valid file. <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-file-earmark-check-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M2 3a2 2 0 0 1 2-2h5.293a1 1 0 0 1 .707.293L13.707 5a1 1 0 0 1 .293.707V13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3zm7 2V2l4 4h-3a1 1 0 0 1-1-1zm1.854 2.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
              </svg><br>${file[0].type}, ${Number(file[0].size / 1000)}kb</span>`);
                $("#form-fileupload")[0].setCustomValidity(""); // "" => valid
                preview.attr("src", data.target.result);
            };
            reader.readAsDataURL(file[0]);
        } else {
            $("#fileupload-feedback").html(`<span class='text-danger font-italic'>Invalid file. <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-file-earmark" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 1h5v1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6h1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"/>
            <path d="M9 4.5V1l5 5h-3.5A1.5 1.5 0 0 1 9 4.5z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg><br>${file[0].type}, ${Number(file[0].size / 1000)}kb</span>`);
            $("#form-fileupload")[0].setCustomValidity("Invalid file.");
            preview.attr("src", `img/default/${getDefaultImage()}_placeholder.png`);
        }
        let fileName = $(this).val().split("\\").pop();
        $(this)
            .siblings(".custom-file-label")
            .addClass("selected")
            .html(fileName);
        $("#fileupload-delete").css("display", "none");
    });
});

/**
 * Validate start and end dates for an event, and mark the form fields as valid or invalid
 */
function validateEventDate() {
    let startValid = true;
    let endValid = true;
    let now = new Date();
    let start = document.getElementById("input-start-date");
    let end = document.getElementById("input-end-date");
    let startDate = new Date(start.value);
    let endDate = new Date(end.value);

    validateEventTime();

    if (startDate > endDate) {
        end.setCustomValidity("Invalid start date");
        $("#input-end-date-feedback").html("End date can not be earlier then start date!");
        endValid = false;
    }
    if (startDate < now && (new Date(startDate.toDateString()).valueOf() != new Date(now.toDateString()).valueOf())) {
        start.setCustomValidity("Invalid start date");
        $("#input-start-date-feedback").html("Start date can not be in the past!");
        startValid = false;
    }
    if (endDate < now && (new Date(endDate.toDateString()).valueOf() != new Date(now.toDateString()).valueOf())) {
        end.setCustomValidity("Invalid end date");
        $("#input-end-date-feedback").html("End date can not be in the past!");
        endValid = false;
    }

    if (startValid) {
        start.setCustomValidity("");
        $("#input-start-date-feedback").html("");
    }
    if (endValid) {
        end.setCustomValidity("");
        $("#input-end-date-feedback").html("");
    }
}

/**
 * Validate start and end dates for an event, and mark the form fields as valid or invalid
 */
function validateEventTime() {
    let startValid = true;
    let endValid = true;
    let start = document.getElementById("input-start-time");
    let end = document.getElementById("input-end-time");
    let startTime = new Date(`2020-01-01T${start.value}:00`);
    let endTime = new Date(`2020-01-01T${end.value}:00`);

    let startDate = new Date(document.getElementById("input-start-date").value);
    let endDate = new Date(document.getElementById("input-end-date").value);
    let sameday = isSameDay(startDate, endDate);

    if (startTime > endTime && sameday) {
        end.setCustomValidity("Invalid end time");
        $("#input-end-time-feedback").html("End time can not be earlier then start time!");
        endValid = false;
    }

    if (startValid) {
        start.setCustomValidity("");
        $("#input-start-time-feedback").html("");
    }
    if (endValid) {
        end.setCustomValidity("");
        $("#input-end-time-feedback").html("");
    }
}