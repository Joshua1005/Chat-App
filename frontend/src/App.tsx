import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./components/Form/Form";
import { Toaster } from "./components/ui/toaster";
import AppProvider from "./context/AppProvider";
import Content from "./components/Content/Content";
import Messenger from "./components/Messenger/Messenger";

const App = () => {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route
            path="/user"
            element={
              <>
                <Toaster />
                <Form />
              </>
            }
          />
          <Route path="/" element={<Content />} />
          <Route path="/chat" element={<Messenger />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
