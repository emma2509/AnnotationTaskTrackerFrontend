import LogInPage from "./Pages/LogInPage";
import * as React from "react";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import AppLayout from "@cloudscape-design/components/app-layout";
import RegisterPage from "./Pages/RegisterPage";
import AnnotationTaskPage from "./Pages/AnnotationTaskPage";

export default function AppRoutes() {
    const [pageView, changePageView] = React.useState<string>("login"); // this hold value for what page view the user is on
    return (
      <AppLayout
          content={
          <ContentLayout
              header={<Header variant="h1">Annotation Task Tracker System</Header>}
          >
              {pageView === "login" && <LogInPage changePageView={changePageView} />}
              {pageView === "register" && <RegisterPage changePageView={changePageView} />}
              {pageView === "annotation" && <AnnotationTaskPage/>}
          </ContentLayout>}
          navigationHide ={true}
          toolsHide={true}
      />
  );
}
