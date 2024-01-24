import React from "react";
import {
  Container,
  Row,
  Col,
  Input,
  Button,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "../assets/css/productDetailPage.css";
import {
  faPlus,
  faMinus,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toast } from 'primereact/toast';
import HTTP from "../service/HTTP";
import { getProductAction, keepLogin } from '../action'
import { Dialog } from 'primereact/dialog';
import { Rating } from 'primereact/rating';
import { Accordion, AccordionTab } from 'primereact/accordion';

class ProductDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: [],
      value: 1,
      more: 0,
      iduser: 4,
      other: [],
      visible: false,
      review: [],
      activeIndex: 0
    };
  }

  onBtnAdd = async () => {
    try {
      if (this.state.value < this.state.detail.stock[0].qty) {
        this.state.value += 1
        this.setState({ value: this.state.value })
        // let res = await HTTP.patch('/product/increment', {iduser: this.props.iduser, qty: this.state.value, idproduct: this.state.detail.idproduct})
        // console.log(res.data)
      } else {
        this.toast.show({ severity: 'warn', summary: 'Warning', detail: 'Product Out of Stock', life: 3000 });
      }
    } catch (error) {
      console.log("error incremennt", error)
    }
  }

  onBtnMin = async () => {
    try {
      if (this.state.value > 1) {
        this.state.value -= 1
        this.setState({ value: this.state.value })
        // let res = await HTTP.patch('/product/decrement', {iduser: this.props.iduser, qty: this.state.value, idproduct: this.state.detail.idproduct})
        // console.log(res.data)
      }

    } catch (error) {
      console.log("error decrement", error)
    }
  }
  componentDidMount() {
    this.detailProduct();
    this.getReview();
  }

  getReview = async () => {
    try {
      let res = await HTTP.get(`/product/review${this.props.location.search}`)
      this.setState({ review: res.data })
    } catch (error) {
      console.log("error get review", error)
    }
  }
  detailProduct = async () => {
    try {
      await this.props.getProductAction(1)
      let idproduct = this.props.location.search.split('-')
      let index = idproduct.length
      console.log(idproduct[index - 1])
      let res = await HTTP.get(`/product/1?idproduct=${idproduct[index - 1]}`)
      let other = this.props.products.filter(item => item.category === res.data[0].category)
      console.log("other", other)
      this.setState({ detail: res.data[0], other })
    } catch (error) {
      console.log("error get detail product")
    }
  };

  onClickOthers = (item) => {
    this.props.getProductAction(1)
    window.location = `/detail?product=${item.product_name.replace(/\s/g, "-")}-${item.idproduct}`
    this.detailProduct()
  }

  onBtnAddCart = async () => {
    try {
      let { detail, value } = this.state
      if (!this.props.iduser) {
        this.setState({ visible: true })
        return null
      }
      // fungsi add to cart
      let price = parseInt(detail.pack_price)
      let total_netto = value * detail.netto
      let res = await HTTP.post('/product/add-to-cart',
        {
          iduser: this.props.iduser,
          idproduct: detail.idproduct,
          total_netto,
          qty: value,
          price,
          product_name: detail.product_name
        })
        console.log(res.data)
      let token = localStorage.getItem("tkn_id");
      await this.props.keepLogin(token)
      this.setState({ value: 1 })
      this.toast.show({ severity: 'success', summary: 'Success add to cart', detail: res.data, life: 3000 });
    } catch (error) {
      console.log("error add to cart", error)
    }

  }

  printReview = () => {
    return this.state.review.map((item, index) => {
      return (
        <div>
          <span>Reviewed by : {item.fullname}</span>
          <Rating value={parseInt(item.rating)} cancel={false} disabled />
          <p>{item.review}</p>
          <hr />
        </div>
      )
    })
  }
  render() {
    console.log("detail", this.state.detail);
    console.log("review", this.state.review);
    console.log("product", this.props.products);

    let array = String(this.state.detail.indication).split("+");
    console.log("detail", array);
    return (
      <Container className="product-detail px-5 mt-5 pb-5" fluid style={{ marginTop: '3%' }}>
        <marquee behavior="scroll" direction="right" scrollamount="10" className="mt-4" style={{ color: 'black' }}>
        </marquee>
        <Row>
          <Col xl="3 mt-3" lg="3 mt-3" md="3 mt-3" sm="12 mt-3" xs="12 mt-3">
            <div>
              <Carousel showThumbs={true} showStatus={true}>
                <img
                  src={this.state.detail.images}
                  style={{ width: "70%" }}
                />
              </Carousel>
              <h5>{this.state.detail.product_name}</h5>
              <h6>Rp {this.state.detail.pack_price && this.state.detail.pack_price.toLocaleString()}</h6>
            </div>
            {/* INCREMENT & ADD TO CART */}
            <Container className="btn-getstarted p-0" fluid>
              <Row>
                <Col
                  xl="6 mt-2"
                  lg="6 mt-2"
                  md="6 mt-2"
                  sm="3 mt-2"
                  xs="3 mt-2"
                >
                  <Toast ref={(el) => this.toast = el} position="top-left" />
                  <div className="input-group">
                    <span className="input-group-btn" onClick={this.onBtnMin}>
                      <Button
                        outline
                        color="danger"
                        class="btn btn-default btn-number"
                        size="sm"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </Button>
                    </span>
                    <Input
                      type="text"
                      class="form-control input-number"
                      value={this.state.value}
                      size="sm"
                      style={{ textAlign: 'center' }}
                    />
                    <span class="input-group-btn" onClick={this.onBtnAdd}>
                      <Button
                        outline
                        color="info"
                        class="btn btn-default btn-number"
                        size="sm"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </span>
                  </div>
                </Col>
                <Col
                  xl="6 mt-3"
                  lg="6 mt-3"
                  md="12 mt-3"
                  sm="6 mt-3"
                  xs="6 mt-3"
                >
                  <a className="text-white" onClick={this.onBtnAddCart}>
                    Add To Cart <FontAwesomeIcon icon={faShoppingCart} />
                  </a>
                  <Dialog header="Warning" visible={this.state.visible} onHide={() => this.setState({ visible: false })} style={{ width: '30%' }}>
                    <p>Please login to proceed!</p>
                    <div style={{ float: 'right' }}>
                      <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>
                        <Button color="primary">Login</Button>
                      </Link>
                      <Button outline color="primary" onClick={() => this.setState({ visible: false })} className="mx-3">Cancel</Button>
                    </div>
                  </Dialog>
                </Col>
              </Row>
            </Container>
          </Col>

          {/* DESCRIPTION */}
          <Col xl="6" lg="6" md="6 mt-3" sm="12 mt-3" xs="12 mt-3">
            <Container className="p-0 " fluid>
              <Row>
                <Col
                  xl="10 m-auto product-text"
                  lg="10 m-auto product-text"
                  md="10 m-auto product-text"
                  sm="12 m-auto product-text"
                  xs="12 m-auto product-text"
                >
                  <h5>Category</h5>
                  <p style={{ color: "#75BDF6", fontWeight: "900", textTransform: 'capitalize', fontSize: '15px' }}>
                    {this.state.detail.category}
                  </p>
                  <hr />
                  <h5>Description</h5>
                  <p>{this.state.detail.description}</p>
                  <hr />
                  <h5>Manufacturer</h5>
                  <p style={{ color: "#75BDF6", fontWeight: "900" }}>
                    {this.state.detail.brand}
                  </p>
                  <hr />
                  <Accordion activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })} style={{ width: '99%' }}>
                    <AccordionTab header={<React.Fragment><span style={{ fontWeight: 'bold', fontSize: '20px' }}>Product Reviews</span></React.Fragment>}>
                      {this.printReview()}
                    </AccordionTab>
                  </Accordion>

                </Col>
              </Row>
            </Container>
          </Col>
          <Col
            xl="3 mt-3"
            lg="3 mt-3"
            md="3 mt-3"
            className="more-product"
            style={{ position: "fixed", right: 0 }}
          >
            <h6>Other Products</h6>
            {this.state.other.slice(0, 4).map((item, idx) => {
              return (
                <>
                  <Link
                    to={`/detail?product=${item.product_name.replace(/\s/g, "-")}-${item.idproduct}`}
                    style={{ textDecoration: "none", color: "black" }}
                    onClick={() => this.onClickOthers(item)}
                  >
                    <Card className="mt-2">
                      <Container fluid className="p-0">
                        <Row>
                          <Col xl="4 p-3" lg="4 p-3" md="5 p-3">
                            <CardImg
                              top
                              width="100%"
                              src={item.images}
                              alt="Product"
                            />
                          </Col>
                          <Col xl="8" lg="8" md="7">
                            <CardBody>
                              <CardTitle tag="p">
                                {item.product_name}
                              </CardTitle>
                              <CardSubtitle
                                tag="p"
                                className="mb-2 text-muted"
                              >
                                Rp {item.pack_price.toLocaleString()}
                              </CardSubtitle>
                            </CardBody>
                          </Col>
                        </Row>
                      </Container>
                    </Card>
                  </Link>
                </>
              );
            })}
          </Col>
        </Row>

      </Container>
    );
  }
}

const mapStateToProps = ({ productReducer, authReducer }) => {
  return {
    products: productReducer.product_list,
    ...authReducer
  };
};

export default connect(mapStateToProps, { getProductAction, keepLogin })(ProductDetailPage);
