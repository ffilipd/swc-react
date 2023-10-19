import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import BookingComponent from "./components/Booking";
import ReportComponent from "./components/Report";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="/booking" element={<BookingComponent />} />
        <Route path="/report" element={<ReportComponent />} />
      </Route>
    </Routes>
  );
}

export default App;
