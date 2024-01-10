import "./App.css";
import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SidebarComp from "./pages/Admin/SidebarComp";
import DashboardPage from "./pages/Admin/DashboardPage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PassResetPage from "./pages/PassResetPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductManagementPage from "./pages/Admin/ProductManagementPage";
import CustomProductManagementPage from "./pages/Admin/CustomProductManagement";
import ProductPage from "./pages/ProductPage";
import VerificationPage from "./pages/VerificationPage";
import ProfilePage from "./pages/profilePage";
import NavbarComp from "./components/navbarComp";
import FooterComp from "./components/footerComp";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import CustomOrderPage from "./pages/CustomOrderPage";
import { keepLogin, getProductAction } from "./action";
import ProductDetailPage from "./pages/ProductDetailPage";
import TransactionAdminPage from "./pages/Admin/TransactionAdminPage";
import SalesReportPage from "./pages/Admin/SalesReportPage";
import RevenuePage from "./pages/Admin/RevenuePage";
import ManagementOrderCustomPage from "./pages/ManagementOrderCustomPage";
import PaymentPage from "./pages/paymentPage";
import ListUsersPage from "./pages/Admin/ListUsersPage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    this.reLogin();
  }

  reLogin = async () => {
    try {
      let token = localStorage.getItem("tkn_id");
      if (token) {
        this.props.keepLogin(token);
      }
    } catch (error) {
      console.log("keep login error", error);
    }
  };

  render() {

    return (

      <>
        {this.props.role === "user" ? (
          <UserPage />
        ) : this.props.role === "admin" ? (
          <AdminPage />
        ) : (
          <VisitorPage />
        )
        }
      </>
    );
  }
}

const UserPage = () => {
  return (
    <>
      <NavbarComp />
      <Switch>
        <Route path="/" component={LandingPage} exact />
        <Route path={"/login"} component={LoginPage} />
        <Route path={"/product"} component={ProductPage} />
        <Route path={"/profile"} component={ProfilePage} />
        <Route path={"/contact"} component={ContactPage} />
        <Route path={"/cart"} component={CartPage} />
        <Route path={"/detail"} component={ProductDetailPage} />
        <Route path={"/custom"} component={CustomOrderPage} />
        <Route path={"/payment"} component={PaymentPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <FooterComp />
    </>
  )
}

const AdminPage = () => {
  return (
    <>
      <SidebarComp />
      <Switch>
        <Route path={"/login"} component={LoginPage} />
        <Route path="/dashboard" component={DashboardPage} exact />
        <Route path="/list-users" component={ListUsersPage} />
        <Route
          path={"/product-management"}
          component={ProductManagementPage}
        />
        <Route
          path={"/custom-order"}
          component={ManagementOrderCustomPage}
        />
        <Route
          path={"/custom-product-management"}
          component={CustomProductManagementPage}
        />
        <Route path="/transactions" component={TransactionAdminPage} />
        <Route path={"/sales-report"} component={SalesReportPage} />
        <Route path={"/revenue-report"} component={RevenuePage} />
        <Route component={NotFoundPage} />
      </Switch>
      <FooterComp />
    </>
  )
}

const VisitorPage = () => {
  return (
    <>
      <NavbarComp />
      <Switch>
        <Route path="/" component={LandingPage} exact />
        <Route path={"/product"} component={ProductPage} />
        <Route path={"/login"} component={LoginPage} />
        <Route path={"/register"} component={RegisterPage} />
        <Route path={"/reset"} component={PassResetPage} />
        <Route path={"/verif"} component={VerificationPage} />
        <Route path={"/contact"} component={ContactPage} />
        <Route path={"/detail"} component={ProductDetailPage} />
        <Route component={NotFoundPage} />
        <Route path={"/custom"} component={CustomOrderPage} />
      </Switch>
      <FooterComp />
    </>
  )
}
const mapStateToProps = ({ authReducer }) => {
  return {
    ...authReducer,
  };
};

export default connect(mapStateToProps, {
  getProductAction,
  keepLogin,
  // getImageProfileUser,
})(App);
