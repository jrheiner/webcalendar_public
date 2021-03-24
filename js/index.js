/* jshint esversion: 6 */

console.info(`${logPreface("JS")} index.js loaded`);

var categoryColoumn = 0;

$(function () {

    initCategoryList();

    /**
     * Enable boostrap tooltips
     */
    $('[data-toggle="tooltip"]').tooltip();

    /**
     * Set default values
     */
    $("#database-user").val(getDatabaseUser());
    $($(".img-preview")[getDefaultImage() - 1]).addClass("img-preview-selected");

    /**
     * Saves the selected default image to local storage
     */
    $(".img-preview").on("click", function () {
        $(".img-preview").removeClass("img-preview-selected");
        $(this).addClass("img-preview-selected");
        setDefaultImage($(this).attr("src").split("_")[0].split("/")[2]);
    });

    /**
     * Initiates adding a new category. Category is only added if it has a unique name.
     */
    $("#btn-add-category").on("click", function () {
        let input = $("#input-add-category").val();
        if (isUniqueCategory(input) && input.length > 0) {
            addCategory(input);
            $("#input-add-category").val("");
        }
    });

    /**
     * Resets the database user change modal upon opening.
     */
    $("#change-user").on("show.bs.modal", function () {
        $("#modal-database-user").val(getDatabaseUser());
        $("#confirm-user-change").prop('disabled', true);
    });

    /**
     * Only allows submitting if the input field is filled out.
     */
    $("#modal-database-user").keyup(function () {
        if ($(this).val().length > 0) {
            $("#confirm-user-change").prop('disabled', false);
        } else {
            $("#confirm-user-change").prop('disabled', true);
        }
    });

    /**
     * Submit Handler for the database user change modal.
     */
    $("#confirm-user-change").click(function () {
        setDatabaseUser($("#modal-database-user").val());
        $("#change-user").modal("hide");
        location.reload();
    });
});

/**
 * Adds a category and appends it to the category list.
 * @param {string} name - Name of the new category
 */
function addCategory(name) {
    createCategory(name).then(function (data) {
        let newCategory = buildListElement(data.id, name);
        categoryColoumn++;
        $(`#category-list-${categoryColoumn % 3}`).append(newCategory);
        $("#category-count").text(categoryColoumn);
    }).catch(function (e) {
        console.warn(e);
    });
}

/**
 * Builds a single list element for the category list. Including an delete button.
 * @param {(number|string)} id - Id of the category
 * @param {string} name - Name of the category
 * @returns {HTMLLIElement} HTML Node / Element
 */
function buildListElement(id, name) {
    let element = document.createElement("li");
    $(element).addClass("list-group-item d-flex justify-content-between align-items-center");
    $(element).text(name);
    let button = document.createElement("button");
    $(button).addClass("btn btn-outline-danger btn-sm");
    $(button).html(`<svg width="16px" height="16px" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
  </svg>`);
    $(button).attr("onclick", `removeCategory(${id})`);

    element.appendChild(button);

    return element;
}

/**
 * Initialisies the category list.
 */
function initCategoryList() {
    $("#category-list-0").empty();
    $("#category-list-1").empty();
    $("#category-list-2").empty();

    getCategories().then(function (data) {
        setConnectionStatus("connected");
        data.forEach((category) => {
            categoryColoumn++;
            let newCategory = buildListElement(category.id, category.name);
            $(`#category-list-${categoryColoumn % 3}`).prepend(newCategory);
        });
        $("#category-count").text(categoryColoumn);
    }).catch(function (e) {
        setConnectionStatus("error");
        console.warn(e);
    });
}

/**
 * Deletes a category and reloads the category list.
 * @param {(number|string)} id - Id of the category which should be deleted
 */
function removeCategory(id) {
    categoryColoumn = 0;
    deleteCategory(id).then(function () {
        initCategoryList();
    }).catch(function (e) {
        console.warn(e);
    });
}

/**
 * Checks if a category name is already displayed in the category list.
 * @param {string} name - Category name that should be checked
 * @returns {boolean} Whether name is unique or not
 */
function isUniqueCategory(name) {
    let unique = true;
    for (let i = 0; i < 3; i++) {
        $("#category-list-" + i).children().filter(function () {
            if ($(this).text().trim().toLowerCase() === name.trim().toLowerCase()) {
                let duplicate = $(this);
                duplicate.addClass("impulse");
                setTimeout(function () {
                    duplicate.removeClass("impulse");
                }, 2000);
                unique = false;
            }
        });
    }
    return unique;
}

/**
 * Sets the style of the connection status indicator on the home page.
 * @param {string} status - Connection status, values: `connected` `error`
 */
function setConnectionStatus(status) {
    let indicator = $("#connection-status");
    if (status == "connected") {
        indicator.removeClass("text-danger text-warning");
        indicator.addClass("text-success");
    } else if (status == "error") {
        indicator.removeClass("text-success text-warning");
        indicator.addClass("text-danger");
    } else {
        indicator.removeClass("text-danger text-success");
        indicator.addClass("text-warning");
    }
}