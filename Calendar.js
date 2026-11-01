document.addEventListener('DOMContentLoaded', () => {
    // 1. EVENT ARRAY (MUST CHANGE INTO JSON FILE FOR SIMPLICITY)
    const SAMPLE_EVENTS = [
    { 
        title: 'Coding and Robotics Club Meeting', 
        date: '2026-11-06', 
        color: 'blue', 
        desc: 'Come to the computer lab to learn about 3d modeling and design your own figure or keychain! Your creations will be printed and distributed after the meeting.' 
    },
    { 
        title: 'Women in STEM Introductory Meeting', 
        date: '2026-11-05', 
        color: 'purple', 
        desc: 'This meeting is open for all students. This meeting will go over what we do and our plans for the year as well as introducing the other clubs.' 
    }
];

    let currentMonthTracker = moment().date(1); 
    let selectedDateTracker = null;

    // DOM ELEMENTS
    const monthYearDisplay = document.getElementById('month-year-display');
    const daysGrid = document.getElementById('days-grid');
    const prevBtn = document.getElementById('prev-month-btn');
    const nextBtn = document.getElementById('next-month-btn');
    const sidebarTitle = document.getElementById('active-date-title');
    const sidebarBody = document.getElementById('sidebar-events-list');

    // RENDER FUNCTION 
    function renderCalendar() {
        daysGrid.innerHTML = ''; // Clear prior grid layout
        monthYearDisplay.textContent = currentMonthTracker.format('MMMM YYYY');

        const firstDayIndex = currentMonthTracker.day();
        const dayOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
        const calendarIterator = currentMonthTracker.clone().subtract(dayOffset, 'days');

        // GRID MAPPING 
        for (let i = 0; i < 42; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            
            // HTML MARKUP FOR DAY NUMBERS
            dayCell.innerHTML = `<span class="day-number">${calendarIterator.format('DD')}</span><div class="dots-container"></div>`;

            const currentIterationString = calendarIterator.format('YYYY-MM-DD');
            dayCell.dataset.date = currentIterationString;

            // STYLE STATES
            if (calendarIterator.month() !== currentMonthTracker.month()) {
                dayCell.classList.add('other-month');
            }
            if (calendarIterator.isSame(moment(), 'day')) {
                dayCell.classList.add('is-today');
            }
            if (selectedDateTracker === currentIterationString) {
                dayCell.classList.add('is-selected');
            }

            const matchingEvents = SAMPLE_EVENTS.filter(ev => ev.date === currentIterationString);
            const dotsWrapper = dayCell.querySelector('.dots-container');
            
            matchingEvents.forEach(ev => {
                const dot = document.createElement('span');
                dot.className = `event-dot dot-${ev.color}`;
                dotsWrapper.appendChild(dot);
            });

            // CLICK LOGIC FOR CELLS
            dayCell.addEventListener('click', () => {
                document.querySelectorAll('.day-cell').forEach(c => c.classList.remove('is-selected'));
                dayCell.classList.add('is-selected');
                selectedDateTracker = currentIterationString;
                updateSidebar(currentIterationString, matchingEvents);
            });

            daysGrid.appendChild(dayCell);
            calendarIterator.add(1, 'days'); // ITERATOR ADVANCE FORWARD
        }
    }

    // SIDEBAR INTERFERANCE MAPPING
    function updateSidebar(dateString, events) {
        const formattedDate = moment(dateString).format('dddd, MMMM Do YYYY');
        sidebarTitle.innerHTML = `<h2>${formattedDate}</h2>`;

        if (events.length === 0) {
            sidebarBody.innerHTML = `<p class="no-events">No events scheduled for this day.</p>`;
            return;
        }

        sidebarBody.innerHTML = events.map(ev => `
            <div class="sidebar-event-card border-${ev.color}">
                <h3>${ev.title}</h3>
                <p>${ev.desc || 'No description provided.'}</p>
            </div>
        `).join('');
    }

    // NAV
    prevBtn.addEventListener('click', () => { currentMonthTracker.subtract(1, 'months'); renderCalendar(); });
    nextBtn.addEventListener('click', () => { currentMonthTracker.add(1, 'months'); renderCalendar(); });

    // INIT CALL
    renderCalendar();
});