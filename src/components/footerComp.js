import React from "react";
import {
  faFacebookF,
  faTwitter,
  faGoogle,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class FooterComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <footer className="text-center text-white footer-item" style={{position:"fixed", position:"bottom"}}>
        <div className="container pt-3 pb-1">
          <section className="mb-4">
            <div className="d-flex justify-content-evenly text-black">
              <div>
                <a
                  className="btn btn-link btn-floating btn-lg text-dark m-1"
                  href="#!"
                  role="button"
                  data-mdb-ripple-color="dark"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                  {/* <i className="fab fa-facebook-f"></i> */}
                </a>
                <a
                  className="btn btn-link btn-floating btn-lg text-dark m-1"
                  href="#!"
                  role="button"
                  data-mdb-ripple-color="dark"
                >
                  <FontAwesomeIcon icon={faTwitter} className="text-black" />
                  {/* <i className="fab fa-twitter"></i> */}
                </a>
                <a
                  className="btn btn-link btn-floating btn-lg text-dark m-1"
                  href="#!"
                  role="button"
                  data-mdb-ripple-color="dark"
                >
                  <FontAwesomeIcon icon={faGoogle} />
                  {/* <i className="fab fa-google"></i> */}
                </a>
                <a
                  className="btn btn-link btn-floating btn-lg text-dark m-1"
                  href="#!"
                  role="button"
                  data-mdb-ripple-color="dark"
                >
                  <FontAwesomeIcon icon={faInstagram} className="icon-item" />
                  {/* <i className="fab fa-instagram"></i> */}
                </a>
              </div>
            </div>
          </section>
        </div>
      </footer>
    );
  }
}

export default FooterComp;
