import React from "react";
import {
  Col,
  Container,
  Row,
  Card,
  CardTitle,
  CardText,
  Button,
  FormGroup,
  Label,
  Input,
  Alert,
  Modal,
  ModalBody, CardBody, Pagination, PaginationItem, PaginationLink
} from "reactstrap";
import HTTP from "../../service/HTTP.js";
import Upload from "../../assets/images/bg-upload.png";
import "../../assets/css/TransactionPage.css";
import { URL_API } from "../../Helper.js";
import axios from "axios";
import { connect } from "react-redux";
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Dialog } from 'primereact/dialog';
import { Button as ButtonPrime } from 'primereact/button';
import { Toast } from "primereact/toast";

class TransactionAdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historyTransactions: [],
      modal: false,
      modalConfirmation: false,
      modalResi: false,
      modalUpload: false,
      detailTransactions: [],
      file: Upload,
      fileUpload: null,
      alertMessage: "",
      color: "",
      alertConfirm: false,
      idtransaction: null,
      currentPage: 1,
      todosPerPage: 5,
      detailConfirmation: [],
      loading: false,
      id: ''
    };
    this.statusName = {
      "request": "Waiting For Payment",
      "pending_confirmation": "Pending Confirmation",
      "waiting_shipping": "Waiting For Shipping",
      "shipped": "Shipped",
      "delivered": "Delivered",
      "done": "Accepted",
      "reject": "Rejected"
    }
  }

  componentDidMount() {
    this.getTransactionHistory();
  }

  getDetailTransactions = (idtransaction) => {
    HTTP.get(`/user/detail-transactions/${idtransaction}`)
      .then((res) => {
        this.setState({
          detailTransactions: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getConfirmationPayment = (idtransaction) => {
    HTTP.get(`/user/confirmation-payment/${idtransaction}`)
      .then((res) => {
        this.setState({
          detailConfirmation: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleClick = (event) => {
    this.setState({
      currentPage: Number(event.target.id),
    });
  }

  printModal = () => {
    return (
      <>
        <Modal isOpen={this.state.modal}>
          <ModalBody>
            <Container>
              <Row>

                <div className="d-flex justify-content-between ">
                  <h6 className="pt-3">Detail Transaction</h6>
                  <Button
                    color="danger"
                    onClick={() => {
                      this.setState({ modal: !this.state.modal });
                    }}
                  >
                    X
                  </Button>
                </div>
                <hr style={{ border: "2px solid rgba(34, 129, 133, 1)" }} className="mt-3" />
                {this.state.detailTransactions.slice(0, 1).map((item, idx) => {
                  return (
                    <>
                      {" "}
                      <Col md="6">
                        <p>
                          Recipient : <br />
                          {item.recipient}
                        </p>
                      </Col>
                      <Col md="6">
                        <p>
                          Address : <br />
                          {item.address}, {item.postal_code}
                        </p>
                      </Col>
                    </>
                  );
                })}

                <Col md="6"></Col>
              </Row>
            </Container>
            <hr style={{ border: "2px solid rgba(34, 129, 133, 1)" }} />
            <Container>
              <Row>
                {this.state.detailTransactions.map((item, idx) => {
                  return (
                    <>
                      {item.idtype === 1 ? (<><Col md="4">
                        <img src={item.image_url} width="100%" />
                      </Col>
                        <Col md="8 mt-3">
                          <p>
                            <strong>{item.product_name}</strong>
                            <br />
                            {item.brand}
                          </p>
                          <p>
                            Rp.{item.pack_price.toLocaleString()} X {item.qty_buy}
                          </p>
                        </Col>
                      </>) : (<>
                        {item.img_order_url && !item.image_url ? (<><Col md="12"><h6>Image Perscription</h6><img src={
                          item.img_order_url.includes("http")
                            ? `${item.img_order_url}`

                            : `${URL_API}/${item.img_order_url}`
                        } width="100%" /></Col></>) : (<><Col md="4"><img src={
                          item.image_url.includes("http")
                            ? `${item.image_url}`

                            : `${URL_API}/${item.image_url}`
                        } width="100%" /></Col></>)}


                        {item.unit_price || item.product_name || item.brand ?
                          (<><Col md="8 mt-3">
                            <p>
                              <strong>{item.product_name}</strong>
                              <br />
                              {item.brand}
                            </p>
                            <p>
                              netto : Rp.{item.unit_price.toLocaleString()}/{item.unit} X {item.qty_buy_total_netto}
                            </p>
                          </Col></>) :
                          (<></>)}
                      </>)}
                    </>
                  );
                })}
              </Row>
            </Container>
            <Container>
              <hr style={{ border: "2px solid rgba(34, 129, 133, 1)" }} />
              <Row style={{ lineHeight: "5px" }}>
                {this.state.detailTransactions.splice(0, 1).map((item, idx) => {
                  return (
                    <>
                      {item.shipping_cost || item.total_price ?
                        (<><Col md="4"><strong>Shipping Cost</strong></Col>
                          <Col md="8"><p> Rp.{item.shipping_cost.toLocaleString()}</p></Col>
                          <Col md="4"><strong>Total</strong></Col>
                          <Col md="8"><p> Rp.{item.total_price.toLocaleString()}</p></Col>
                          {item.id_transaction_status === 4 && (<><hr style={{ border: "2px solid rgba(34, 129, 133, 1)" }} />
                            <center><p><i>Please Wait User Upload Transaction Proof.</i></p></center></>)}</>) :
                        (<><center><p><i>Please Wait Admin Accept User Custom Order.</i></p></center></>)}
                    </>
                  );
                })}
              </Row>
            </Container>
            {this.state.detailConfirmation.length > 0 && <Container>
              <hr style={{ border: "2px solid rgba(34, 129, 133, 1)" }} />
              <Row>
                <Col md="12">
                  <div className="d-flex justify-content-between ">
                    <h6 className="pt-3">Payment Proof</h6>
                  </div>
                  {this.state.detailConfirmation.map((item, idx) => {
                    return (<><img src={
                      item.image_url.includes("http")
                        ? `${item.image_url}`

                        : `${URL_API}/${item.image_url}`
                    } width="100%" /></>)

                  })}
                </Col>
              </Row>
            </Container>}
          </ModalBody>
        </Modal>
      </>
    );
  };

  printModalConfirmation = () => {
    return (<><Modal isOpen={this.state.modalConfirmation}>
      <ModalBody>
        <Container>
          <Row>
            <Col md="12">
              <div className="d-flex justify-content-between ">
                <h6 className="pt-3">Payment Proof</h6>
                <Button
                  color="danger"
                  onClick={() => {
                    this.setState({ modalConfirmation: !this.state.modalConfirmation });
                  }}
                >
                  X
                </Button>
              </div>
              <hr style={{ border: "2px solid rgba(34, 129, 133, 1)" }} />
              {this.state.detailConfirmation.map((item, idx) => {
                return (<><img src={
                  item.image_url.includes("http")
                    ? `${item.image_url}`

                    : `${URL_API}/${item.image_url}`
                } width="100%" /></>)

              })}
            </Col>
          </Row>
        </Container>
      </ModalBody>
    </Modal></>)
  }

  inputResiFooter = () => (
    <React.Fragment>
      <ButtonPrime label="Cancel" icon="pi pi-times" className="p-button-danger p-button-text" onClick={() => this.setState({ modalResi: false })} />
      <ButtonPrime label="Save" icon="pi pi-check" className="p-button-success p-button-text"
        onClick={() => {
          this.setState({ loading: true })
          this.inputResi(this.state.id)
        }} loading={this.state.loading} />
    </React.Fragment>
  );

  printModalInputResi = () => {
    return (
      <Dialog visible={this.state.modalResi} style={{ width: '450px' }} header="Add New User" modal className="p-fluid " onHide={() => this.setState({ modalResi: false })} footer={this.inputResiFooter()}>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="w-100">
            <label style={{ fontWeight: 'bold' }}>Resi</label>
            <InputText value={this.state.resi} onChange={(e) => this.setState({ resi: e.target.value })} style={{ border: this.state.resi === "" ? '1px solid red' : null }} />
            {this.state.resi === "" ? <small className="p-error">Required.</small> : null}
          </div>
          {this.state.error && <Message severity="error" text="Fill all the form!" />}
        </div>
      </Dialog>
    );
  };

  removeDuplicates() {
    return Array.from(new Set(this.state.historyTransactions.map(a => a.iduser)))
      .map(id => {
        return this.state.historyTransactions.find(a => a.iduser === id)
      })
  };

  getTransactionHistory = () => {
    let token = localStorage.getItem("tkn_id");
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    let val = ""
    if (this.statusTrans.value && this.userTrans.value) {
      val = `?id_transaction_status=${this.statusTrans.value}&iduser=${this.userTrans.value}`
    } else if (this.statusTrans.value) {
      val = `?id_transaction_status=${this.statusTrans.value}`
    } else if (this.userTrans.value) {
      val = `?iduser=${this.userTrans.value}`
    } else if (this.statusTrans.value = "") {
      val = `/`
    }
    axios.get(URL_API + `/user/sort-transactions${val}`, headers)
      .then((res) => {
        this.setState({
          historyTransactions: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  confirmationTransaction = (id) => {
    HTTP.patch(`/transaction/accept/${id}`)
      .then((res) => {
        this.getTransactionHistory()
        this.setState({
          alertAccept: !this.state.alertAccept,
          alertMessage: res.data,
          color: "success"
        })
      }).catch((err) => {
        console.log(err)
      })
  }

  rejectTransaction = (id) => {
    HTTP.patch(`/transaction/reject/${id}`)
      .then((res) => {
        this.getTransactionHistory()
        this.setState({
          alertAccept: !this.state.alertAccept,
          alertMessage: res.data,
          color: "success"
        })
      }).catch((err) => {
        console.log(err)
      })
  }

  inputResi = (id) => {
    HTTP.patch(`/transaction/resi/${id}`, {
      resi: this.state.resi
    })
      .then((res) => {
        this.getTransactionHistory()
        this.setState({
          alertAccept: !this.state.alertAccept,
          alertMessage: res.data,
          color: "success",
          loading: false,
          modalResi: false
        })
        this.toast.show({
          severity: "success",
          summary: "Success!",
          detail: "Success update resi!",
          life: 3000,
        })
      }).catch((err) => {
        this.setState({ loading: false })
        console.log(err)
        this.toast.show({
          severity: "error",
          summary: "Failed!",
          detail: "Something bad happen!",
          life: 3000,
      })
      })
  }

  render() {
    const { currentPage, todosPerPage } = this.state;
    // Logic for displaying todos
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = this.state.historyTransactions.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(this.state.historyTransactions.length / todosPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }
    return (
      <div class="main-content">
        <main>
          <Toast ref={(el) => (this.toast = el)} />
          <Container className="pb-5"><Row>
            <Col md="8 mt-4">
              <Container>
                {this.printModal()}
                {this.printModalConfirmation()}
                {this.printModalInputResi()}
                <Row>
                  <h5>Transaction <hr style={{ border: "2px solid rgba(34, 129, 133, 1)" }} /></h5>
                  <Col md="12 mt-2">
                    <Alert isOpen={this.state.alertConfirm} color={this.state.color}>
                      {this.state.alertMessage}
                    </Alert>
                  </Col>
                  {currentTodos.map((item) => {
                    return (
                      <>
                        <Col md="12">
                          <Card
                            body
                            style={{
                              borderRadius: "15px",
                              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                              marginTop: "1%",
                              border: "none",
                            }}
                          >
                            <Container>
                              <Row>
                                <Col md="4">
                                  <CardTitle tag="h6">Invoice</CardTitle>
                                  <CardText>{item.invoice}</CardText>
                                </Col>
                                {item.idtype === 1 ? (<><Col md="3">
                                  <CardTitle tag="h6">Order Type</CardTitle>
                                  <CardText>Pack</CardText>
                                </Col></>) : (<><Col md="3">
                                  <CardTitle tag="h6">Order Type</CardTitle>
                                  <CardText>Custom</CardText>
                                </Col></>)}
                                <Col md="2">
                                  <CardTitle tag="h6">Status</CardTitle>
                                  <CardText>{this.statusName[item.status_name]}</CardText>
                                </Col>
                                <Col
                                  md="3"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >

                                  <div className="d-flex flex-wrap justify-content-center align-items-center">
                                    <Button
                                      color="warning"
                                      onClick={() => {
                                        this.setState({ modal: !this.state.modal });
                                        this.getDetailTransactions(item.id);
                                        this.getConfirmationPayment(item.id);
                                      }}
                                    >
                                      Detail
                                    </Button>
                                    {(this.props.role === "admin" || this.props.role === "seller") && item.status_name === "pending_confirmation" && <Button className="mt-1"
                                      color="primary"
                                      onClick={() => {
                                        this.confirmationTransaction(item.id)
                                      }}
                                    >
                                      Accept
                                    </Button>}
                                    {(this.props.role === "admin" || this.props.role === "seller") && item.status_name === "pending_confirmation" && <Button
                                      color="danger"
                                      className="mt-1"
                                      onClick={() => {
                                        this.rejectTransaction(item.id)
                                      }}
                                    >
                                      Reject
                                    </Button>}
                                    {(this.props.role === "admin" || this.props.role === "seller") && item.status_name === "waiting_shipping" && <Button
                                      color="danger"
                                      className="mt-1"
                                      onClick={() => this.setState({ modalResi: true, id: item.id })}
                                    >
                                      Input Resi
                                    </Button>}
                                  </div>
                                </Col>
                              </Row>
                            </Container>
                          </Card>
                        </Col>
                      </>
                    );
                  })}
                </Row>
                <Container className="mt-4">
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
                                onClick={this.handleClick}
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
              </Container>
            </Col>
            <Col md="4 mt-4">
              <Container>
                <Row>
                  <Col md="12">
                    <h5>Filter <hr style={{ border: "2px solid rgba(34, 129, 133, 1)" }} /></h5>
                    <Card className="mt-5">
                      <CardBody>
                        <Col md="12">
                          <FormGroup>
                            <Label for="exampleSelect">Status Transaction</Label>
                            <Input
                              type="select"
                              name="select"
                              id="exampleSelect"
                              onChange={this.getTransactionHistory}
                              innerRef={(e) => (this.statusTrans = e)}
                            >
                              <option value="">All</option>
                              <option value={1}>Waiting For Payment</option>
                              <option value={2}>Pending Confirmation</option>
                              <option value={3}>Waiting For Shipping</option>
                              <option value={4}>Shipped</option>
                              <option value={5}>Delivered</option>
                              <option value={6}>Accepted</option>
                              <option value={7}>Rejected</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                            <Label for="exampleSelect">List User</Label>
                            <Input
                              type="select"
                              name="select"
                              id="exampleSelect"
                              innerRef={(e) => (this.userTrans = e)}
                            >
                              <option value="">Choose User</option>
                              {this.removeDuplicates().map((item) => {
                                return (<><option value={item.iduser}>{item.fullname}</option></>)
                              })}

                            </Input>
                          </FormGroup>
                          <Button outline color="primary" size="sm" className="mt-2" onClick={this.getTransactionHistory}>Filter</Button>
                        </Col>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
          </Container>
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ authReducer }) => {
  return {
    ...authReducer
  }
}
export default connect(mapStateToProps)(TransactionAdminPage);
