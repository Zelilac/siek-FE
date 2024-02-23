import React from "react";
import { Container, Row, Col, Button, Label, Input } from "reactstrap";
import "../assets/css/ContactPage.css";
import { Carousel } from "react-responsive-carousel";
import Banner from "../assets/images/banner-contact.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

class ContactPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const signinBtn = document.querySelector(".signinBtn");
    const signupBtn = document.querySelector(".signupBtn");
    const formBx = document.querySelector(".formBx");
    const outer = document.querySelector(".outer");

    signupBtn.onclick = function () {
      formBx.classList.add("active");
      outer.classList.add("active");
    };

    signinBtn.onclick = function () {
      formBx.classList.remove("active");
      outer.classList.remove("active");
    };
  }
  render() {
    return (
      <Container fluid className="p-0">
        <Row>
          <Col md="12 mt-5">
            <Carousel showThumbs={false} showStatus={false}>
              <div>
                <img src={Banner} />
              </div>
            </Carousel>
          </Col>
          <Col md="12">
            <div className="outer">
              <Container className="mt-5 box">
                <div className="blueBg">
                  <div className="box signin">
                    <h2>We hope you can improve Pharmaclick.</h2>
                    <Button outline color="warning" className="signinBtn">
                      Back
                    </Button>
                  </div>
                  <div className="box signup">
                    <h2>Let's Ask</h2>
                    <Button outline color="primary" className="signupBtn">
                      Get In Touch
                    </Button>
                  </div>
                </div>
                <div className="formBx">
                  <div className="form signinForm">
                    <p>Contact Information</p>
                    <p className="context-contact">
                      Fill up them form and our Team will get back to you within
                      24 hours.
                    </p>
                    <p className="mt-5 icon-contact">
                      <a>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </a>
                      <span>smkpastibisa@mail.com</span>
                    </p>
                    <p className="mt-5 icon-contact">
                      <a>
                        <FontAwesomeIcon icon={faPhone} />
                      </a>
                      <span> +62819210XXX</span>
                    </p>
                    <p className="mt-5 icon-contact">
                      <a>
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                      </a>
                      <span>Jalan Soekarno Hatta No X, Bandung</span>
                    </p>
                    <div className="circle"></div>
                    <div className="circle-next"></div>
                  </div>

                  <div className="form signupForm">
                    <Container>
                      <Row>
                        <Col md="6">
                          <Label className="label-contact">First Name</Label>
                          <Input
                            type="text"
                            name="email"
                            id="exampleEmail"
                            placeholder="Enter your first name"
                          />
                        </Col>
                        <Col md="6">
                          <Label className="label-contact">Last Name</Label>
                          <Input
                            type="text"
                            name="password"
                            id="examplePassword"
                            placeholder="Enter your last name"
                          />
                        </Col>
                        <Col md="6">
                          <Label className="label-contact">Mail</Label>
                          <Input
                            type="email"
                            name="password"
                            id="examplePassword"
                            placeholder="Enter your Email"
                          />
                        </Col>
                        <Col md="6">
                          <Label className="label-contact">Phone</Label>
                          <Input
                            type="text"
                            name="password"
                            id="examplePassword"
                            placeholder="Enter your password"
                          />
                        </Col>
                        <Col md="12">
                          <Label className="label-contact">Message</Label>
                          <Input
                            type="textarea"
                            name="password"
                            id="examplePassword"
                            placeholder="Enter your message"
                          />
                        </Col>
                        <Col md="12 mt-5 mb-5">
                          <Button color="primary" style={{ width: "100%" }}>
                            Send Message{" "}
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </div>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ContactPage;
