import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import { connect } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import {URL_API} from "../Helper"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faShoppingCart,
  faEye,
  faComments,
  faHeadSideCough,
  faVirus,
  faCapsules,
} from "@fortawesome/free-solid-svg-icons";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import Slider from "react-slick";
import ProductBanner from "../assets/images/bannerProduct.gif";
import Phone from "../assets/images/phone1.JPG";
import Feedback from "../assets/images/feedback.jpg";
import Chat from "../assets/images/chat2.png";
import Delivery from "../assets/images/delivery.png";
import Tilt from "react-vanilla-tilt";
import "../assets/css/navigation.css";
import { getProductAction } from "../action";

var settings = {
  dots: true,
  speed: 500,
  arrows: true,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: "50px",
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 540,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: "50px",
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: "60px",
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 280,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "30px",
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 268,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "20px",
        slidesToShow: 1,
      },
    },
  ],
};

var category = [
  {
    nama: "Seragam",
    icon: faVirus,
    category: "Seragam",
  },
  {
    nama: "Alat Tulis",
    icon: faEye,
    category: "Alat Tulis",
  },
  {
    nama: "Buku Cetak",
    icon: faHeadSideCough,
    category: "Buku Cetak",
  },
  {
    nama: "Olahraga",
    icon: faCapsules,
    category: "Olahraga",
  }
];

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filter: [], more: 6 };
  }

  async componentDidMount() {
    await this.props.getProductAction(1);
    this.onBtnFilterCategory()
    
  }

  onBtnBrowse = (more) => {
    return this.state.filter.slice(0, more);
  };

  onBtnFilterCategory = (val) => {
    if (val === undefined) {
      val = "Seragam";
      let result = this.props.products.filter(word => word.category === val);
      return this.setState({filter:result})
    } else {
      let result = this.props.products.filter(word => word.category === val);
      return this.setState({filter:result})
    }
  };

  render() {
    console.log("products", this.props.products);
    console.log("user", this.props.user);
    console.log("filter", this.state.filter);
    return (
      <Container fluid className="p-0">
        <Row>
          <Col xl="12" lg="12" md="12 mt-5" sm="12 mt-5" xs="12 mt-5">
            <Carousel showThumbs={false} showStatus={false}>
              <div>
                <img src={ProductBanner} />
              </div>
              <div>
                <img src="assets/2.jpeg" />
              </div>
              <div>
                <img src="assets/3.jpeg" />
              </div>
            </Carousel>
          </Col>
        </Row>
        {/* MOST POPULAR PRODUCTS */}
        <Container>
          <Row>
            <Col md="12">
              <h2 className="text-center mt-5" style={{ fontWeight: "bold" }}>
                Most Popular Products
              </h2>
              <Container>
                <Row>
                  <Col md="12" className="mt-5">
                    <Slider {...settings}>
                      {this.props.products.slice(0, 10).map((item) => {
                        return (
                          <>
                            <div>
                              <Card
                                style={{
                                  borderRadius: "10px",
                                  border: "none",
                                  margin: "5px",
                                  height: "260px",
                                  boxShadow:
                                    "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                                }}
                                className="card-popular"
                              >
                                <Link
                                  to={`/detail?product=${item.product_name.replace(/\s/g,"-")}-${item.idproduct}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "black",
                                  }}
                                >
                                  <CardImg
                                    src={
                                      item.images[0].includes("http")
                                        ? `${item.images[0]}`
                                        
                                        : `${URL_API}/${item.images[0]}`
                                    }
                                    alt="img"
                                    className="img-fluid p-2"
                                    style={{
                                      borderRadius: "15px", height: "180px"
                                    }}
                                  />
                                  <CardBody>
                                    <CardTitle className="text-muted title-products">
                                      {item.product_name.length > 25 ? (
                                        <>
                                          {item.product_name.slice(0, 25) +
                                            " ..."}
                                        </>
                                      ) : (
                                        <>{item.product_name}</>
                                      )}
                                    </CardTitle>
                                    <CardSubtitle className="mb-2 price-products">
                                      Rp {item.pack_price}
                                    </CardSubtitle>
                                  </CardBody>
                                </Link>
                              </Card>
                            </div>
                          </>
                        );
                      })}
                    </Slider>
                  </Col>
                </Row>
              </Container>

              {/* CARD BOTTOM */}
              <Container className="mt-5 pb-5 ">
                <Row className="m-auto">
                  <Col lg="6" md="12" sm="12" xs="12">
                    <Card
                      style={{
                        borderRadius: "10px",
                        border: "0.5px solid #F1F1F1",
                      }}
                      className="card-service"
                    >
                      <Container>
                        <Row>
                          <Col md="5" id="bottom-content">
                            <CardBody>
                              <CardTitle
                                tag="h5"
                                style={{ fontWeight: "bold" }}
                              >
                                24 Hours always ready for you
                              </CardTitle>

                              <CardText style={{ fontSize: "12px" }}>
                                Don't waste time. Order product using
                                SekolahKuy. reliable and guaranteed quality.
                              </CardText>
                              <Link
                                to={`/product`}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                                className="btn-getstarted"
                              >
                                <a className="btn-getstarted">Get Started</a>
                              </Link>
                            </CardBody>
                          </Col>
                          <Col md="7" id="upper-content">
                            <CardImg
                              top
                              width="100%"
                              src={Chat}
                              alt="Card image cap"
                              className="img-fluid"
                            />
                          </Col>
                        </Row>
                      </Container>
                    </Card>
                  </Col>
                  {/* BAGIAN KANAN CARD */}
                  <Col lg="6" md="12" sm="12" xs="12 ">
                    <Card
                      style={{
                        borderRadius: "10px",
                        border: "0.5px solid #F1F1F1",
                      }}
                      className="card-service1"
                    >
                      <Container>
                        <Row>
                          <Col md="5" id="bottom-content">
                            <CardBody>
                              <CardTitle
                                tag="h5"
                                style={{ fontWeight: "bold" }}
                              >
                                Home Delivery in 30 minutes
                              </CardTitle>
                              <CardText style={{ fontSize: "12px" }}>
                                Tired of waiting in a queue? Too weak to go down
                                and buy medicines?
                              </CardText>
                              <Link
                                to={`/product`}
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                                className="btn-getstarted"
                              >
                                <a className="btn-getstarted">Order Now</a>
                              </Link>
                            </CardBody>
                          </Col>
                          <Col md="7" id="upper-content">
                            <img
                              top
                              src={Delivery}
                              alt="Card image cap"
                              width="95%"
                            />
                          </Col>
                        </Row>
                      </Container>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>

        {/* CATEGORY */}
        <Container
          fluid
          style={{
            background:
              "linear-gradient(0deg, rgba(238,239,243,1) 0%, rgba(236,234,255,1) 0%, rgba(255,255,255,1) 40%)",
          }}
        >
          <Row>
            <Col md="7" className="m-auto">
              <h4 className="text-center mt-5 " style={{ fontWeight: "bold" }}>
                Browse medicines & health products
              </h4>
              <Container
                style={{
                  backgroundColor: "#EAEAEE",
                  minHeight: "7vh",
                  borderRadius: "7px",
                  marginTop: "5vh",
                }}
              >
                <Row>
                  <Col md="12" className="m-auto">
                    <Container>
                      <div
                        className=" d-flex flex-wrap justify-content-around align-items-center icon-item"
                        style={{ height: "90px" }}
                      >
                        {category.map((item) => {
                          return (
                            <div>
                              <a
                                onClick={() => {
                                  this.onBtnFilterCategory(item.category);
                                }}
                              >
                                <FontAwesomeIcon icon={item.icon} /> {item.nama}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </Container>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>

          {/* ITEM MEDICINES & HEALTH PRODUCTS */}
          <Container>
            <Row className=" mt-4">
              {this.onBtnBrowse(this.state.more).map((item) => (
                <>
                  {item.stock[0].type === "pack" && (
                    <>
                      <Col xl="2" lg="2" md="3" sm="4" xs="4">
                        <Card
                          style={{
                            borderRadius: "15px",
                            margin: "5px",
                            height: "250px",
                            borderRadius: "8px",
                            backgroundColor: "rgb(245,247,251)",
                            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                          }}
                          className="card-medicine"
                        >
                          <Link
                            to={`/detail?product=${item.product_name.replace(/\s/g,"-")}-${item.idproduct}`}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <img
                              top
                              width="100%"
                              src={
                                item.images[0].includes("http")
                                  ? `${item.images[0]}`
                                  
                                  : `${URL_API}/${item.images[0]}`
                              }
                              alt={item.product_name}
                              className="img-fluid p-2"
                              height="auto"
                              style={{ borderRadius: "15px", height: "180px" }}
                            />
                            <ul className="action">
                              <li>
                                <FontAwesomeIcon
                                  icon={faEye}
                                  className="icon-product"
                                />
                                <span>Detail</span>
                              </li>
                              <li>
                                <FontAwesomeIcon
                                  icon={faShoppingCart}
                                  className="icon-product"
                                />
                                <span>Add to cart</span>
                              </li>
                            </ul>
                            <CardBody className="btn-getstarted">
                              <CardTitle className="title-products">
                                {item.product_name.length > 36 ? (
                                  <>{item.product_name.slice(0, 30) + " ..."}</>
                                ) : (
                                  <>{item.product_name}</>
                                )}
                              </CardTitle>
                              <CardSubtitle className="mb-2 price-products">
                                Rp {item.pack_price}
                              </CardSubtitle>
                            </CardBody>
                          </Link>
                        </Card>
                      </Col>
                    </>
                  )}
                </>
              ))}
              <Col md="12 mt-4" className="btn-getstarted">
                <center>
                  {this.state.more === 12 ? (
                    <>
                      {this.state.filter.length > 6 && (
                        <a
                          style={{
                            color: "white",
                            margin: "auto",
                          }}
                          onClick={() => {
                            this.setState({
                              more: this.state.more - 6,
                            });
                          }}
                        >
                          View Less
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      {this.state.filter.length > 6 && (
                        <>
                          <a
                            style={{
                              color: "white",
                              margin: "auto",
                            }}
                            onClick={() => {
                              this.setState({
                                more: this.state.more + 6,
                              });
                            }}
                          >
                            View More
                          </a>
                        </>
                      )}
                    </>
                  )}
                </center>
              </Col>
            </Row>
          </Container>

          {/* CUSTOMER REVIEW */}
          <Container>
            <Row>
              <Col md="12 mt-5">
                <h4
                  className="text-center mt-5 "
                  style={{ fontWeight: "bold" }}
                >
                  Customer Review & recommendation
                </h4>
                <Container>
                  <Row>
                    <Col md="12 mx-auto mt-3">
                      <Card
                        style={{
                          margin: "5px",
                          zIndex: "1",
                          border: "none",
                          boxShadow: "none",
                          paddingBottom: "5%",
                        }}
                      >
                        <Container>
                          <Row>
                            <Col md="10 m-auto">
                              <Slider>
                                <Tilt
                                  options={{ scale: 2, max: 35 }}
                                  style={{
                                    border: "none",
                                    margin: "5px",
                                  }}
                                >
                                  <Card>
                                    <Container>
                                      <Row className="btn-feedback">
                                        <Col md="4 py-4">
                                          <img
                                            top
                                            src={Feedback}
                                            alt="Card image cap"
                                            width="100%"
                                            style={{
                                              borderRadius: "5px",
                                            }}
                                            className="img-fluid"
                                          />
                                        </Col>
                                        <Col md="8 py-3">
                                          <CardBody>
                                            <CardTitle
                                              tag="h5"
                                              style={{ fontWeight: "bold" }}
                                            >
                                              <a>
                                                <FontAwesomeIcon
                                                  icon={faComments}
                                                  className="icon-item"
                                                  style={{
                                                    color: "white",
                                                    borderRadius: "100px",
                                                  }}
                                                />
                                              </a>
                                            </CardTitle>
                                            <CardText
                                              style={{
                                                fontSize: "12px",
                                                paddingTop: "2%",
                                              }}
                                            >
                                              "Beautiful application with
                                              elegant UI Design. I found this
                                              website very useful. Plaaced order
                                              for a few medicines and receive in
                                              just 30 minutes. Same medicine
                                              cost me +100 from local shop.
                                              Recomended this website and mobile
                                              application."
                                            </CardText>
                                          </CardBody>
                                        </Col>
                                      </Row>
                                    </Container>
                                  </Card>
                                </Tilt>
                              </Slider>
                            </Col>
                          </Row>
                        </Container>

                        <Container
                          style={{
                            backgroundColor: "black",
                            minHeight: "90%",
                            position: "absolute",
                            bottom: "0",
                            zIndex: "-1",
                            borderRadius: "8px",
                          }}
                        ></Container>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>

          {/* MOBILE APPS */}
          <Container className="mx-auto mt-4 pb-5">
            <Row className="btn-getstarted ">
              <div className="d-flex justify-content-center align-items-center flex-wrap m-auto p-5">
                <Col md="6" sm="12" xs="12" id="left-download">
                  <h5>Download Pharmaclick Mobile App</h5>

                  <p style={{ fontSize: "12px", textAlign: "justify" }}>
                    Your home for health is one tap away. Book appointments,
                    Order health products, consult with a doctor online.Book
                    heaalth chekups store health records&reaad health tips.
                  </p>
                  <a style={{ color: "white" }}>
                    <FontAwesomeIcon
                      icon={faApple}
                      className="icon-item"
                      style={{ color: "white" }}
                    />
                    &nbsp; Download App
                  </a>
                  <a style={{ color: "white", marginLeft: "2vw" }}>
                    <FontAwesomeIcon
                      icon={faGooglePlay}
                      className="icon-item"
                      style={{ color: "white" }}
                    />
                    &nbsp; Download App
                  </a>
                </Col>

                <Col md="6" sm="12 mt-5" xs="12 mt-5" id="right-download">
                  <img
                    src={Phone}
                    width="90%"
                    style={{ borderRadius: "10px" }}
                  />
                </Col>
              </div>
            </Row>
          </Container>
        </Container>
      </Container>
    );
  }
}

const mapStateToProps = ({ productReducer, authReducer }) => {
  return {
    products: productReducer.product_list,
    user: authReducer,
  };
};

export default connect(mapStateToProps, { getProductAction })(LandingPage);
