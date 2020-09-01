import MenuView from "./view/menu.js";
import StatisticsView from "./view/statistics.js";
import TripPresenter from "./presenter/trip.js";
import FiltersPreseter from "./presenter/filters.js";
import InformationPresenter from "./presenter/information.js";
import PointsModel from "./model/points.js";
import FiltersModel from "./model/filters.js";
import {generatePoints} from "./mock/point.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {FilterType, MenuItem} from "./data.js";

const POINTS_COUNT = 15;

const headerNode = document.querySelector(`.trip-main`);
const menuHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[0];
const filtersHeaderNode = headerNode.querySelectorAll(`.trip-controls h2`)[1];
const boardContainerNode = document.querySelector(`.trip-events`);
const newPointButton = headerNode.querySelector(`.trip-main__event-add-btn`);

const newPointButtonClickHandler = (evt) => {
  evt.preventDefault();
  handleMenuClick(MenuItem.NEW_POINT);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

const newPointFormCloseHandler = () => {
  newPointButton.disabled = false;
};

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_POINT:
      remove(statisticsComponent);
      tripPresenter.destroy();
      filtersModel.setFilter(FilterType.EVERYTHING);
      tripPresenter.init();
      tripPresenter.createPoint(newPointFormCloseHandler);
      newPointButton.disabled = true;
      break;
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView();
      render(boardContainerNode, statisticsComponent, RenderPosition.AFTEREND);
  }
};

const points = new Array(POINTS_COUNT).fill().map(generatePoints);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);
const filtersModel = new FiltersModel();

const siteMenuComponent = new MenuView();
let statisticsComponent = null;

render(
    menuHeaderNode,
    siteMenuComponent,
    RenderPosition.AFTEREND
);

const filtersPreseter = new FiltersPreseter(filtersHeaderNode, pointsModel, filtersModel);
const tripPresenter = new TripPresenter(boardContainerNode, pointsModel, filtersModel);
const informationPresenter = new InformationPresenter(headerNode, pointsModel, filtersModel);

newPointButton.addEventListener(`click`, newPointButtonClickHandler);
siteMenuComponent.setMenuItemClickHandler(handleMenuClick);

informationPresenter.init();
tripPresenter.init();
filtersPreseter.init();

