import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import BookingComponent from "./components/Booking";
import ReportComponent from "./components/Report";
import { useUser } from "./UserContext";
import LoginComponent from "./components/Login";
import Body from "./components/Body";

function App() {
  const { profile } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Body />}>
        {profile ? (
          <>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/booking" element={<BookingComponent />} />
            <Route path="/report" element={<ReportComponent />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginComponent />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
        <Route index element={<Home />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
