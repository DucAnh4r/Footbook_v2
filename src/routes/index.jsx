import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { homeRoutes, messageRoutes } from "./allRoutes";
import MainLayout from "../Layout/MainLayout";
import ErrorPage from "../Pages/ExtendPage/ErrorPage";
import MessageLayout from "../Layout/MessageLayout";
import { ChatProvider } from "../utils/ChatContext";

const Index = () => {
    return (
        <ChatProvider>
        <React.Fragment>
                <Suspense>
                    <Routes>
                        <Route>
                            {homeRoutes.map((route, idx) => (
                                <Route path={route.path} element={<MainLayout>{route.component}</MainLayout>} key={idx} exact={true} />
                            ))}
                        </Route>
                        <Route>
                            {messageRoutes.map((route, idx) => (
                                <Route path={route.path} element={<MessageLayout>{route.component}</MessageLayout>} key={idx} exact={true} />
                            ))}
                        </Route>
                        <Route path="*" element={<MainLayout><ErrorPage/></MainLayout>} />
                    </Routes>
                </Suspense>
        </React.Fragment>
        </ChatProvider>

    );
};

export default Index;