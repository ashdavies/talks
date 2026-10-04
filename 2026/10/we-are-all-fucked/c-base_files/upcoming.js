function toDateString(date) {
  // YYYY-MM-DD
  return date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('upcoming');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'upcoming',
    noEventsText: 'Keine Veranstaltungen in den nächsten Tagen 😢',
    headerToolbar: false,
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    displayEventEnd: false,
    nextDayThreshold: '06:00:00',
    locale: 'de',
    height: 'auto',
    eventSources: [
      {
        events: window.c_base_events,
      }, 
      {
        events: window.c_base_regulars,
      }, 
      {
        events: window.c_base_seminars,
      }, 
      {
        events: window.c_base_online,
      },
    ],
    eventClick: function(info) {
      const calendarEvent = info.event;
      const date = toDateString(calendarEvent.start);
      const uid = calendarEvent.extendedProps.uid;
      window.location.href = '/calendar/#view=month&date=' + date + '&event=' + uid;
    },
    views: {
      upcoming: {
        type: 'list',
        listDayFormat: { weekday: 'long' },
        listDaySideFormat: { month: 'long', day: 'numeric', year: 'numeric' },
        duration: { days: 7 },
      },
    },
  });

  calendar.render();
});
