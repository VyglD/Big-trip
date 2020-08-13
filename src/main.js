import TripInfoView from "./view/trip-info.js";
import TripCostView from "./view/trip-cost.js";
import MenuView from "./view/menu.js";
import FilterView from "./view/filters.js";
import SortView from "./view/sort.js";
import DaysListView from "./view/trip-days.js";
import TripDayView from "./view/trip-day.js";
import TripEventView from "./view/trip-event.js";
import TripEventEditView from "./view/trip-event-edit.js";
import {generateTripEvent} from "./mock/trip-event.js";
import {render, RenderPosition} from "./dom-util.js";
import {isEscEvent} from "./util.js";

const TRIP_EVENT_COUNT = 15;

const headerNode = document.querySelector(`.trip-main`);
const menuHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[1];
const bodyContainerNode = document.querySelector(`.trip-events`);
const sortHeaderNode = bodyContainerNode.querySelector(`.trip-events h2`);

const getTripEventsByDays = (tripPoints) => {
  const tripDays = new Map();

  for (const tripEvent of tripPoints) {
    const date = new Date(tripEvent.timeStart).setHours(0, 0, 0, 0);

    if (tripDays.has(date)) {
      tripDays.get(date).push(tripEvent);
    } else {
      tripDays.set(date, [tripEvent]);
    }
  }

  return tripDays;
};

const getTripEventElement = (tripEventData) => {
  const tripEventNode = new TripEventView(tripEventData).getElement();
  const tripEventEditNode = new TripEventEditView(tripEventData).getElement();

  const replacePointToForm = () => {
    tripEventNode.parentElement.replaceChild(tripEventEditNode, tripEventNode);
  };

  const replaceFormToPoint = () => {
    tripEventEditNode.parentElement.replaceChild(tripEventNode, tripEventEditNode);
  };

  const onEscKeyDown = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  tripEventNode
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      replacePointToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  tripEventEditNode
    .addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  return tripEventNode;
};

const tripEvents = new Array(TRIP_EVENT_COUNT)
  .fill()
  .map(generateTripEvent)
  .sort((a, b) => a.timeStart - b.timeStart);

const tripDays = getTripEventsByDays(tripEvents);

const tripInfoNode = new TripInfoView(tripEvents).getElement();
const tripCostNode = new TripCostView(tripEvents).getElement();
const daysListNode = new DaysListView().getElement();

tripInfoNode.append(tripCostNode);

for (let i = 0; i < tripDays.size; i++) {
  const date = Array.from(tripDays.keys())[i];

  const tripDay = new TripDayView(date, i + 1).getElement();
  const tripDayList = tripDay.querySelector(`#trip-events__list-${i + 1}`);

  for (const tripEventData of tripDays.get(date)) {
    tripDayList.append(getTripEventElement(tripEventData));
  }

  daysListNode.append(tripDay);
}

render(
    headerNode,
    tripInfoNode,
    RenderPosition.AFTERBEGIN
);
render(
    menuHeaderNode,
    new MenuView().getElement(),
    RenderPosition.AFTEREND
);
render(
    filtersHeaderNode,
    new FilterView().getElement(),
    RenderPosition.AFTEREND
);
render(
    sortHeaderNode,
    new SortView().getElement(),
    RenderPosition.AFTEREND
);
render(
    bodyContainerNode,
    daysListNode,
    RenderPosition.BEFOREEND
);
