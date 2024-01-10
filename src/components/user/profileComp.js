import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  Alert,
  ModalBody,
} from "reactstrap";
import {
  faCamera,
  faPlus,
  faTimes,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../assets/css/profilePage.css";
import Profile from "../../assets/images/profile.png";
import {
  getCity,
  getAddress,
  keepLogin,
} from "../../action";
import { connect } from "react-redux";
import axios from "axios";
import { URL_API } from "../../Helper";
import HTTP from "../../service/HTTP";


class ProfileComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modals: false,
      file: this.checkImage(),
      isOpen: false,
      alert: false,
      alert1: false,
      message: "",
      message1: "",
      color: "",
      color1: "",
      tooltipOpen: false,
      address: [],
      fileUpload: null,
      allImage: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  
  componentDidMount() {
    let token = localStorage.getItem("tkn_id");
    this.props.keepLogin(token)
    this.props.getCity();
  }

  checkImage = () =>{
    if(this.props.user.profile_image){
      return  `${URL_API}/${this.props.user.profile_image}`
    }
    return Profile
  }

  handleChange(e) {
    let file = e.target.files[0]
    this.setState({
        fileName: file.name,
        fileUpload: file,
        file: URL.createObjectURL(file),
      });
  }

 onBtSave = () => {
    let formData = new FormData();
    let data = {
      iduser: this.props.user.iduser,
      fullName: this.fullNameIn.value,
      gender: this.genderIn.value,
      email: this.emailIn.value,
      phone_number: this.phoneNumberIn.value,
      age: parseInt(this.ageIn.value),
    };
    formData.append("data", JSON.stringify(data));
    console.log("fileupload", this.state.fileUpload);
    
    if (this.state.fileUpload !== null) {
      if (
        this.state.fileUpload.type.split("/")[1] === "jpeg" ||
        this.state.fileUpload.type.split("/")[1] === "jpg"
      ) {
        formData.append("images", this.state.fileUpload);  
      }
    }
    let token = localStorage.getItem("tkn_id");
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
        axios
      .patch(URL_API + `/user/patch-user`, formData, headers)
      .then((res) => {
        this.setState({
          alert1: !this.state.alert1,
          color1: "success",
          message1: res.data.message,
        });
        setTimeout(() => {
          this.setState({
            alert1: !this.state.alert1,
          });
        }, 3000);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onBtnEditAddress = () => {
    let idaddress = this.state.address.id;
    let tag = this.tagEd.value;
    let recipient = this.recipientEd.value;
    let iduser = this.props.user.iduser;
    let origin = parseInt(this.cityEd.value);
    let address = this.addressEd.value;
    let postalCode = parseInt(this.postalCodeEd.value);
    if (
      tag === "" &&
      recipient === "" &&
      this.cityEd.value === "" &&
      address === "" &&
      this.postalCodeEd.value === ""
    ) {
    } else {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn_id")}`,
        },
      };
      HTTP
        .patch(`/user/patch-address`, {
          idaddress,
          tag,
          recipient,
          iduser,
          origin,
          address,
          postalCode,
        },headers)
        .then((res) => {
          this.props.getAddress(this.props.user.iduser);
          this.setState({
            modals: !this.state.modals,
            alert: !this.state.alert,
            color: "success",
            message: res.data.message,
          });
          setTimeout(() => {
            this.setState({
              alert: !this.state.alert,
            });
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onBtnSetDefault = (idaddressIn) => {
    let idaddress = idaddressIn;
    const headers = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn_id")}`,
      },
    };
    axios
      .patch(URL_API + `/user/set-default`, {
        idaddress: idaddress,
      },headers)
      .then((res) => {
        // this.props.getAddress(this.props.user.iduser);
        let token = localStorage.getItem("tkn_id");
        this.props.keepLogin(token);
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
        modal: !this.state.modal,
        alert: !this.state.alert,
        color: "danger",
        message: "please fill empty field",
      });
      setTimeout(() => {
        this.setState({
          alert: !this.state.alert,
        });
      }, 3000);
    } else {
      const headers = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn_id")}`,
        },
      };
      HTTP
        .post(`/user/post-address`, {
          tag,
          recipient,
          iduser,
          origin,
          address,
          postalCode,
        },headers)
        .then((res) => {
          this.props.getAddress(this.props.user.iduser);
          this.setState({
            modal: !this.state.modal,
            alert: true,
            color: "success",
            message: res.data.message,
          });
          setTimeout(() => {
            this.setState({
              alert: false,
            });
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  onBtnDeleteAddress = (idx) => {
    const headers = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tkn_id")}`,
      },
    };
    HTTP
      .delete(`/user/delete-address/?id=${idx}`,headers)
      .then((res) => {
        this.props.getAddress(this.props.user.iduser);
        this.setState({
          alert: !this.state.alert,
          color: "success",
          message: res.data.message,
        });
        setTimeout(() => {
          this.setState({
            alert: !this.state.alert,
          });
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  btnAddAddress = () => {
    return (
      <div>
        <Modal
          isOpen={this.state.modal}
          toggle={() => {
            this.setState({ modal: !this.state.modal });
          }}
          size="md"
          style={{ marginTop: "10%" }}
        >
          <ModalBody>
            <Container>
              <Row>
                <div className="d-flex justify-content-between">
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
                <hr className="divider-profile" />
                <Form className="d-flex justify-content-between inputan">
                  <Col md="6">
                    <FormGroup>
                      <Label for="addressName" tag="span">
                        Address Name
                      </Label>
                      <Input
                        type="text"
                        name="addressName"
                        id="addressName"
                        placeholder="Enter address"
                        className="form-inputan"
                        innerRef={(e) => (this.tagIn = e)}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label for="recipientName" tag="span">
                        Recipient Name
                      </Label>
                      <Input
                        type="text"
                        name="recipientName"
                        id="recipientName"
                        className="form-inputan"
                        placeholder="Enter recipient name"
                        innerRef={(e) => (this.recipientIn = e)}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Form>
                <Form className="d-flex justify-content-between inputan">
                  <Col md="6">
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
                  <Col md="6">
                    <FormGroup>
                      <Label for="postalCode" tag="span">
                        Postal Code
                      </Label>
                      <Input
                        type="number"
                        name="postalCode"
                        id="postalCode"
                        className="form-inputan"
                        placeholder="Enter address postal code"
                        innerRef={(e) => (this.postalCodeIn = e)}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Form>
                <Form className="d-flex justify-content-between inputan">
                  <Col md="12">
                    <Label for="address" tag="span">
                      Address
                    </Label>
                    <div className="d-flex justify-content-between">
                      <Input
                        type="textarea"
                        name="address"
                        className="form-inputan"
                        id="address"
                        placeholder="Eneter your address"
                        size="lg"
                        innerRef={(e) => (this.addressIn = e)}
                        required
                      />
                    </div>
                  </Col>
                </Form>
              </Row>
            </Container>

            {/* <Form className="d-flex justify-content-between inputan"></Form> */}
            <Form className=" inputan"></Form>
            <Form className="d-flex justify-content-between inputan"></Form>
            <Form className="inputan"></Form>
            <div className="mt-3 ">
              <a
                style={{ color: "white", marginTop: "15px" }}
                className="add"
                onClick={this.onBtnAddAddress}
              >
                Add
              </a>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  };

  btnEditAddress = () => {
    return (
      <div>
        <Modal
          isOpen={this.state.modals}
          toggle={() => {
            this.setState({ modal: !this.state.modals });
          }}
          style={{ marginTop: "10%" }}
        >
          <ModalBody>
            <div className="d-flex justify-content-between align-items-center">
              <h6>Edit Address</h6>
              <a
                className="close"
                onClick={() => {
                  this.setState({ modals: !this.state.modals });
                }}
                style={{ color: "white" }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </a>
            </div>
            <hr className="divider-profile" />
            <Form className="d-flex justify-content-between inputan">
              <FormGroup>
                <Label for="addressName" tag="span">
                  Address Name
                </Label>
                <Input
                  type="text"
                  name="addressName"
                  id="addressName"
                  placeholder="Enter address"
                  className="form-inputan"
                  defaultValue={this.state.address.tag}
                  innerRef={(e) => (this.tagEd = e)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="recipientName" tag="span">
                  Recipient Name
                </Label>
                <Input
                  type="text"
                  name="recipientName"
                  id="recipientName"
                  className="form-inputan"
                  placeholder="Enter recipient name"
                  defaultValue={this.state.address.recipient}
                  innerRef={(e) => (this.recipientEd = e)}
                  required
                />
              </FormGroup>
            </Form>
            <Form className=" inputan">
              <FormGroup>
                <Label for="city" tag="span">
                  City
                </Label>
                <Input
                  type="select"
                  name="select"
                  className="form-inputan"
                  id="exampleSelect"
                  defaultValue={this.state.address.id_city_origin}
                  innerRef={(e) => (this.cityEd = e)}
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
            </Form>
            <Form className="d-flex justify-content-between inputan">
              <FormGroup>
                <Label for="exampleEmail" tag="span">
                  Postal Code
                </Label>
                <Input
                  type="number"
                  name="postalCode"
                  id="postalCode"
                  defaultValue={this.state.address.postal_code}
                  className="form-inputan"
                  placeholder="Enter address postal code"
                  innerRef={(e) => (this.postalCodeEd = e)}
                  required
                />
              </FormGroup>
            </Form>
            <Form className="inputan">
              <Label for="exampleEmail" tag="span">
                Address
              </Label>
              <div className="d-flex justify-content-between">
                <Input
                  type="textarea"
                  name="email"
                  className="form-inputan"
                  id="exampleEmail"
                  placeholder="with a placeholder"
                  defaultValue={this.state.address.address}
                  size="lg"
                  innerRef={(e) => (this.addressEd = e)}
                  required
                />
              </div>
            </Form>
            <div className="mt-3 ">
              <a
                style={{ color: "white", marginTop: "15px" }}
                className="add"
                onClick={this.onBtnEditAddress}
              >
                Submit
              </a>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  };

  render() {
    return (
      <>
        <Col xl="10 mt-5 pb-5">
          <Col xl="12 pb-5">
            <Container>
              <Row>
                {/* {this.props.user.fullname ||
                  this.props.user.emailnull ||
                  this.props.user.phone_number ||
                  this.props.user.age ||
                  (this.props.user.gender && (
                    <>
                      <Col xl="10" lg="10" md="10" sm="10" xs="10">
                        <div className="text-center">75 of 100</div>
                        <Progress value={75}>You're almost Complete!</Progress>
                      </Col>
                      <Col
                        xl="2 mt-3"
                        lg="2 mt-3"
                        md="2 mt-3"
                        sm="2 mt-3"
                        xs="2 mt-3"
                      >
                        <p>
                          <a
                            style={{
                              textDecoration: "underline",
                              color: "gray",
                              paddingInline: "10px",
                              borderRadius: "50%",
                              background: "#ccc",
                            }}
                            href="#"
                            id="TooltipExample"
                          >
                            <FontAwesomeIcon icon={faExclamation} />
                          </a>
                        </p>
                        <Tooltip
                          placement="right"
                          isOpen={this.state.tooltipOpen}
                          target="TooltipExample"
                          toggle={() => {
                            this.setState({
                              tooltipOpen: !this.state.tooltipOpen,
                            });
                          }}
                        >
                          Input basic info to complete progress
                        </Tooltip>
                      </Col>
                    </>
                  ))} */}
              </Row>
            </Container>
          </Col>

          {/* EDIT PROFILE */}
          <Container>
            <Row>
              <Col md="3 mt-3 title">
                <p>EDIT PROFILE</p>
              </Col>
              <Col md="9">
                {" "}
                <div className="d-flex justify-content-start align-items-center profile-image">
                {this.props.user.profile_image ?(<></>):(<></>)}
                  <img
                    id="blah"
                    src={this.state.file}
                    width="100px"
                    height="100px"
                    alt="profile_image"
                  />
                  <div style={{ marginLeft: "15px" }}>
                    <p>
                      {this.props.user.fullname}
                      <br />
                      <span style={{ color: "#ccc" }}>
                        {this.props.user.length > 0 && (
                          <>{this.props.user.age} Years Old</>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  {/* UPLOAD IMAGE */}
                  <div class="image-upload">
                    <label for="file-input">
                      <div className="upload"></div>
                      <FontAwesomeIcon
                        icon={faCamera}
                        className="file-upload"
                      />
                    </label>

                    <input
                      id="file-input"
                      type="file"
                      accept="image/jpg, image/jpeg"
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <hr className="divider-profile" />

          {/* INPUT DATA */}
          <Col xl="10 mt-2">
            <Container>
              <Row>
                {this.btnAddAddress()}
                {this.btnEditAddress()}
                <Col md="3 title">
                  <p>BASIC INFO</p>
                </Col>
                <Col md="9">
                  <div className="inputan">
                    <Container fluid className="p-0">
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <Label for="exampleEmail" tag="span">
                              Full Name
                            </Label>
                            <Input
                              type="email"
                              name="email"
                              id="exampleEmail"
                              placeholder="with a placeholder"
                              // className="form-inputan"
                              innerRef={(e) => (this.fullNameIn = e)}
                              defaultValue={this.props.user.fullname}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6 ">
                          <FormGroup>
                            <Label for="exampleEmail" tag="span">
                              Email
                            </Label>
                            <Input
                              type="text"
                              name="email"
                              id="exampleEmail"
                              placeholder="Enter your email"
                              innerRef={(e) => (this.emailIn = e)}
                              value={this.props.user.email}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6 mt-3">
                          <FormGroup>
                            <Label for="phoneNumber" tag="span">
                              Phone Number
                            </Label>
                            <Input
                              type="text"
                              name="phoneNumber"
                              id="phoneNumber"
                              placeholder="Enter your phone number"
                              innerRef={(e) => (this.phoneNumberIn = e)}
                              defaultValue={this.props.user.phone_number}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6 mt-3">
                          <FormGroup>
                            <Label for="exampleEmail" tag="span">
                              Age
                            </Label>
                            <Input
                              type="number"
                              name="age"
                              id="age"
                              placeholder="Enter your age"
                              innerRef={(e) => (this.ageIn = e)}
                              defaultValue={this.props.user.age}
                              required
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6 mt-3">
                          <FormGroup>
                            <Label for="gender" tag="span">
                              Gender
                            </Label>
                            <Input
                              type="select"
                              name="select"
                              // className="form-inputan"
                              id="gender"
                              innerRef={(e) => (this.genderIn = e)}
                            >
                              {this.props.user.gender !== null ? (
                                <>
                                  <option
                                    defaultValue={this.props.user.gender}
                                    selected
                                    disabled
                                    hidden
                                  >
                                    {this.props.user.gender}
                                  </option>
                                </>
                              ) : (
                                <>
                                  <option disabled hidden>
                                    Choose your gender
                                  </option>
                                </>
                              )}

                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md="12 mt-3 btn-profile text-center ">
                          <Alert
                            color={this.state.color1}
                            isOpen={this.state.alert1}
                          >
                            {this.state.message1}
                          </Alert>
                        </Col>
                        <Col md="12 mt-3 btn-profile text-center ">
                          <a
                            style={{ color: "white", fontWeight: "bold" }}
                            onClick={this.onBtSave}
                          >
                            Save Changes
                          </a>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>
          <hr className="divider-profile mt-3" />

          {/* INPUT DATA */}
          <Col md="10 mt-2">
            <Container>
              <Row>
                <Col md="3 title">
                  <p>ADDRESS</p>
                </Col>
                <Col md="9">
                  <Alert color={this.state.color} isOpen={this.state.alert}>
                    {this.state.message}
                  </Alert>
                  <div className="btn-add">
                    <a
                      className=" text-white"
                      onClick={() => {
                        this.setState({ modal: !this.state.modal });
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </a>
                  </div>
                  <div className="inputan btn-address mt-3">
                    <div>
                      {this.props.user.address.map((item, idx) => {
                        return (
                          <>
                            {item.iduser === this.props.user.iduser && (
                              <>
                                <Card className=" card-profile mt-2">
                                  <CardBody>
                                    <div className="d-flex justify-content-between">
                                      <CardTitle tag="span">
                                        {item.recipient}
                                      </CardTitle>
                                      <CardTitle tag="span">
                                        <FontAwesomeIcon
                                          icon={faMapMarkerAlt}
                                          style={{ color: "#209AFF" }}
                                        />{" "}
                                        {item.tag}
                                      </CardTitle>
                                    </div>
                                    <br />
                                    <CardSubtitle
                                      tag="span"
                                      className="mb-2 text-muted"
                                    >
                                      {item.name}
                                    </CardSubtitle>
                                    <p>
                                      {item.address}, {item.postal_code}
                                    </p>
                                    <div className="d-flex justify-content-center">
                                      <a
                                        style={{ color: "white" }}
                                        className="btn-edit"
                                        onClick={() => {
                                          this.setState({
                                            address: item,
                                            modals: !this.state.modals,
                                          });
                                        }}
                                      >
                                        Edit Address
                                      </a>
                                      {item.set_default !== 1 && (
                                        <>
                                          <a
                                            style={{ color: "white" }}
                                            className="btn-delete"
                                            onClick={() => {
                                              this.onBtnDeleteAddress(item.id);
                                            }}
                                          >
                                            Delete
                                          </a>
                                          <a
                                            style={{ color: "white" }}
                                            className="btn-set-default"
                                            onClick={() => {
                                              this.onBtnSetDefault(item.id);
                                            }}
                                          >
                                            Set As Default
                                          </a>
                                        </>
                                      )}
                                    </div>
                                  </CardBody>
                                </Card>
                              </>
                            )}
                          </>
                        );
                      })}
                    </div>

                    {/* FORM ADRESS */}
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>
          <hr className="divider-profile" />
        </Col>
      </>
    );
  }
}

const mapStateToProps = ({ productReducer, authReducer }) => {
  return {
    user: authReducer,
    city: productReducer.city_list,
    profile: productReducer.profile_image,
  };
};

export default connect(mapStateToProps, {
  getCity,
  getAddress,
  keepLogin,
})(ProfileComp);
