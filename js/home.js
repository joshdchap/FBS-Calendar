function EventItem(date, hour, comment) {
  this.date = date;
  this.hour = hour;
  this.comment = comment;
}

var all_items = [];
var thisHour;
var thisDate;

function isMatch(el) {
  return el.date == thisDate && el.hour == thisHour;
}

function findEventDeets(date, hour) {
  var thisMatch = findEvent(date, hour);
  if (thisMatch === undefined) {
    return "";
  } else {
    return thisMatch.comment;
  }
}

function findEvent(date, hour) {
  thisHour = hour;
  thisDate = date;
  var match = all_items.filter(isMatch);
  return match[0];
}

var $emptyTimeslot = $('<div class="event"></div>');
var $eventHeader = $('<div class="eventHeader"><span class="eventTime"></span><span class="button editEvent">edit</span></div>');
var $eventDetails = $('<div class="eventDetails"></div>');
var $eventDetailInput = $('<textarea class="eventInput"></textarea>');

function buildTimeSlot(hour24, date) {
  var hour = hour24;
  var meridian = "am";
  if (hour24 >= 12) {
    meridian = "pm";
  }
  if (hour24 > 12) {
    hour = hour24 - 12;
  }
  if (hour == 0) {
    hour = 12;
  }
  
  var $newHeader = $eventHeader.clone();
  $newHeader.find(".eventTime").append(hour + " " + meridian);
  var $newDetails = $eventDetails.clone().append(findEventDeets(date, hour24));
  var $newTimeSlot = $emptyTimeslot.clone().data("date", date).data("hour", hour24).append($newHeader).append($newDetails);

  return $newTimeSlot;
}

function buildSidebar(date) {
  if (date === undefined) {
    date = new Date();
    date = moment(date).format('YYYY-MM-DD');
  }

  var $header = $('<div class="sidebarHeader"></div>');
  $('#sidebar').html($header.append("Appointments for " + date));

  for (i = 0; i <= 23; i++) {
    $('#sidebar').append(buildTimeSlot(i, date));
  }
}

$(document).ready(function() {
  $('#calendar').fullCalendar();
  buildSidebar();

  $('#calendar').on(
    'click', '.fc-day, .fc-day-top', function(){
      buildSidebar($(this).data("date"));
    }
  );

  $('#sidebar').on(
    'click', '.editEvent', function() {
      var $edet = $(this).closest('.event').find('.eventDetails');
      $edet.html($eventDetailInput.clone().val($edet.text()));
      $(this).removeClass("editEvent").addClass("saveEvent").text("save");
    }
  );

  $('#sidebar').on(
    'click', '.saveEvent', function() {
      var $ev = $(this).closest('.event');
      var $edet = $ev.find('.eventDetails');
      var newEvent = $edet.find('.eventInput').val();
      $edet.html(newEvent);
      var saveEvent = findEvent($ev.data("date"), $ev.data("hour"))
      if (saveEvent === undefined) {
        all_items.push(new EventItem($ev.data("date"), $ev.data("hour"), newEvent));
      } else {
	saveEvent.comment = newEvent;
      }
      $(this).removeClass("saveEvent").addClass("editEvent").text("edit");
    }
  )
});
