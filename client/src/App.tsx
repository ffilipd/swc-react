import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import BookingComponent from "./components/Booking";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="/booking" element={<BookingComponent />} />
      </Route>
    </Routes>
  );
}

export default App;
