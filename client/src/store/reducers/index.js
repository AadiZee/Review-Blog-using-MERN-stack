import { combineReducers } from "redux";
import articles from "./articles/articles_reducer";
import users from "./users/users_reducer";
import site from "./site/site_reducer";
import notifications from "./notification/notification_reducer";

const appReducers = combineReducers({ articles, users, site, notifications });

export default appReducers;
