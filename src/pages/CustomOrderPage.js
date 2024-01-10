import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalBody,
  Label,
  FormGroup,
  Input,
  Alert,
  Popover,
  PopoverHeader,
  PopoverBody,
} from "reactstrap";
import { connect } from "react-redux";
import { keepLogin, getCity, getAddress } from "../action";
import "../assets/css/CartPage.css";
import { faPlus, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HTTP from "../service/HTTP";
import { URL_API } from "../Helper";
import {Redirect} from "react-router-dom"
import Perscription from "../assets/images/perscription.jpg";

let token = localStorage.getItem("tkn_id");

class CustomOrderPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      dataShippingCost: [],
      alertMessage: "",
      showAlert: false,
      colorAlert: "",
      popoverOpen: false,
      popoverMessage: "",
      selectedAddress: null,
      shippingCost: 0,
      activeFormAddress: false,
      alertAddress: false,
      alertSuccessOpen: false,
      openAlertForm: false,
      file: Perscription,
      fileUpload: null,
      link : false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    this.props.getCity();
    const addresses = await this.getAddressDefault();
    if (addresses.length <= 0) {
      this.shippingCost()
    }else{
    const defaultAddress = addresses[0]
    const dataShippingCost = await this.getShippingCost(defaultAddress)
    this.setState({
      selectedAddress: defaultAddress,
      dataShippingCost,
    })
    }
  }

  handleChange(e) {
    // eslint-disable-next-line) {
    if (e.target.files[0]) {
      // var reader = new FileReader();
      this.setState({
        fileName: e.target.files[0].name,
        fileUpload: e.target.files[0],
        file: URL.createObjectURL(e.target.files[0]),
      });
    } else {
      this.setState({
        fileName: "Select file",
        fileUpload: null,
        file: this.state.file,
      });
    }
  }

  onBtnSetDefault = (idaddressIn) => {
    let idaddress = idaddressIn;
    let iduser = this.props.user.iduser;
    HTTP.patch(`/user/set-default`, {
      idaddress: idaddress,
      iduser: iduser,
    })
      .then((res) => {
        this.props.getAddress(this.props.user.iduser);
        this.getChangeAddressDefault()
        this.setState({ modal: !this.state.modal });
        this.getShippingCost()
        this.cekPrice();
        this.props.keepLogin(token);
        this.setState({ dataShippingCost: [], shippingCost: 0 });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onBtnAddAddress = () => {
    let tag = this.tagIn.value;
    let recipient = this.recipientIn.value;
    let iduser = this.props.user.iduser;
    let origin = parseInt(this.cityIn.value);
    let address = this.addressIn.value;
    let postalCode = parseInt(this.postalCodeIn.value);
    if (
      tag === "" ||
      recipient === "" ||
      origin === "" ||
      address === "" ||
      postalCode === "" ||
      tag === null ||
      recipient === null ||
      origin === null ||
      address === null ||
      postalCode === null
    ) {
      this.setState({
        alertAddress: !this.state.alertAddress,
        color: "danger",
        alertMessage: "please fill empty field",
      });
      setTimeout(() => {
        this.setState({
          alertAddress: !this.state.alertAddress,
        });
      }, 3000);
    } else {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn_id")}`,
        },
      };
      HTTP.post(`/user/post-address`, {
        tag,
        recipient,
        origin,
        address,
        postalCode,
      },headers)
        .then((res) => {
          this.props.getAddress(this.props.user.iduser);
          this.setState({
            // modal: !this.state.modal,
            activeFormAddress:false,
            alertAddress: !this.state.alertAddress,
            color: "success",
            alertMessage: res.data.message,
          });
          setTimeout(() => {
            this.setState({
              alertAddress: false,
            });
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  cekPrice = () => {
    return this.props.user.cart.reduce(
      (a, v) => (a = a + v.price + parseInt(this.state.shippingCost)),
      0
    );
  };

  getAddressDefault = () => {
    return HTTP.get(`/user/get-address?set_default=${1}&iduser=${this.props.user.iduser}`)
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        return err
      });
  };

  printAddressCard = () => {
    return (
      <>
        {this.props.user.address.map((item, idx) => {
          return (
            <>
              {item.set_default === 1 && (
                <>
                  <Col md="12" className="address-title-order">
                    <Container>
                      <Row>
                        <Col md="12" className="tag-order">
                          <a>{item.tag}</a>
                        </Col>
                      </Row>
                    </Container>
                  </Col>

                  <Col md="12 pt-5 pb-5" className="address-summary">
                    <Container>
                      <Row>
                        <Col md="10">
                          <h6>{item.recipient}</h6>

                          <div>
                            <p>
                              {item.name}
                              <br />
                              {item.address}
                            </p>
                          </div>
                        </Col>
                        <Col md="2 mt-3">
                          <Button
                            outline
                            color="primary"
                            onClick={() => {
                              this.setState({ modal: !this.state.modal });
                            }}
                          >
                            CHANGE
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                  </Col>
                </>
              )}
            </>
          );
        })}
      </>
    );
  };

  printChooseAddress = () => {
    return (
      <>
        <Modal
          size="lg"
          isOpen={this.state.modal}
          toggle={() => {
            this.setState({ modal: !this.state.modal });
          }}
        >
          {/* <ModalHeader
            toggle={() => {
              this.setState({ modal: !this.state.modal });
            }}
          >
            Modal title
          </ModalHeader> */}
          <ModalBody style={{ background: "#F7F7F7" }}>
            <Container>
              <Row>
                <Col md="12">
                  <div className="address-add d-flex justify-content-between">
                    <p></p>
                    <Button
                      outline
                      color="primary"
                      onClick={() => {
                        this.setState({
                          activeFormAddress: !this.state.activeFormAddress,
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
                  <Alert
                    isOpen={this.state.alertAddress}
                    color={this.state.color}
                  >
                    {this.state.alertMessage}
                  </Alert>
                </Col>
                {this.state.activeFormAddress === true && (
                  <>
                    <Container>
                      <Row className="mt-3">
                        <Col md="12" className="address-title-order">
                          <Container>
                            <Row>
                              <Col md="12" className="tag-order">
                                <a>Add New Address</a>
                              </Col>
                            </Row>
                          </Container>
                        </Col>
                        <Container className="add-new-address pb-5">
                          <Row>
                            <Col md="6 mt-4">
                              <FormGroup>
                                <Label for="recipient">Address Name</Label>
                                <Input
                                  type="text"
                                  name="recipient"
                                  id="recipient"
                                  placeholder="Enter recipient name"
                                  innerRef={(e) => (this.tagIn = e)}
                                />
                              </FormGroup>
                            </Col>
                            <Col md="6 mt-4">
                              <FormGroup>
                                <Label for="recipient">Recipient Name</Label>
                                <Input
                                  type="text"
                                  name="recipient"
                                  id="recipient"
                                  placeholder="Enter recipient name"
                                  innerRef={(e) => (this.recipientIn = e)}
                                />
                              </FormGroup>
                            </Col>
                            <Col md="6 mt-3">
                              <FormGroup>
                                <Label for="city" tag="span">
                                  City
                                </Label>
                                <Input
                                  type="select"
                                  name="select"
                                  className="form-inputan"
                                  id="city"
                                  innerRef={(e) => (this.cityIn = e)}
                                  // onChange={this.shippingCost}
                                  required
                                >
                                  {this.props.city.map((item) => {
                                    return (
                                      <>
                                        <option value={item.id}>
                                          {item.name}
                                        </option>
                                      </>
                                    );
                                  })}
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col md="6 mt-4">
                              <FormGroup>
                                <Label for="postalCode">Postal Code</Label>
                                <Input
                                  type="number"
                                  name="postalCode"
                                  id="postalCode"
                                  placeholder="Enter your postal coded"
                                  innerRef={(e) => (this.postalCodeIn = e)}
                                />
                              </FormGroup>
                            </Col>
                            <Col md="12 mt-3">
                              <FormGroup>
                                <Label for="address">Address</Label>
                                <Input
                                  type="textarea"
                                  name="address"
                                  id="address"
                                  placeholder="Enter your address"
                                  innerRef={(e) => (this.addressIn = e)}
                                />
                              </FormGroup>
                            </Col>
                            <div class="btn-transaction mt-5">
                              <center>
                                <a onClick={this.onBtnAddAddress}>
                                  Add New Address
                                </a>
                              </center>
                            </div>
                          </Row>
                        </Container>
                      </Row>
                    </Container>
                  </>
                )}
              </Row>
            </Container>
            {this.props.user.address.map((item, idx) => {
              return (
                <>
                  {item.set_default != 1 && (
                    <>
                      <Container className="mt-4">
                        <>
                          <Row>
                            <Col md="12" className="address-title-order">
                              <Container>
                                <Row>
                                  <Col md="12" className="tag-order">
                                    <a>{item.tag}</a>
                                  </Col>
                                </Row>
                              </Container>
                            </Col>

                            <Col md="12 pt-5 pb-5" className="address-summary">
                              <Container>
                                <Row>
                                  <Col md="10">
                                    <h6>{item.recipient}</h6>

                                    <div>
                                      <p>
                                        {item.name}
                                        <br />
                                        {item.address}
                                      </p>
                                    </div>
                                  </Col>
                                  <Col md="2 mt-3">
                                    <Button
                                      outline
                                      color="primary"
                                      onClick={() => {
                                        this.onBtnSetDefault(item.id);
                                      }}
                                    >
                                      SELECT
                                    </Button>
                                  </Col>
                                </Row>
                              </Container>
                            </Col>
                          </Row>
                        </>
                      </Container>
                    </>
                  )}
                </>
              );
            })}
          </ModalBody>
        </Modal>
      </>
    );
  };

  getChangeAddressDefault = () => {
    return HTTP.get(`/user/get-address?set_default=${1}&iduser=${this.props.user.iduser}`)
      .then((res) => {
        return this.setState({selectedAddress:res.data[0]}) 
      })
      .catch((err) => {
        return err
      });
  };

  printFormAddress = () => {
    return (
      <Container>
        <Row>
          {/* FORM ADDRESS */}
          <Col md="12 pb-3" className="title-address">
            <Container>
              <Row className="mt-3">
                <Col md="6">
                  <FormGroup>
                    <Label for="recipient">Recipient Name</Label>
                    <Input
                      type="text"
                      name="recipient"
                      id="recipient"
                      innerRef={(e) => (this.recipientForm = e)}
                      placeholder="Enter recipient name"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="postalCode">Postal Code</Label>
                    <Input
                      type="number"
                      name="postalCode"
                      id="postalCode"
                      innerRef={(e) => (this.postalCodeForm = e)}
                      placeholder="Enter your postal coded"
                    />
                  </FormGroup>
                </Col>
                <Col md="6 mt-3">
                  <FormGroup>
                    <Label for="city" tag="span">
                      City
                    </Label>
                    <Input
                      type="select"
                      name="select"
                      className="form-inputan"
                      innerRef={(e) => (this.cityForm = e)}
                      id="city"
                      onChange={this.onChange}
                      // innerRef={(e) => (this.originIn = e)}
                      // onChange={this.shippingCost}
                      required
                    >
                      {this.props.city.map((item) => {
                        return (
                          <>
                            <option value={item.id}>{item.name}</option>
                          </>
                        );
                      })}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md="6 mt-3">
                  <FormGroup>
                    <Label for="aaddress">Address</Label>
                    <Input
                      type="textarea"
                      name="aaddress"
                      id="aaddress"
                      innerRef={(e) => (this.addressForm = e)}
                      placeholder="Enter your address"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Container>
          </Col>
          {/* END FORM ADDRESS */}
        </Row>
      </Container>
    );
  };

  printFormPayment = () => {
    return (
      <>
        <Col md="12 mt-3 pb-3" className="title-address">
          <Container>
            <Row className="mt-3">
              <Col md="6">
                <FormGroup>
                  <Label for="recipient">Recipient Name</Label>
                  <Input
                    type="text"
                    name="recipient"
                    id="recipient"
                    placeholder="Enter recipient name"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="postalCode">Postal Code</Label>
                  <Input
                    type="number"
                    name="postalCode"
                    id="postalCode"
                    placeholder="Enter your postal coded"
                  />
                </FormGroup>
              </Col>
              <Col md="6 mt-3">
                <FormGroup>
                  <Label for="city" tag="span">
                    City
                  </Label>
                  <Input
                    type="select"
                    name="select"
                    className="form-inputan"
                    id="city"
                    innerRef={(e) => (this.cityIn = e)}
                    required
                  >
                    {this.props.city.map((item) => {
                      return (
                        <>
                          <option value={item.id}>{item.name}</option>
                        </>
                      );
                    })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6 mt-3">
                <FormGroup>
                  <Label for="aaddress">Address</Label>
                  <Input
                    type="textarea"
                    name="aaddress"
                    id="aaddress"
                    placeholder="Enter your address"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Container>
        </Col>
      </>
    );
  };

  onChange = (e) => {
    // this.getShippingCost();
    return this.setState({ shippingCost: this.serviceShippigIn.value });
    // return e.target.value;
  };

  getShippingCost = (address) => {
     return HTTP.post(`/transaction/shipping-cost`, {
        origin: 22,
        destination: address.id_city_origin,
        weight: 1000,
      })
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          return error;
        });
  };

  shippingCost = () => {
      HTTP.post(`/transaction/shipping-cost`, {
        origin: 22,
        destination: this.cityForm.value,
        weight: 1000,
      })
        .then((res) => {
          this.setState({ dataShippingCost: res.data });
        })
        .catch((error) => {
          return error
        });
  };

  printAlert = () => {
    return (
      <>
        <div className="p-3 my-2 rounded bg-docs-transparent-grid">
          <Alert color={this.state.colorAlert} isOpen={this.state.showAlert}>
            {this.state.alertMessage}
          </Alert>
        </div>
      </>
    );
  };

  printPopover = () => {
    return (
      <div className="mt-2">
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target="Popover1"
          // toggle={() => this.setState({ popoverOpen: !this.state.popoverOpen })}
        >
          <PopoverHeader>{this.state.popoverMessage}</PopoverHeader>
          <PopoverBody>You can't add more quantity</PopoverBody>
        </Popover>
      </div>
    );
  };

  checkoutPerscription = () => {
    let formData = new FormData();
    let token = localStorage.getItem("tkn_id");
    let data = {
      id_transaction_status: 4,
      invoice: `PRM#CLICK${new Date().valueOf()}`,
      id_city_origin: 22,
      id_city_destination: this.state.selectedAddress.id_city_origin,
      recipient: this.state.selectedAddress.recipient,
      postal_code: this.state.selectedAddress.postal_code,
      expedition: this.shippingIn.value,
      service: parseInt(this.serviceShippigIn.value),
      address: this.state.selectedAddress.address,
      shipping_cost: 0,
      total_price: 0,
      note: this.noteIn.value,
      idtype: 2,
    };
    formData.append("data", JSON.stringify(data));
    formData.append("images", this.state.fileUpload);
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (this.state.file === Perscription) {
      this.setState({
        alertSuccessOpen: !this.state.alertSuccessOpen,
        color: "danger",
        alertMessage: "You Must Upload Image Perscription",
      });
    } else if(this.props.user.role !== 'user'){
      this.setState({
        openAlertForm: !this.state.openAlertForm,
        color: "danger",
        alertMessage: "You must login to continue checkout.",
      });
    }else{
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn_id")}`,
        },
      };
      HTTP
        .post(`/transaction/checkout-perscription`, formData, headers)
        .then((res) => {
          this.props.keepLogin(token);
          this.setState({
            alertSuccessOpen: !this.state.alertSuccessOpen,
            color: "success",
            alertMessage: res.data.message,
          });
          setTimeout(() => {
            this.setState({link:true})
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  checkoutFormPerscription = () => {
    let formData = new FormData();

    let data = {
      id_transaction_status: 4,
      invoice: `PRM#CLICK${new Date().valueOf()}`,
      id_city_origin: 22,
      id_city_destination: this.cityForm.value,
      recipient: this.recipientForm.value,
      postal_code: parseInt(this.postalCodeForm.value),
      address: this.addressForm.value,
      expedition: this.shippingIn.value,
      service: parseInt(this.serviceShippigIn.value),
      shipping_cost: 0,
      total_price: this.cekPrice(),
      note: this.noteIn.value,
      idtype: 2,
    };

    formData.append("data", JSON.stringify(data));
    formData.append("images", this.state.fileUpload);
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (
      data.recipient === "" ||
      this.postalCodeForm.value === "" ||
      data.address === "" ||
      this.state.file === Perscription
    ) {
      this.setState({
        openAlertForm: !this.state.openAlertForm,
        color: "danger",
        alertMessage: "Please fill all field.",
      });
    } else if(this.props.user.role !== 'user'){
      this.setState({
        openAlertForm: !this.state.openAlertForm,
        color: "danger",
        alertMessage: "You must login to continue checkout.",
      });
    }else{
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn_id")}`,
        },
      };
      HTTP
        .post(URL_API + `/transaction/checkout-perscription`, formData, headers)
        .then((res) => {
          this.props.keepLogin(token);
          this.setState({
            alertSuccessOpen: !this.state.alertSuccessOpen,
            color: "success",
            alertMessage: res.data.message,
          });
          setTimeout(() => {
            this.setState({link:true})
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    console.log("user", this.props.user);
    console.log("shipping cost", this.state.dataShippingCost);
    console.log("shipping cost5", this.state.shippingCost);
    // console.log("selected address", this.state.selectedAddress.id_city_origin);
    console.log("selected address", this.state.selectedAddress);
    // console.log("cek", this.checkIdProduct());
    if(this.state.link){
      return <Redirect push to ={{
        pathname: "/profile", 
        state: { 
          indexActive:3
        }
      }} style={{ textDecoration: "none" }}>
    </Redirect>
    }

    return (
      <Container className="p-5" style={{ backgroundColor: "#F7F7F7" }} fluid>
        <Row>
          <Col md="12 mt-5">
            <h4>Shopping Cart</h4>
          </Col>
          <Col md="8 mt-3">
            {/* FOR ADDRESS */}
            <Container>
              <Row>
                <Col md="12" className="title-address mb-3">
                  <Container>
                    <Row>
                      <Col md="1 pt-3">
                        <a>1</a>
                      </Col>
                      <Col md="10 pt-3">
                        <p>SHIPPING ADDRESS</p>
                      </Col>
                    </Row>
                  </Container>
                </Col>
                <Col md="12">
                  <Alert
                    isOpen={this.state.openAlertForm}
                    color={this.state.color}
                  >
                    {this.state.alertMessage}
                  </Alert>
                </Col>
              </Row>
            </Container>

            {this.props.user.address.length > 0 ? (
              <>
                <Container className=" mt-1 ">
                  <Row className="row-address">
                    {this.printChooseAddress()}
                    {/* PRINT CARD */}
                    {this.printAddressCard()}
                  </Row>
                </Container>
                <Container>
                  <Row>
                    <Col md="12 mt-3" className="title-address mb-3">
                      <Container>
                        <Row>
                          <Col md="1 pt-3">
                            <a>2</a>
                          </Col>
                          <Col md="10 pt-3">
                            <p>SHIPPING SERVICES</p>
                          </Col>
                        </Row>
                      </Container>
                    </Col>
                  </Row>
                </Container>

                {/* SHIPPING FORM */}
                <Container>
                  <Row className="form-shipping">
                    <Col md="12">
                      <Container>
                        <Row>
                          <Col md="6">
                            <FormGroup>
                              <Label for="exampleSelect">Expedition</Label>
                              <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                required="true"
                                // onChange={()=>{this.setState({expedition:this.value})}}
                                innerRef={(e) => (this.shippingIn = e)}
                              >
                                {this.state.dataShippingCost.map(
                                  (item, idx) => {
                                    return (
                                      <>
                                        <option value="JNE">JNE</option>
                                      </>
                                    );
                                  }
                                )}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <Label for="exampleSelect">Service</Label>
                              <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                innerRef={(e) => (this.serviceShippigIn = e)}
                                onChange={this.onChange}
                              >
                                <option value={0}>Choose Service</option>
                                {this.state.dataShippingCost.map(
                                  (item, idx) => {
                                    console.log("ITEM", item.cost);
                                    return (
                                      <>
                                        {item.cost.cost.map((val, index) => {
                                          return (
                                            <>
                                              <option value={idx}>
                                                {item.cost.service} (
                                                {item.cost.description})
                                              </option>
                                            </>
                                          );
                                        })}
                                      </>
                                    );
                                  }
                                )}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md="6"></Col>
                        </Row>
                      </Container>
                    </Col>
                  </Row>
                </Container>
                <div class="btn-transaction mt-5">
                  <Alert
                    isOpen={this.state.alertSuccessOpen}
                    color={this.state.color}
                  >
                    {this.state.alertMessage}
                  </Alert>
                  <center className="mt-4">
                    <a
                      onClick={() => {
                        this.checkoutPerscription();
                      }}
                    >
                      Checkout
                    </a>
                  </center>
                </div>
              </>
            ) : (
              <>
                {this.printFormAddress()}

                {/* SHIPPING COST */}
                <Container>
                  <Row>
                    <Col md="12 mt-3" className="title-address">
                      <Container>
                        <Row className="mt-3">
                          <Col md="1">
                            <a>2</a>
                          </Col>
                          <Col md="10">
                            <p>SHIPPING SERVICES</p>
                          </Col>
                        </Row>
                      </Container>
                    </Col>
                    {/* FORM PAYMENT */}
                    {/* {this.printFormPayment()} */}

                    {/* COURIER */}
                    <Container>
                      <Row className="form-shipping mt-3">
                        <Col md="12">
                          <Container>
                            <Row>
                              <Col md="6">
                                <FormGroup>
                                  <Label for="exampleSelect">Expedition</Label>
                                  <Input
                                    type="select"
                                    name="select"
                                    id="exampleSelect"
                                    innerRef={(e) => (this.shippingIn = e)}
                                  >
                                    <option value="JNE">JNE</option>
                                    )
                                  </Input>
                                </FormGroup>
                              </Col>
                              <Col md="6">
                                <FormGroup>
                                  <Label for="exampleSelect">Service</Label>
                                  <Input
                                    type="select"
                                    name="select"
                                    id="exampleSelect"
                                    innerRef={(e) =>
                                      (this.serviceShippigIn = e)
                                    }
                                    onChange={this.onChange}
                                  >
                                    <option value={0}>Choose Service</option>
                                    {this.state.dataShippingCost.map(
                                      (item, idx) => {
                                        console.log("ITEM", item.cost);
                                        return (
                                          <>
                                            {item.cost.cost.map((val, index) => { 
                                              return (
                                                <>
                                                  <option value={idx}>
                                                    {item.cost.service} (
                                                    {item.cost.description})
                                                  </option>
                                                </>
                                              );
                                            })}
                                          </>
                                        );
                                      }
                                    )}
                                  </Input>
                                </FormGroup>
                              </Col>
                              <Col md="6"></Col>
                            </Row>
                          </Container>
                        </Col>
                      </Row>
                    </Container>
                    {/* END FORM PAYMENT */}
                  </Row>
                </Container>
                <div class="btn-transaction mt-3">
                  <Alert
                    isOpen={this.state.alertSuccessOpen}
                    color={this.state.color}
                  >
                    {this.state.alertMessage}
                  </Alert>
                  <center className="mt-4">
                    <a
                      onClick={() => {
                        this.checkoutFormPerscription();
                      }}
                    >
                      Checkout
                    </a>
                  </center>
                </div>
              </>
            )}
          </Col>
          <Col md="4 mt-3">
            <Card className="row-order">
              <CardBody>
                <Container fluid>
                  <Row>
                    <Col md="12 ml-3" className="title-address">
                      <Container>
                        <Row>
                          <Col md="2 d-flex align-items-center ">
                            <a>3</a>
                          </Col>
                          <Col md="10 pt-2 d-flex align-items-center">
                            <h6 style={{ fontWeight: "900" }}>
                              UPLOAD PERSCRIPTION
                            </h6>
                          </Col>
                        </Row>
                      </Container>
                    </Col>
                    <Col md="12 mt-2">
                      {" "}
                      <img src={this.state.file} width="100%" />
                      <Col md="12">
                        <Label>Note</Label>
                        <Input
                          type="text"
                          placeholder="Remind Seller"
                          innerRef={(e) => (this.noteIn = e)}
                        />
                      </Col>
                      <center>
                        <div className="image-upload">
                          <label for="file-input">
                            <div className="btn-getstarted mt-3">
                              <a>
                                <span>
                                  <FontAwesomeIcon
                                    className="pt-2"
                                    icon={faCamera}
                                    style={{ color: "white" }}
                                  />
                                </span>{" "}
                                UPLOAD
                              </a>
                            </div>
                          </label>

                          <input
                            id="file-input"
                            type="file"
                            max-files="2000"
                            onChange={this.handleChange}
                          />
                        </div>
                      </center>
                    </Col>

                    {/* PRICE AND SHIPPING COST */}
                  </Row>
                </Container>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = ({ productReducer, authReducer }) => {
  return {
    user: authReducer,
    city: productReducer.city_list,
  };
};

export default connect(mapStateToProps, { keepLogin, getCity, getAddress })(
  CustomOrderPage
);
