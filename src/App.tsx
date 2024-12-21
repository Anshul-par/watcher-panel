import { BrowserRouter, Routes, Route } from "react-router-dom";

import { UrlDetails } from "./components/url-details";
import { Layout } from "./components/layout/layout";
import { AddUrlForm } from "./components/add-url-form";
import { ProjectForm } from "./components/project-form";
import { SignupPage } from "./components/signup";
import { LoginPage } from "./components/login";
import NotFound from "./components/layout/notfound";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/app" element={<Layout />}>
          <Route path="url/:id" element={<UrlDetails />} />
          <Route path="add/url" element={<AddUrlForm />} />
          <Route path="project" element={<ProjectForm />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
