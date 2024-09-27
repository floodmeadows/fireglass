// ==UserScript==
// @namespace    https://openuserjs.org/users/floodmeadows
// @name         Fireglass
// @description  Adds shortcut buttons to Fieldglass to make it quicker and easier to fill in your timesheets
// @copyright    2020, floodmeadows (https://openuserjs.org/users/floodmeadows)
// @license      MIT
// @version      1.0
// @include      https://www.fieldglass.net/rate_schedule_time_sheet_form.do*
// @grant        none
// ==/UserScript==

// ==OpenUserJS==
// @author       floodmeadows
// ==/OpenUserJS==

(function() {
    'use strict';

    // Config variables
    var fullDayHours = 7;
    var fullDayMins = 30;
    var halfDayHours = 3;
    var halfDayMins = 45;
    var buttonStyle = "margin: 0px 2px 4px; padding: 0px 2px; min-width: 30%; height: 22px; background-color: #ccf; border: 0px;";
    var weekButtonStyle = " width: 80%; margin: 4px auto;";
    var dayButtonsContainerStyle = "display:inline-block; width:2.4em; vertical-align:top;";

    // derived / combined config values
    var fullWeekText = fullDayHours + ":" + fullDayMins + " every working day";
    var nonWeekText = "0:00 every day";
    var noneDayText = "0:00";
    var halfDayText = halfDayHours + ":" + halfDayMins;
    var fullDayText = fullDayHours + ":" + fullDayMins;

    // add buttons to set values for the whole week
    var weekButtons = document.createElement('div');

    var fillAllLink = document.createElement('button');
    fillAllLink.textContent = fullWeekText;
    fillAllLink.setAttribute('style', buttonStyle + weekButtonStyle);

    var clearAllLink = document.createElement('button');
    clearAllLink.textContent = nonWeekText;
    clearAllLink.setAttribute('style', buttonStyle + weekButtonStyle);

    weekButtons.appendChild(fillAllLink);
    weekButtons.appendChild(clearAllLink);

    // Work out if we're on the first page (with the "billable header row")
    // or the second page (for non-working days and holiday etc.)
    // and add the "full week" and "none week" buttons to the correct table cell(s)
    if(document.getElementsByClassName('billableHeader').length > 0) {
        document.querySelectorAll("tr.hoursWorked > td.name").forEach(
            function(val, index, listObj) {
                val.appendChild(weekButtons.cloneNode(true));
            });
    } else {
        document.querySelectorAll("td.wordBreakAll").forEach(
            function(val, index, listObj) {
                val.appendChild(weekButtons.cloneNode(true));
            });
    }

    // Add buttons to control each day
    var dayButtons = document.createElement('div');
    dayButtons.style = dayButtonsContainerStyle;

    var fullDayButton = document.createElement('button');
    fullDayButton.innerHTML = fullDayText;
    fullDayButton.setAttribute('style', buttonStyle);

    var halfDayButton = document.createElement('button');
    halfDayButton.innerHTML = halfDayText;
    halfDayButton.setAttribute('style', buttonStyle);

    var noneDayButton = document.createElement('button');
    noneDayButton.innerHTML = noneDayText;
    noneDayButton.setAttribute('style', buttonStyle);

    dayButtons.appendChild(fullDayButton);
    dayButtons.appendChild(halfDayButton);
    dayButtons.appendChild(noneDayButton);

    document.querySelectorAll("td.hoursWorked").forEach(
         function(currentValue, currentIndex, listObj) {
             currentValue.insertBefore(dayButtons.cloneNode(true), currentValue.childNodes[0]);
         });

    function fillAllWorkingDays(el) {
        el.parentElement.parentElement.parentElement.querySelectorAll('td.hoursWorked:not(.nonWorkingDay) > input.hour').forEach(function(val,index,listObj){
            val.value = fullDayHours;
        });
        el.parentElement.parentElement.parentElement.querySelectorAll('td.hoursWorked:not(.nonWorkingDay) > input.min').forEach(function(val,index,listObj){
            val.value = fullDayMins;
        });
    }

    function clearAllDays(el) {
        el.parentElement.parentElement.parentElement.querySelectorAll('td.hoursWorked > input.hour').forEach(function(val,index,listObj){
            val.value = 0;
        });
        el.parentElement.parentElement.parentElement.querySelectorAll('td.hoursWorked > input.min').forEach(function(val,index,listObj){
            val.value = 0;
        });
    }

    function fillDay(element, hours, mins) {
        element.parentElement.parentElement.querySelector('td.hoursWorked > input.hour').value = hours;
        element.parentElement.parentElement.querySelector('td.hoursWorked > input.min').value = mins;
    }

    document.querySelectorAll("tr.hoursWorked, tr.ratesEntry").forEach(
        function(currentValue, currentIndex, listObj) {
            currentValue.addEventListener("click", function(event){
                var element = event.target;
                if(element.innerHTML == fullWeekText) {
                    fillAllWorkingDays(element);
                } else if(element.innerHTML == nonWeekText) {
                    clearAllDays(element);
                } else if(element.innerHTML == fullDayText) {
                    fillDay(element, fullDayHours, fullDayMins);
                } else if(element.innerHTML == halfDayText) {
                    fillDay(element, halfDayHours, halfDayMins);
                } else if(element.innerHTML == noneDayText) {
                    fillDay(element, 0, 0);
                }
                event.preventDefault();
            });
        });

})();
