import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,Toast,ToastHeader,ToastBody
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSearch,
  faFilter,
  faTimes,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "../assets/css/productPage.css";
import { connect } from "react-redux";
import { getProductAction, keepLogin } from "../action";
import { Link } from "react-router-dom";
import axios from "axios";
import { URL_API } from "../Helper";

var settings = {
  dots: true,
  speed: 200,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: true,
        centerMode: false,
        centerPadding: "50px",
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 540,
      settings: {
        arrows: true,
        centerMode: false,
        centerPadding: "50px",
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 480,
      settings: {
        arrows: true,
        centerMode: false,
        centerPadding: "60px",
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 280,
      settings: {
        arrows: true,
        centerMode: false,
        centerPadding: "30px",
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 268,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "20px",
        slidesToShow: 4,
      },
    },
  ],
};

var category = [
  {
    nama: "Seragam",
    id: 1,
  },
  {
    nama: "Alat Tulis",
    id: 2,
  },
  {
    nama: "Buku Cetak",
    id: 3,
  },
  {
    nama: "Olahraga",
    id: 4,
  },
];

let defaultSearchFilter = {
  idCategory: null,
  sortBy: "",
  minRange: 0,
  maxRange: "",
};

class ProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      currentPage: 1,
      todosPerPage: 16,
      modal: false,
      modalProtection: false,
      searchFilter: [],
      show:false,
      showMessage:""
    };
  }

  componentDidMount() {
    this.props.getProductAction(1);
  }

  handleClick = (event) => {
    this.setState({
      currentPage: Number(event.target.id),
    });
  }

  handleSearch = (search) => {
    this.setState({ search });
  };

  onBtnSearch = () => {
    this.props.getProductAction(1, `?product_name=%${this.state.search}%`);
  };

  onBtnSubmit = () => {
    // value input ==> simpan di state
    let { idCategory, sortBy, minRange, maxRange } = this.state.searchFilter;

    let query = [];

    if (idCategory) query.push(`idcategory=${idCategory}`);
    if (sortBy) query.push(`sort=${sortBy}`);
    if (maxRange) {
      if (!minRange) minRange = 0;
      query.push(`pack_price=${minRange}[and]${maxRange}`);
    }

    this.props.getProductAction(1, `?${query.join("&")}`);
  };

  onBtnReset = () => {
    this.setState({
      searchFilter: {
        ...defaultSearchFilter,
      },
      search: "",
    });
    this.props.getProductAction(1);
  };

  setSearchFilter = (key, value) => {
    this.setState({
      searchFilter: {
        ...this.state.searchFilter,
        [key]: value,
      },
    });
  };
  printFilterAll = () => {
    return (
      <>
        <Col xl="2" lg="2" md="2">
          <Container fluid className="category-drop mt-2">
            <Row>
              <Col xl="12 mt-4">
                {/* FILTER */}
                <div className="filter">
                  <Col md="12">
                    <a className="trigger">
                      <FontAwesomeIcon icon={faFilter} /> FILTER
                    </a>
                  </Col>
                </div>
              </Col>

              {/* CATEGORY */}
              <Col md="12 mt-3" className="category-title">
                <Form>
                  <FormGroup row>
                    <div style={{ width: "13%", display: "flex" }}>
                      <Label for="checkbox2" xl={12}>
                        Category
                      </Label>
                      <Button
                        outline
                        color="secondary"
                        size="sm"
                        onClick={this.onBtnReset}
                      >
                        Reset
                      </Button>
                    </div>

                    <Col xl={{ size: 12 }}>
                      {category.map((item, index) => {
                        return (
                          <FormGroup check>
                            <Label check>
                              <Input
                                checked={
                                  item.id === this.state.searchFilter.idCategory
                                }
                                type="radio"
                                name="radio2"
                                value={item.nama}
                                onChange={() =>
                                  this.setSearchFilter("idCategory", item.id)
                                }
                              />
                              {item.nama}
                            </Label>
                          </FormGroup>
                        );
                      })}
                    </Col>
                  </FormGroup>
                </Form>
              </Col>

              <Col md="2" className="category-title">
                <hr className="mt-3" />
                <Form>
                  <FormGroup row>
                    <Label for="price" xl={12}>
                      Range Price
                    </Label>
                    <Col xl={{ size: 12 }}>
                      <div className="d-flex justify-content-center align-items-center">
                        <div>
                          <Input
                            type="number"
                            name="min"
                            placeholder="Minimum"
                            className="p-1"
                            style={{ fontSize: "13px" }}
                            value={this.state.searchFilter.minRange}
                            onChange={(e) =>
                              this.setSearchFilter("minRange", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <p>_</p>
                        </div>
                        <div>
                          <Input
                            type="number"
                            name="maks"
                            placeholder="Maximum "
                            className="p-1"
                            style={{ fontSize: "13px" }}
                            value={this.state.searchFilter.maxRange}
                            onChange={(e) =>
                              this.setSearchFilter("maxRange", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </Col>
                  </FormGroup>
                </Form>
              </Col>

              <Col md="12"></Col>

              <Col md="2" className="category-title">
                <hr className="mt-3" />
                <Form>
                  <FormGroup row>
                    <Label for="price" xl={12}>
                      Sort By
                    </Label>
                    <Col xl={{ size: 12 }}>
                      <FormGroup>
                        <Input
                          type="select"
                          name="select"
                          id="exampleSelect"
                          style={{ fontSize: "13px" }}
                          onChange={(e) =>
                            this.setSearchFilter("sortBy", e.target.value)
                          }
                        >
                          <option
                            value=""
                            selected={this.state.searchFilter.sortBy === ""}
                          >
                            -
                          </option>
                          <option
                            value="pack_price:desc"
                            selected={
                              this.state.searchFilter.sortBy ===
                              "pack_price:desc"
                            }
                          >
                            Highest Price
                          </option>
                          <option
                            value="pack_price:asc"
                            selected={
                              this.state.searchFilter.sortBy ===
                              "pack_price:asc"
                            }
                          >
                            Lowest Price
                          </option>
                          <option
                            value="product_name:asc"
                            selected={
                              this.state.searchFilter.sortBy ===
                              "product_name:asc"
                            }
                          >
                            A-Z
                          </option>
                          <option
                            value="product_name:desc"
                            selected={
                              this.state.searchFilter.sortBy ===
                              "product_name:desc"
                            }
                          >
                            Z-A
                          </option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </FormGroup>
                </Form>
              </Col>

              <Col md="12 submit mt-3">
                <a
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={this.onBtnSubmit}
                >
                  Submit
                </a>
              </Col>
            </Row>
          </Container>
        </Col>
      </>
    );
  };

  printFilter = () => {
    // MOBILE VIEW --> filter untuk mobile view
    return (
      <>
        <Modal
          isOpen={this.state.modal}
          toggle={() => {
            this.setState({ modal: !this.state.modal });
          }}
          style={{ marginTop: "30%" }}
          className="modal-filter"
        >
          <ModalBody>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Add Address</h6>
              <a
                className="close"
                onClick={() => {
                  this.setState({ modal: !this.state.modal });
                }}
                style={{ color: "white" }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </a>
            </div>

            <Container>
              <Row>
                <Col xl="12" lg="12" md="12">
                  <Container fluid className=" mt-2">
                    <Row>
                      <Col xl="12 mt-4">
                        {/* FILTER */}
                        <div className="filter">
                          <Col md="12">
                            <a className="trigger">
                              <FontAwesomeIcon icon={faFilter} /> FILTER
                            </a>
                          </Col>
                        </div>
                      </Col>

                      {/* CATEGORY */}
                      <Col md="12 mt-3" className="category-title">
                        <Form>
                          <FormGroup row>
                            <div style={{ width: "13%", display: "flex" }}>
                              <Label for="checkbox2" xl={12}>
                                Category
                              </Label>
                              <Button
                                outline
                                color="secondary"
                                size="sm"
                                onClick={this.onBtnReset}
                              >
                                Reset
                              </Button>
                            </div>

                            <Col xl={{ size: 12 }}>
                              {category.map((item, index) => {
                                return (
                                  <FormGroup check>
                                    <Label check>
                                      <Input
                                        checked={
                                          item.id ===
                                          this.state.searchFilter.idCategory
                                        }
                                        type="radio"
                                        name="radio2"
                                        value={item.nama}
                                        onChange={() =>
                                          this.setSearchFilter(
                                            "idCategory",
                                            item.id
                                          )
                                        }
                                      />
                                      {item.nama}
                                    </Label>
                                  </FormGroup>
                                );
                              })}
                            </Col>
                          </FormGroup>
                        </Form>
                      </Col>

                      <Col md="12" className="category-title">
                        <hr className="mt-3" />
                        <Form>
                          <FormGroup row>
                            <Label for="price" xl={12}>
                              Range Price
                            </Label>
                            <Col xl={{ size: 12 }}>
                              <div className="d-flex justify-content-center align-items-center">
                                <div>
                                  <Input
                                    type="text"
                                    name="min"
                                    placeholder="Minimum"
                                    className="p-1"
                                    style={{ fontSize: "calc(5px + 1vmin)" }}
                                    value={this.state.searchFilter.minRange}
                                    onChange={(e) =>
                                      this.setSearchFilter(
                                        "minRange",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <p>_</p>
                                </div>
                                <div>
                                  <Input
                                    type="text"
                                    name="maks"
                                    placeholder="Maksimum "
                                    className="p-1"
                                    style={{ fontSize: "calc(5px + 1vmin)" }}
                                    value={this.state.searchFilter.maxRange}
                                    onChange={(e) =>
                                      this.setSearchFilter(
                                        "maxRange",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </Col>
                          </FormGroup>
                        </Form>
                      </Col>

                      <Col md="12"></Col>

                      <Col md="12" className="category-title">
                        <hr className="mt-3" />
                        <Form>
                          <FormGroup row>
                            <Label for="price" xl={12}>
                              Sort By
                            </Label>
                            <Col xl={{ size: 12 }}>
                              <FormGroup>
                                <Input
                                  type="select"
                                  name="select"
                                  id="exampleSelect"
                                  style={{ fontSize: "13px" }}
                                  onChange={(e) =>
                                    this.setSearchFilter(
                                      "sortBy",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option
                                    value=""
                                    selected={
                                      this.state.searchFilter.sortBy === ""
                                    }
                                  >
                                    -
                                  </option>
                                  <option
                                    value="pack_price:desc"
                                    selected={
                                      this.state.searchFilter.sortBy ===
                                      "pack_price:desc"
                                    }
                                  >
                                    Highest Price
                                  </option>
                                  <option
                                    value="pack_price:asc"
                                    selected={
                                      this.state.searchFilter.sortBy ===
                                      "pack_price:asc"
                                    }
                                  >
                                    Lowest Price
                                  </option>
                                  <option
                                    value="product_name:asc"
                                    selected={
                                      this.state.searchFilter.sortBy ===
                                      "product_name:asc"
                                    }
                                  >
                                    A-Z
                                  </option>
                                  <option
                                    value="product_name:desc"
                                    selected={
                                      this.state.searchFilter.sortBy ===
                                      "product_name:desc"
                                    }
                                  >
                                    Z-A
                                  </option>
                                </Input>
                              </FormGroup>
                            </Col>
                          </FormGroup>
                        </Form>
                      </Col>

                      <Col md="12 submit mt-3">
                        <a
                          style={{ color: "white" }}
                          onClick={this.onBtnSubmit}
                        >
                          Submit
                        </a>
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Container>
          </ModalBody>
        </Modal>
      </>
    );
  };

  onAddCart = (id, netto, price_pack, name) => {
    if (!this.props.iduser) {
      this.setState({ modalProtection: !this.modalProtection });
    } else {
      let iduser = this.props.iduser;
      let product_name = name;
      let idproduct = id;
      let qty = 1;
      let total_netto = qty * netto;
      let price = parseInt(price_pack);

      // fungsi add to cart
      axios
        .post(URL_API + `/product/add-to-cart`, {
          iduser: iduser,
          idproduct: idproduct,
          qty: qty,
          total_netto: total_netto,
          price: price,
          product_name: product_name,
        })
        .then((res) => {
          let token = localStorage.getItem("tkn_id");
          this.props.keepLogin(token);
          this.setState({show:true,showMessage:res.data})
          setTimeout(() => {
            this.setState({show:false,})
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  render() {
    const { currentPage, todosPerPage } = this.state;
    // Logic for displaying todos
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = this.props.product.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(this.props.product.length / todosPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }
    return (
      <Container fluid className="mt-5">
        <Container style={{position:"fixed",zIndex:999,top:"10%"}} className="p-3 my-2 rounded">
        <Toast isOpen={this.state.show}>
          <ToastHeader>
            Add To Cart
          </ToastHeader>
          <ToastBody>
            {this.state.showMessage}
          </ToastBody>
        </Toast>
        </Container>
        <Row>
          {/* Sidebar */}
          {this.printFilterAll()}

          {/* Banner */}
          <Col xl="10 mt-4" lg="10 mt-3" md="10 mt-3" sm="12 mt-3" xs="12 mt-3">
            {/* <Container fluid>
              <Row>
                <Col md="12">
                  <Carousel
                    showThumbs={false}
                    showStatus={false}
                    showArrows={true}
                    axis={"vertical"}
                    className="carousel-product"
                  >
                    <div>
                      <img src={BannerProduct} />
                    </div>
                  </Carousel>
                </Col> */}

                {/* BANNER KANAN */}
              {/* </Row>
            </Container> */}

            {/* EXPLORE CATEGORY */}
            <Container className="mt-2">
              <Row>
                <div className="explore-category mt-3 d-none">
                  <Col md="12" className="text-bolder">
                    Explore Popular Categories
                  </Col>
                  <Col md="12">
                    <Slider {...settings}>
                      {category.map((item) => {
                        return (
                          <div className="mt-2 card-popular">
                            <Card tag="card">
                              {/* <CardImg
                              width="100%"
                              src={item.img}
                              alt="sanmol"
                              className="img-fluid p-2"
                              style={{
                                borderRadius: "15px",
                              }}
                            /> */}
                              <p className="title-products text-center">
                                {item.nama}
                              </p>
                            </Card>
                          </div>
                        );
                      })}
                    </Slider>
                  </Col>
                </div>
              </Row>
            </Container>

            {/* PRODUCTS */}
            <Container>
              <Row className="g-0">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="product-title">
                    <h4></h4>
                  </div>
                  <div>
                    <div class="input-group">
                      <div class="form-outline">
                        <Input
                          type="search"
                          id="form1"
                          class="form-control p-1"
                          value={this.state.search}
                          onChange={(e) => this.handleSearch(e.target.value)}
                        />
                      </div>
                      <Button
                        color="primary "
                        style={{ paddingInline: "12px", paddingBlock: "0px" }}
                        onClick={this.onBtnSearch}
                      >
                        <FontAwesomeIcon icon={faSearch} />
                      </Button>
                    </div>
                  </div>
                </div>
                <Col md="12" className="text-bolder mt-3">
                  <div className="explore-filter ">
                    <Col md="12">
                      {this.printFilter()}
                      <a
                        className="trigger"
                        onClick={() => {
                          this.setState({ modal: !this.state.modal });
                        }}
                      >
                        <FontAwesomeIcon icon={faFilter} /> Filter
                      </a>
                    </Col>
                  </div>
                </Col>

                {currentTodos.map((item) => (
                  <Col
                    xl="2 mt-2"
                    lg="2 mt-2"
                    md="3 mt-2"
                    sm="3 mt-2"
                    xs="4 mt-2"
                  >
                    <Card
                      style={{
                        // borderRadius: "15px",
                        margin: "5px",
                        minHeight: "270px",
                        borderRadius: "8px",
                        backgroundColor: "rgb(245,247,251)",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                      className="card-medicine"
                    >
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
                            onClick={() => {
                              this.onAddCart(
                                item.idproduct,
                                item.netto,
                                item.pack_price,
                                item.product_name
                              );
                            }}
                          />
                          <span>Add to cart</span>
                        </li>
                      </ul>
                      <Link
                        to={`/detail?product=${item.product_name.replace(
                          /\s/g,
                          "-"
                        )}-${item.idproduct}`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <CardBody className="p-2 d-flex flex-column">
                          <img
                            top
                            width="100%"
                            height="180px"
                            src={
                              item.images[0].includes('http') ?
                              item.images[0] : `${URL_API}/${item.images}`
                            }
                            alt={item.product_name}
                            className="img-fluid "
                            style={{ height: "180px" }}
                          />
                          <CardTitle className="title-products pt-2">
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
                            Rp. {item.pack_price.toLocaleString()}
                          </CardSubtitle>
                        </CardBody>
                      </Link>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>

            <Container className="mt-5">
              <Row>
                <Col md="4 m-auto" xs="9 m-auto" sm="4 m-auto">
                  <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                      <PaginationLink first href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink previous href="#" />
                    </PaginationItem>
                    {pageNumbers.map((item) => {
                      return (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            key={item}
                            id={item}
                            onClick={(event) => this.handleClick(event)}
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                  </Pagination>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>

        <Modal
          isOpen={this.state.modalProtection}
          toggle={() =>
            this.setState({ modalProtection: !this.state.modalProtection })
          }
        >
          <ModalHeader>Cannot do transaction!</ModalHeader>
          <ModalBody>To continue transaction please login!</ModalBody>
          <ModalFooter>
            <Link to="/login">
              <Button
                color="primary"
                onClick={() =>
                  this.setState({
                    modalProtection: !this.state.modalProtection,
                  })
                }
              >
                Login
              </Button>{" "}
            </Link>
            <Button
              color="secondary"
              onClick={() =>
                this.setState({ modalProtection: !this.state.modalProtection })
              }
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

const mapStateToProps = ({ productReducer, authReducer }) => {
  return {
    product: productReducer.product_list,
    iduser: authReducer.iduser,
  };
};
export default connect(mapStateToProps, { getProductAction, keepLogin })(
  ProductPage
);
