const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const hookTripsCatalog = () => {
    const listEl = document.getElementById('trips-list');
    const templateEl = document.getElementById('trip-card-template');
    const regionSelect = document.getElementById('region-filter');
    const seasonSelect = document.getElementById('season-filter');
    const loadingEl = document.getElementById('trips-loading');
    const errorEl = document.getElementById('trips-error');
    if (!listEl || !templateEl || !regionSelect || !seasonSelect) return;

    const loadTrips = async () => {
        loadingEl.hidden = false;
        errorEl.hidden = true;
        const query = new URLSearchParams();
        if (regionSelect.value !== 'all') query.set('region', regionSelect.value);
        if (seasonSelect.value !== 'all') query.set('season', seasonSelect.value);
        try {
            const response = await fetch(`/api/trips?${query}`);
            if (!response.ok) throw new Error(`Failed to load trips (${response.status})`);
            const { trips, regions, seasons } = await response.json();
            if (regionSelect.options.length === 1) regions.forEach((region) => regionSelect.add(new Option(capitalize(region), region)));
            if (seasonSelect.options.length === 1) seasons.forEach((season) => seasonSelect.add(new Option(capitalize(season), season)));
            const fragment = document.createDocumentFragment();
            trips.forEach((trip) => {
                const card = templateEl.content.cloneNode(true);
                card.querySelector('[data-field="name"]').textContent = trip.name;
                card.querySelector('[data-field="region"]').textContent = trip.region;
                card.querySelector('[data-field="start"]').textContent = trip.startStation;
                card.querySelector('[data-field="end"]').textContent = trip.endStation;
                card.querySelector('[data-field="duration"]').textContent = trip.duration;
                card.querySelector('[data-field="distance"]').textContent = `${trip.distance}km`;
                card.querySelector('[data-field="season"]').textContent = `Best in ${trip.bestSeason}`;
                card.querySelector('[data-field="description"]').textContent = trip.description;
                const highlights = card.querySelector('[data-field="highlights"]');
                trip.highlights.forEach((highlight) => { const tag = document.createElement('span'); tag.className = 'highlight-tag'; tag.textContent = highlight; highlights.appendChild(tag); });
                card.querySelector('[data-field="link"]').href = `/trips/${trip.id}`;
                fragment.appendChild(card);
            });
            listEl.replaceChildren(fragment);
            loadingEl.hidden = true;
        } catch (error) {
            loadingEl.hidden = true;
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load trips right now. Please try again in a moment.';
        }
    };
    regionSelect.addEventListener('change', loadTrips);
    seasonSelect.addEventListener('change', loadTrips);
    loadTrips();
};

const hookTripDetails = async () => {
    const detailsEl = document.getElementById('trip-details');
    const templateEl = document.getElementById('trip-details-template');
    const scheduleTemplateEl = document.getElementById('schedule-template');
    const loadingEl = document.getElementById('trip-loading');
    const errorEl = document.getElementById('trip-error');
    if (!detailsEl || !templateEl || !scheduleTemplateEl) return;
    const tripId = window.location.pathname.split('/').pop();
    try {
        const response = await fetch(`/api/trips/${tripId}`);
        if (!response.ok) throw new Error(`Failed to load trip (${response.status})`);
        const trip = await response.json();
        const content = templateEl.content.cloneNode(true);
        content.querySelector('[data-field="name"]').textContent = trip.name;
        content.querySelector('[data-field="description"]').textContent = trip.description;
        content.querySelector('[data-field="image"]').src = trip.imageUrl;
        content.querySelector('[data-field="image"]').alt = trip.name;
        ['region', 'duration'].forEach((field) => { content.querySelector(`[data-field="${field}"]`).textContent = trip[field]; });
        content.querySelector('[data-field="distance"]').textContent = `${trip.distance} km`;
        content.querySelector('[data-field="season"]').textContent = capitalize(trip.bestSeason);
        content.querySelector('[data-field="start"]').textContent = capitalize(trip.startStation);
        content.querySelector('[data-field="end"]').textContent = capitalize(trip.endStation);
        const highlights = content.querySelector('[data-field="highlights"]');
        trip.highlights.forEach((highlight) => { const tag = document.createElement('span'); tag.className = 'highlight-tag'; tag.textContent = highlight; highlights.appendChild(tag); });
        const months = content.querySelector('[data-field="months"]');
        trip.operatingMonths.forEach((month) => { const badge = document.createElement('span'); badge.className = 'month-badge'; badge.textContent = month; months.appendChild(badge); });
        const schedules = content.querySelector('[data-field="schedules"]');
        trip.schedules.forEach((schedule) => {
            const card = scheduleTemplateEl.content.cloneNode(true);
            card.querySelector('[data-field="departure"]').textContent = schedule.departureTime;
            card.querySelector('[data-field="arrival"]').textContent = schedule.arrivalTime;
            const days = card.querySelector('[data-field="days"]');
            schedule.daysOfWeek.forEach((day) => { const badge = document.createElement('span'); badge.className = 'day-badge'; badge.textContent = day.substring(0, 3); days.appendChild(badge); });
            card.querySelector('[data-field="link"]').href = `/trips/booking/${schedule.id}`;
            schedules.appendChild(card);
        });
        detailsEl.replaceChildren(content);
        loadingEl.hidden = true;
    } catch (error) {
        loadingEl.hidden = true;
        errorEl.hidden = false;
        errorEl.textContent = 'Unable to load this trip right now. Please try again in a moment.';
    }
};

const hookTrainsCatalog = async () => {
    const listEl = document.getElementById('trains-list');
    const templateEl = document.getElementById('train-card-template');
    const loadingEl = document.getElementById('trains-loading');
    const errorEl = document.getElementById('trains-error');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/trains');
        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        const payload = await response.json();
        const trains = payload.trains || [];
        const fragment = document.createDocumentFragment();

        trains.forEach((train) => {
            const card = templateEl.content.cloneNode(true);
            const imageEl = card.querySelector('[data-field="image"]');

            imageEl.src = train.imageUrl;
            imageEl.alt = train.imageAlt || `${train.name} train`;

            card.querySelector('[data-field="name"]').textContent = train.name;
            card.querySelector('[data-field="operator"]').textContent = train.operator;
            card.querySelector('[data-field="type"]').textContent = train.type;
            card.querySelector('[data-field="speed"]').textContent = `${train.maxSpeedKmh} km/h`;
            card.querySelector('[data-field="seats"]').textContent = `${train.capacity} seats`;
            card.querySelector('[data-field="power"]').textContent = train.powerSource;
            card.querySelector('[data-field="description"]').textContent = train.description;
            card.querySelector('[data-field="best-for"]').textContent = train.bestFor;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
        if (loadingEl) {
            loadingEl.hidden = true;
        }
    } catch (error) {
        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load trains right now. Please try again in a moment.';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    hookTrainsCatalog();
    hookTripsCatalog();
    hookTripDetails();
});
