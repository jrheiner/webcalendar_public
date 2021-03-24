# Webcalendar

---

* [Introduction](#Introduction)
    * Project structure
    * Enhanced Features
* [Compatibility](#Compatibility)
    * Operating System
    * Browsers
* [(Old) Issues](#Issues)
    * Code 0: Client configuration error
    * Unable to submit form
---

## Introduction

I built this webcalendar using HTML5, CSS3 and Javascript (ES6). External resources included are [Bootstrap](https://getbootstrap.com/) and [jQuery](https://jquery.com/). Icons/SVGs used are [Boostrap Icons](https://icons.getbootstrap.com/). Additionally, as the HTML input type `time` has really poor browser support, I am using [Clockpicker](http://weareoutman.github.io/clockpicker/) for time selection.

I use the database user `6177815` (my studentID). It's the default setting but you can change it on the home page under configuration.

### Project structure

```

src
|-- css
|    |-- vendor
|    |    |-- boostrap.min.css*
|    |    |-- bootstrap-clockpicker.min.css*
|    |-- calendar.css
|    |-- custom.css
|    |-- index.css
|    |-- list.css
|
|-- img
|    |-- favicon.ico*
|    |-- default
|    |    |-- 1_placeholder.png*
|    |    |...*
|    |    |-- 9_placeholder.png*
|
|-- js
|    |-- compressed
|    |    |-- calendar.min.js
|    |    |-- custom.min.js
|    |    |-- index.min.js
|    |    |-- list.min.js
|    |    |-- popup.min.js
|    |-- vendor
|    |    |-- boostrap.min.js*
|    |    |-- jquery-3.5.1.min.js*
|    |    |-- popperjs.min.js*
|    |    |-- bootstrap-clockpicker.min.js*
|    |-- calendar.js
|    |-- custom.js
|    |-- index.js
|    |-- list.js
|    |-- popup.js
|
|-- calendar.html
|-- index.html
|-- list.html
|-- ReadMe.md

Files marked with * are external resources and not created by me.
```

### Enhanced Features

* Monthly Calendar View, including multi-day events
* Event overview (List view) search-as-you-type function
* Event overview (List view) sorting
* User friendly form validation (including fileupload)<sup>1</sup>
* Dynamic and user defined categories
* Dynamic database user
* Ability to download an event as `.ics` file to save to an calendar application<sup>2</sup>
* Status badges to classify events
* Quicklink to Google Maps to easily find an event location

<sup>1</sup> *client-side only*  
<sup>2</sup> *[Valid ics file](https://icalendar.org/validator.html) working for Window 10 Calendar App.*

---

## Compatibility

The Webcalendar works without any problems using the following configurations. I included a local copy off all external resources, however an internet connection is still needed to access the Calendar API.

### Operating System

* Windows 10 Pro `Version 2004, Build 19041.338`
* Windows 10 Enterprise `Version 1809, Build 17763.1339`

### Browsers

* **Chrome `Version 84`**
* **Firefox `Version 79`**

* Edge `Version 84`

> The Event overview (List view) uses [`element.scrollIntoView(scrollIntoViewOptions)`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) and input `type="date"` which unfortunately are both **<ins>not yet supported by Safari</ins>**. See  [scrollIntoView](https://caniuse.com/#feat=mdn-api_element_scrollintoview_scrollintoviewoptions), [type="date"](https://caniuse.com/#feat=mdn-html_elements_input_input-date).


---

## Old Issues

Issues that occured during development and their fix.

### Code 0: Client configuration error
#### Failed to load resource: net::ERR_SSL_PROTOCOL_ERROR

This is an client side error and is most likely either caused by an Ad-/Scriptblocker or the security configuration of your browser.

To solve this issue
* You can try using another browser. See [Compatibility](#Compatibility)
* Use a Guest Profile. This allows you to browse with default browser settings without changing your configuration:
    * [Enabling the **Chrome** Guest Profile](https://support.google.com/chrome/answer/6130773)


### Unable to submit form
#### Form validation not working

Try "force reloading" the page. This should clear the cache and fix the issue.

To do this, use the following key combination depending on your Operation System:
* Windows: `ctrl + F5`
* Mac/Apple: `Apple + R` or `command + R`
* Linux: `F5`