function LineItem(date, hour, comment) {
  this.date = date;
  this.hour = hour;
  this.comment = comment;
}

function findApptDeets(date, hour) {
  return "details";
}

all_items = [];

var $emptyTimeslot = $('<div class="event"></div>');
var $eventHeader = $('<div class="emptyHeader"><span class="eventTime"></span><span class="button editEvent">Edit</span></div>');
var $eventDetails = $('<div class="eventDetails"></div>');

function buildTimeSlot(hour24, date) {
  var hour = hour24;
  if (hour24 > 12) {
    hour = hour24 - 12
  }
  if (hour == 0) {
    hour = 12;
  }
  
  var $newHeader = $eventHeader.clone().find(".eventTime").append(hour);
  var $newDetails = $eventDetails.clone().append(findApptDeets(date, hour));
  var $newTimeSlot = $emptyTimeslot.clone().data("date", date).data("hour", hour24).append($newHeader).append($newDetails);

  return $newTimeSlot;
}

function buildSidebar(date) {
  if (date === undefined) {
    date = new Date();
    date = moment(date).format('YYYY-MM-DD');
  } 
  for (i = 0; i <= 23; i++) {
    $('#sidebar').append(buildTimeSlot(i, date));
  }
}

$(document).ready(function() {
  $('#calendar').fullCalendar();
  buildSidebar();

  $(".fc-day").on({
    click: function(){
      alert($(this).data("date"));
    }
  });
});
