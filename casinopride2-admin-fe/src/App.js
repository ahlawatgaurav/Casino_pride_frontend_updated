import "./App.css";
import LoginPage from "./Layouts/Pages/LoginPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import HomePage from "./Layouts/Pages/HomePage";
import CrudDemoPage from "./Layouts/Pages/CrudDemoPage";
import Layout from "./Layouts/Components/Layout";
import "rsuite/styles/index.less"; // or 'rsuite/dist/rsuite.min.css'
import ManagerList from "./Layouts/Pages/Users/ManagerList";
import AddUser from "./Layouts/Components/AddUser";
import GREList from "./Layouts/Pages/Users/GREList";
import MasterAgent from "./Layouts/Pages/Users/MasterAgent";
import AgentList from "./Layouts/Pages/Users/AgentList";
import DriverList from "./Layouts/Pages/Users/DriverList";
import AccountsList from "./Layouts/Pages/Users/AccountsList";
import PackageList from "./Layouts/Pages/Packages/PackageList";
import AddPackage from "./Layouts/Components/AddPackage";
import CouponsList from "./Layouts/Pages/Coupons/CouponsList";
import AddCoupon from "./Layouts/Components/AddCoupon";
import Discountonwebsite from "./Layouts/Pages/DiscountsOnWebsite/Discountonwebsite";
import AddDiscountOnWebsite from "./Layouts/Components/AddDiscountOnWebsite";
import NewBooking from "./Layouts/Components/NewBooking";
import BookingList from "./Layouts/Pages/Booking/BookingList";
import PackagesPage from "./Layouts/Pages/Packages/PackagePage";
import DiscountOnPanel from "./Layouts/Pages/DiscountOnPanel/DiscountOnPanel";
import AddDiscountOnPanel from "./Layouts/Components/AddDiscountOnPanel";
import GenerateBill from "./Layouts/Pages/Booking/GenerateBill";
import BillingDetails from "./Layouts/Pages/Billing/BillingDetails";
import BillingList from "./Layouts/Pages/Billing/BillingList";
import Shifts from "./Layouts/Pages/Shifts/Shifts";
import TeensBilling from "./Layouts/Pages/Billing/TeensBilling";
import FutureBookingDates from "./Layouts/Pages/FutureBookingDates/FutureBookingDates";
import AddFutureBookingDates from "./Layouts/Components/AddFutureBookingDates";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AgentSettlementList from "./Layouts/Pages/AgentSettlement/AgentSettlementList";
import RegenerateBill from "./Layouts/Pages/Billing/RegenerateBill";
import QrLinkPage from "./Layouts/Pages/QRLink/QrLinkPage";
import LocalAgentList from "./Layouts/Pages/Users/LocalAgentList";
import AcknowledgementDetails from "./Layouts/Pages/Ack/AcknowledgementDetails";
import UpdateBooking from "./Layouts/Components/UpdateBooking";
function App() {
  let { param } = useParams();
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/HomePage"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/CrudDemoPage"
          element={
            <Layout>
              <CrudDemoPage />
            </Layout>
          }
        />

        <Route
          path="/FutureBookingDates"
          element={
            <Layout>
              <FutureBookingDates />
            </Layout>
          }
        />

        <Route
          path="/AddFutureBookingDates"
          element={
            <Layout>
              <AddFutureBookingDates />
            </Layout>
          }
        />

        <Route
          path="/:param"
          element={
            <Layout>
              <AcknowledgementDetails />
            </Layout>
          }
        />

        <Route
          path="/p/:param"
          element={
            <Layout>
              <QrLinkPage />
            </Layout>
          }
        />

        <Route
          path="/BookingList"
          element={
            <Layout>
              <BookingList />
            </Layout>
          }
        />

        <Route
          path="/AgentSettlementList"
          element={
            <Layout>
              <AgentSettlementList />
            </Layout>
          }
        />

        <Route
          path="/RegenerateBill"
          element={
            <Layout>
              <RegenerateBill />
            </Layout>
          }
        />

        <Route
          path="/GenerateBill"
          element={
            <Layout>
              <GenerateBill />
            </Layout>
          }
        />

        <Route
          path="/Shifts"
          element={
            <Layout>
              <Shifts />
            </Layout>
          }
        />

        <Route
          path="/TeensBilling"
          element={
            <Layout>
              <TeensBilling />
            </Layout>
          }
        />

        <Route
          path="/BillingDetails"
          element={
            <Layout>
              <BillingDetails />
            </Layout>
          }
        />

        <Route
          path="/BillingList"
          element={
            <Layout>
              <BillingList />
            </Layout>
          }
        />

        <Route
          path="/NewBooking"
          element={
            <Layout>
              <NewBooking />
            </Layout>
          }
        />

        <Route
          path="/UpdateBooking/:bookingId"
          element={
            <Layout>
              <UpdateBooking />
            </Layout>
          }
        />

        <Route
          path="/ManagerList"
          element={
            <Layout>
              <ManagerList />
            </Layout>
          }
        />

        <Route
          path="/AddUser"
          element={
            <Layout>
              <AddUser />
            </Layout>
          }
        />
        <Route
          path="/GREList"
          element={
            <Layout>
              <GREList />
            </Layout>
          }
        />

        <Route
          path="/DriverList"
          element={
            <Layout>
              <DriverList />
            </Layout>
          }
        />

        <Route
          path="/MasterAgent"
          element={
            <Layout>
              <MasterAgent />
            </Layout>
          }
        />

        <Route
          path="/DiscountOnPanel"
          element={
            <Layout>
              <DiscountOnPanel />
            </Layout>
          }
        />

        <Route
          path="/AgentList"
          element={
            <Layout>
              <AgentList />
            </Layout>
          }
        />

        <Route
          path="/AccountsList"
          element={
            <Layout>
              <AccountsList />
            </Layout>
          }
        />

        <Route
          path="/PackageList"
          element={
            <Layout>
              <PackageList />
            </Layout>
          }
        />

        <Route
          path="/AddPackage"
          element={
            <Layout>
              <AddPackage />
            </Layout>
          }
        />

        <Route
          path="/CouponsList"
          element={
            <Layout>
              <CouponsList />
            </Layout>
          }
        />

        <Route
          path="/AddDiscountOnPanel"
          element={
            <Layout>
              <AddDiscountOnPanel />
            </Layout>
          }
        />

        <Route path="/PackagesPage" element={<PackagesPage />} />

        <Route
          path="/AddCoupon"
          element={
            <Layout>
              <AddCoupon />
            </Layout>
          }
        />
        <Route
          path="/Discountonwebsite"
          element={
            <Layout>
              <Discountonwebsite />
            </Layout>
          }
        />

        <Route
          path="/AddDiscountOnWebsite"
          element={
            <Layout>
              <AddDiscountOnWebsite />
            </Layout>
          }
        />
        <Route
          path="/LocalAgentList"
          element={
            <Layout>
              <LocalAgentList />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
