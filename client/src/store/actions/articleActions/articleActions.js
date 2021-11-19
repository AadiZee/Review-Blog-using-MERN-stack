import * as articles from "../index";
import axios from "axios";
import { getAuthHeader } from "../../../utils/tools/tools";

axios.defaults.headers.post["Content-Type"] = "application/json";

export const getArticles = (sort) => {
  return async (dispatch, getState) => {
    try {
      const arts = await axios.post(`/api/articles/loadmore`, sort);
      const prevArts = getState().articles.articles;

      let newArts = [...arts.data];
      if (prevArts) {
        newArts = [...prevArts, ...arts.data];
      }

      dispatch(articles.getArticles(newArts));
    } catch (error) {
      dispatch(articles.errorGlobal("Error retrieving articles"));
    }
  };
};

export const getArticle = (id) => {
  return async (dispatch) => {
    try {
      const request = await axios.get(`/api/articles/get_by_id/${id}`);
      dispatch(articles.getArticle(request.data[0]));
    } catch (error) {
      dispatch(articles.errorGlobal(error.response.data.message));
    }
  };
};

export const addArticle = (article) => {
  return async (dispatch) => {
    try {
      const request = await axios.post(
        `/api/articles/admin/add_article`,
        article,
        getAuthHeader()
      );
      dispatch(articles.addArticle(request.data));
      dispatch(articles.successGlobal("Article Added Successfully!"));
    } catch (error) {
      dispatch(articles.errorGlobal(error.response.data.message));
    }
  };
};

export const getPaginateArticles = (page = 1, limit = 10, keywords = "") => {
  return async (dispatch) => {
    try {
      const request = await axios.post(
        `/api/articles/admin/paginate`,
        {
          keywords,
          page,
          limit,
        },
        getAuthHeader()
      );
      dispatch(articles.getPaginateArticle(request.data));
    } catch (error) {
      dispatch(articles.errorGlobal(error.response.data.message));
    }
  };
};

export const changeStatusArticle = (status, _id) => {
  return async (dispatch, getState) => {
    try {
      const article = await axios.patch(
        `/api/articles/admin/${_id}`,
        {
          status,
        },
        getAuthHeader()
      );
      let art = article.data;
      let state = getState().articles.adminArticles.docs;
      let position = state.findIndex((art) => art._id === _id);
      state[position] = art;

      dispatch(articles.updateArticleStatus(state));
      dispatch(articles.successGlobal("Status Changed"));
    } catch (error) {
      dispatch(articles.errorGlobal(error.response.data.message));
    }
  };
};

export const removeArticle = (id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/api/articles/admin/${id}`, getAuthHeader());
      dispatch(articles.removeArticle());
      dispatch(articles.successGlobal("Deleted"));
    } catch (error) {
      dispatch(articles.errorGlobal(error.response.data.message));
    }
  };
};

export const getAdminArticle = (id) => {
  return async (dispatch) => {
    try {
      const request = await axios.get(
        `/api/articles/admin/${id}`,
        getAuthHeader()
      );
      dispatch(articles.getArticle(request.data));
    } catch (error) {
      dispatch(articles.errorGlobal(error.response.data.message));
    }
  };
};

export const updateArticle = (article, id) => {
  return async (dispatch) => {
    try {
      const newArticle = await axios.patch(
        `/api/articles/admin/${id}`,
        article,
        getAuthHeader()
      );
      dispatch(articles.getArticle(newArticle.data));
      dispatch(articles.successGlobal("Article Updated!!!"));
    } catch (error) {
      dispatch(articles.errorGlobal(error.response.data.message));
    }
  };
};

export const getCategories = () => {
  return async (dispatch) => {
    try {
      const categories = await axios.get(`/api/articles/categories`);
      dispatch(articles.getCategories(categories.data));
    } catch (error) {
      dispatch(articles.errorGlobal("Error getting categories"));
    }
  };
};

export const addCategory = (values) => {
  return async (dispatch, getState) => {
    try {
      const category = await axios.post(
        `/api/articles/categories`,
        values,
        getAuthHeader()
      );

      let newState = [...getState().articles.categories, category.data];

      dispatch(articles.addCategory(newState));
      dispatch(articles.successGlobal("Category Added!"));
    } catch (error) {
      dispatch(articles.errorGlobal("Error adding category"));
    }
  };
};

export const getSearchNavResults = (page = 1, limit = 5, keywords = "") => {
  return async (dispatch) => {
    try {
      const request = await axios.post(`/api/articles/user/search`, {
        keywords,
        page,
        limit,
      });

      dispatch(articles.navSearch(request.data));
    } catch (error) {
      dispatch(articles.errorGlobal(error.response.data.message));
    }
  };
};
