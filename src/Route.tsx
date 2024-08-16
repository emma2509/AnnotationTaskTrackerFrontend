import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LogInPage";
import RegisterPage from "./Pages/RegisterPage";
import * as React from "react";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import AppLayout from "@cloudscape-design/components/app-layout";

export default function AppRoutes() {
  return (
      <AppLayout
          content={
          <ContentLayout
              header={<Header variant="h1">Annotation Task Tracker System</Header>}
          >
              <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                  </Routes>
              </BrowserRouter>
          </ContentLayout>}
          navigationHide ={true}
          toolsHide={true}
      />
  );
}
