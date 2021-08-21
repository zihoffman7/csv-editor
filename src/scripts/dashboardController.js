/////////////////////////////////////
// Canvas Tool
// 8-20-2021
// Luca Dovichi & Zachary Hoffman
// 
// Controls the dashboard, including
// some basic animations and page 
// controls for styling and layout.
/////////////////////////////////////

/////////////////////////////////////
// Config

const ANIMATION_TIME = 250 // default animation time in ms

/////////////////////////////////////
// Globals

/////////////////////////////////////
// Main

// onLoad()
// Basically this script's main function;
// this runs once the DOM is loaded and
// the page is ready to be manipulated.

function onLoad() {
    setTimeout( () => {
        showTools()
    })
}

/////////////////////////////////////
// Helpers

// setToolWidth()
// Takes the target width in pixels
// Animates the toolbar width to go
// to that specific width. Optional
// callback parameter which runs on
// animation completion, optional
// duration value, and the option
// to snap to its natural width 

function setToolWidth(width, callback = () => {}, duration = ANIMATION_TIME, fit=false) {
    if(fit) width = $("#tools").get(0).scrollWidth
    $("#tools").animate({
        "width": width
    }, duration, callback)
}

// hideTools()
// Hides the toolbar instantly

function hideTools() {
    setToolWidth(0, () => {}, 0)
}

function showTools() {
    setToolWidth(0, () => {}, 0, true)
}

/////////////////////////////////////
// Start

$(document).ready( () => {onLoad()})