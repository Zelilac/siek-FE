import React from "react";
// PRIME REACT
import "../../assets/css/SidebarComp.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { authLogout } from "../../action";

class SidebarComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleLeft: true,
      nodes: null,
      activeIndex: null,
    };
  }

  render() {
    return (
      <>
        <input type="checkbox" id="sidebar-toggle" />
        <div className="sidebar">
          <div className="sidebar-header">
            <h3 className="brand">
              <span>SMK Pasti Bisa!</span>
            </h3>
            <label for="sidebar-toggle" className="ti-menu-alt"></label>
          </div>

          <div className="sidebar-menu">
            <ul style={{ position: "relative", right: 17 }}>
              {this.props.role === "admin" && <li>
                <Link to="/dashboard" style={{ textDecoration: "none" }}>
                  <span className="ti-clipboard"></span>
                  <span>Dashboard</span>
                </Link>
              </li>}
              <li>
                <Link
                  to="/product-management"
                  style={{ textDecoration: "none" }}
                >
                  <span className="ti-folder"></span>
                  <span>Pack Product</span>
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/custom-product-management"
                  style={{ textDecoration: "none" }}
                >
                  <span className="ti-folder"></span>
                  <span>Custom Product</span>
                </Link>
              </li> */}
              {/* <li>
                <Link
                  to="/custom-order"
                  style={{ textDecoration: "none" }}
                >
                  <span className="ti-shopping-cart"></span>
                  <span>Custom Order</span>
                </Link>
              </li> */}
              <li>
                <Link to="/transactions" style={{ textDecoration: "none" }}>
                  <span className="ti-credit-card"></span>
                  <span>Transactions</span>
                </Link>
              </li>
              {this.props.role === "admin" && <li>
                <Link to="/sales-report" style={{ textDecoration: "none" }}>
                  <span className="ti-time"></span>
                  <span>Sales Report</span>
                </Link>
              </li>}
              {this.props.role === "admin" && <li>
                <Link to="/revenue-report" style={{ textDecoration: "none" }}>
                  <span className="ti-book"></span>
                  <span>Revenue</span>
                </Link>
              </li>}
              <li>
                <Link to="/list-users" style={{ textDecoration: "none" }}>
                  <span className="ti-clipboard"></span>
                  <span>List Users</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  style={{ textDecoration: "none" }}
                  onClick={this.props.authLogout}
                >
                  <span className="ti-settings"></span>
                  <span>Sign Out</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div class="main-content">
          <header>
            <div class="search-wrapper">
              <span class="ti-search"></span>
              <input type="search" placeholder="Search" />
            </div>

            <div class="social-icons">
              <span class="ti-bell"></span>
              <span class="ti-comment"></span>
              <div></div>
            </div>
          </header>
        </div>

        {/* Ini batas wrapper */}
      </>
    );
  }
}

const mapStateToProps = ({ authReducer }) => {
  return {
      ...authReducer
  }
}
export default connect(mapStateToProps, { authLogout })(SidebarComp);
