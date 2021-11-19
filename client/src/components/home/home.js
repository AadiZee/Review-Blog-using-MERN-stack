import React, { useReducer, useEffect } from "react";
import { Grid } from "@material-ui/core";
import ArticleCard from "../../utils/articleCard/articleCard";
import { useDispatch, useSelector } from "react-redux";
import { getArticles } from "../../store/actions/articleActions/articleActions";
import Button from "@mui/material/Button";
import CarouselComponent from "../carousel";

const initialSort = { sortBy: "_id", order: "desc", limit: "3", skip: "0" };

const Home = () => {
  const [sort, setSort] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialSort
  );
  const articles = useSelector((state) => state.articles);
  const dispatch = useDispatch();

  //trigger only on first render
  useEffect(() => {
    if (articles && !articles.articles) {
      //dispatch
      dispatch(getArticles(initialSort));
    }
  }, [dispatch, articles]);

  return (
    <div>
      <div>
        <CarouselComponent />
      </div>
      <Grid container spacing={2} className="article_card">
        {articles && articles.articles
          ? articles.articles.map((item) => (
              <Grid key={item._id} item xs={12} sm={6} lg={3}>
                <ArticleCard key={item._id} article={item} />
              </Grid>
            ))
          : null}
      </Grid>
      <Button
        style={{ marginTop: "5px" }}
        variant="contained"
        color="success"
        onClick={() => {
          let skip = sort.skip + sort.limit;
          dispatch(getArticles({ ...sort, skip: skip }));
          setSort({ skip: skip });
        }}
      >
        Load More
      </Button>
    </div>
  );
};

export default Home;
