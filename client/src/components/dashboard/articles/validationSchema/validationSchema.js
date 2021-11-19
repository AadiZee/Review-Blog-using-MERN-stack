import * as Yup from "yup";

export const formValues = {
  title: "",
  content: "",
  excerpt: "",
  score: "",
  director: "",
  actors: [],
  status: "draft",
  category: "",
};

export const validation = () =>
  Yup.object({
    title: Yup.string().required("Sorry the title is required"),
    content: Yup.string()
      .required("Sorry the content is required")
      .min(50, "That is it ? ...write some more"),
    excerpt: Yup.string()
      .required("Sorry the excerpt is required")
      .max(250, "Sorry its 250 max"),
    score: Yup.number()
      .required("Sorry the score is required")
      .min(0, "0 is the minimum")
      .max(100, "100 is the max"),
    director: Yup.string().required("Sorry the director is required"),
    actors: Yup.array().required("Must have actors").min(2, "Minimum is 2"),
    status: Yup.string().required("Sorry the status is required"),
    category: Yup.string().required("Sorry, the category is required"),
  });
