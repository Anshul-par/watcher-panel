import { BrowserRouter, Routes, Route } from "react-router-dom";

import { UrlDetails } from "./components/url-details";
import { Layout } from "./components/layout/layout";
import { AddUrlForm } from "./components/add-url-form";
import { ProjectForm } from "./components/project-form";
import { LoginForm } from "./components/login-page";
import { SignupForm } from "./components/sign-up-page";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Layout />}>
          <Route path="url/:id" element={<UrlDetails />} />
          <Route path="add/url" element={<AddUrlForm />} />
          <Route path="project" element={<ProjectForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
