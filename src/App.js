import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BottomNavBar from "./components/BottomNavBar";
import Referral from "./components/Referral";
import Tasks from "./components/Tasks";
import Games from "./components/Games";
import TapCoinGame from "./Games/TapCoinGame";
import FruitNinjaGame from "./Games/FruitNinjaGame";
import Boost from "./components/Boost";
import Stats from "./components/Stats";
import Admin from "./components/Admin";
import Home from "./components/Home";
import { CoinProvider } from "./Utils/coinContext"; // Import the CoinProvider
import MarioGame from "./Games/Mario/MarioGame";
import { UserDataProvider } from "./Utils/userDataContext";
import { LoadingProvider, useLoading } from "./Utils/LoadingContext";
import { Provider } from "react-redux";
import { store } from "./Games/Mario/config/redux/store";
import TelegramWebApps from "telegram-web-app-api";

function App() {
  return (
    <LoadingProvider>
      <UserDataProvider>
        {" "}
        {/* Wrap the entire app with the CoinProvider */}
        <CoinProvider>
          <Provider store={store}>
            <Router>
              <div className="min-h-screen overflow-hidden text-primary font-body  bg-custom-gradient-tapgame">
                <Routes>
                  <Route path="/" element={<Admin />} />
                  <Route path="/home/:chatId" element={<Home />} />
                  <Route path="/home/:chatId/:refId" element={<Home />} />
                  <Route path="/referral" element={<Referral />} />
                  <Route path="/tasks" element={<Tasks />} />
                  {/* <Route path="/games" element={<Games />} /> */}
                  {/* <Route path="/games/tapcoin" element={<TapCoinGame />} /> */}
                  <Route path="/games" element={<TapCoinGame />} />
                  {/* <Route path="/games/mariorun" element={<MarioGame />} /> */}
                  <Route path="/boost" element={<Boost />} />
                  <Route path="/stats" element={<Stats />} />
                </Routes>
                <BottomNavBar />
              </div>
            </Router>
          </Provider>
        </CoinProvider>
      </UserDataProvider>
    </LoadingProvider>
  );
}

export default App;
