import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { 
  createBrowserRouter, 
  RouterProvider 
} from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import Film from "./routes/film";
import User from "./routes/user";
import Product from "./routes/product";
import Genre from "./routes/genre";
import Channel from "./routes/channel";
import UserCreate from "./routes/create/user";
import ProductCreate from "./routes/create/product";
import FilmCreate from "./routes/create/film";
import GenreCreate from "./routes/create/genre";
import ChannelCreate from "./routes/create/channel";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children:[
      {
        path: "film",
        element: <Film />,
      },
      {
        path: "product",
        element: <Product />
      },
      {
        path: "channel",
        element: <Channel />
      },
      {
        path: "genre",
        element: <Genre />
      },
      {
        path: "user",
        element: <User />
      },
      {
        path: "film/create",
        element: <FilmCreate />
      },
      {
        path: "user/create",
        element: <UserCreate />
      },
      {
        path: "product/create",
        element: <ProductCreate />
      },
      {
        path: "genre/create",
        element: <GenreCreate />
      },
      {
        path: "channel/create",
        element: <ChannelCreate />
      }
      
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
