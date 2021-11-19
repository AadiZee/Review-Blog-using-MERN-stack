const express = require("express");
const { checkLoggedIn } = require("../../../middleware/auth/auth");
const { grantAccess } = require("../../../middleware/roles/roles");
const { Article } = require("../../../models/articles/article_model");
const { sortArgsHelper } = require("../../../config/helpers/helpers");
const { Category } = require("../../../models/category/category_model");
require("dotenv").config();

let router = express.Router();

router
  .route("/admin/add_article")
  .post(
    checkLoggedIn,
    grantAccess("createAny", "article"),
    async (req, res) => {
      try {
        const article = new Article({
          ...req.body,
          score: parseInt(req.body.score),
        });
        const result = await article.save();
        res.status(200).json(result);
      } catch (error) {
        res.status(400).json({ message: "Error adding article", error: error });
      }
    }
  );

router
  .route("/admin/:id")
  .get(checkLoggedIn, grantAccess("readAny", "article"), async (req, res) => {
    try {
      const _id = req.params.id;
      const article = await Article.findById(_id);
      if (!article || article.length === 0) {
        return res.status(400).json({ message: "Article Not Found" });
      }
      res.status(200).json(article);
    } catch (error) {
      res.status(400).json({ message: "Error fetching article", error: error });
    }
  })
  .patch(
    checkLoggedIn,
    grantAccess("updateAny", "article"),
    async (req, res) => {
      try {
        const _id = req.params.id;
        const article = await Article.findOneAndUpdate(
          { _id },
          {
            $set: req.body,
          },
          { new: true }
        );
        if (!article)
          return res.status(400).json({ message: "Article Not Found" });

        res.status(200).json(article);
      } catch (error) {
        res
          .status(400)
          .json({ message: "Error updating article", error: error });
      }
    }
  )
  .delete(
    checkLoggedIn,
    grantAccess("deleteAny", "article"),
    async (req, res) => {
      try {
        const _id = req.params.id;
        const article = await Article.findByIdAndRemove(_id);
        if (!article)
          return res.status(400).json({ message: "Article Not Found" });

        res.status(200).json({ message: "Article Deleted" });
      } catch (error) {
        res
          .status(400)
          .json({ message: "Error Deleting Article", error: error });
      }
    }
  );

router
  .route("/admin/paginate")
  .post(checkLoggedIn, grantAccess("readAny", "articles"), async (req, res) => {
    try {
      // let aggQuery = Article.aggregate([
      //   { $match: { status: "public" } },
      //   { $match: { title: { $regex: /Somthing/ } } },
      // ]);

      let aggQuery;
      if (req.body.keywords != "") {
        const re = new RegExp(`${req.body.keywords}`, `gi`);
        aggQuery = Article.aggregate([{ $match: { title: { $regex: re } } }]);
      } else {
        aggQuery = Article.aggregate();
      }

      const limit = req.body.limit ? req.body.limit : 5;
      const options = {
        page: req.body.page,
        limit: limit,
        sort: { _id: "desc" },
      };
      const articles = await Article.aggregatePaginate(aggQuery, options);
      res.status(200).json(articles);
    } catch (error) {
      res.status(400).json({ message: "Error", error: error });
    }
  });

router.route("/get_by_id/:id").get(async (req, res) => {
  try {
    const _id = req.params.id;
    const article = await Article.find({ _id: _id, status: "public" }).populate(
      "category"
    );
    if (!article || article.length === 0)
      return res.status(400).json({ message: "Article Not Found" });
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ message: "Error fetching article", error: error });
  }
});

router.route("/loadmore").post(async (req, res) => {
  try {
    // {sortBy: "_id", order: "dsc", limit: "6", skip:"0"}

    let sortArgs = sortArgsHelper(req.body);
    const articles = await Article.find({ status: "public" })
      .populate("category")
      .sort([[sortArgs.sortBy, sortArgs.order]])
      .skip(sortArgs.skip)
      .limit(sortArgs.limit);

    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ message: "Error fetching articles", error: error });
  }
});

router
  .route("/categories")
  .get(async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(400).json({ message: "Error getting categories", error });
    }
  })
  .post(
    checkLoggedIn,
    grantAccess("createAny", "categories"),
    async (req, res) => {
      try {
        const category = new Category(req.body);
        await category.save();
        res.status(200).json(category);
      } catch (error) {
        res
          .status(400)
          .json({ message: "Error adding categories", error: error });
      }
    }
  );

router.route("/user/search").post(async (req, res) => {
  try {
    if (req.body.keywords == "") {
      return res.status(400).json({ message: "No empty search" });
    }

    const re = new RegExp(`${req.body.keywords}`, `gi`);
    let aggQuery = Article.aggregate([
      { $match: { status: "public" } },
      { $match: { title: { $regex: re } } },
    ]);

    const limit = req.body.limit ? req.body.limit : 5;
    const options = {
      page: req.body.page,
      limit,
      sort: { _id: "desc" },
    };

    const articles = await Article.aggregatePaginate(aggQuery, options);
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ message: "Error Searching Articles", error: error });
  }
});

module.exports = router;
