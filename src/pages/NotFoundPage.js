import React from "react";
import "../assets/css/notFoundPage.css";
import Ambulance from "../assets/images/ambulance.png";

class NotFoundPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <body>
        <div className="night">
          <div className="error">
            <p>
              PAGE NOT FOUND
              <span>404</span>
            </p>
          </div>
          <div className="surface"></div>
          <div className="car">
            <img src={Ambulance} width="30%" />
          </div>
        </div>
      </body>
    );
  }
}

export default NotFoundPage;
