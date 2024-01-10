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
  ModalBody,
  ModalHeader,Collapse,
  Form,Pagination,PaginationItem,PaginationLink
} from "reactstrap";
import HTTP from "../service/HTTP.js";
import Upload from "../assets/images/bg-upload.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera,faExclamationCircle,faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "../assets/css/TransactionPage.css";
import { URL_API } from "../Helper";
import axios from "axios";
import { connect } from "react-redux";
import { TabMenu } from 'primereact/tabmenu';
import { Rating } from 'primereact/rating';

class TransactionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      historyTransactions: [],
      modal: false,
      modalUpload: false,
      modalPayment: false,
      detailTransactions: [],
      file: Upload,
      fileUpload: null,
      alertMessage: "",
      color: "",
      alertUpload: false,
      idtransaction: null,
      statusTrans: 4,
      activeIndex: 0,
      modalType: 'detail',
      productReview: [],
      currentPage: 1,
      todosPerPage: 5
    };
    this.handleChange = this.handleChange.bind(this);

    this.items = [
      { label: 'Request', icon: 'pi pi-fw pi-question', status: 4 },
      { label: 'Accept', icon: 'pi pi-fw pi-question', status: 6 },
      { label: 'Waiting Confirmation', icon: 'pi pi-fw pi-inbox', status: 5 },
      { label: 'On Progress', icon: 'pi pi-fw pi-spinner', status: 1 },
      { label: 'Done', icon: 'pi pi-fw pi-check', status: 2 },
      { label: 'Reject', icon: 'pi pi-fw pi-times', status: 3 }
    ];
  }

  componentDidMount() {
    this.getTransactionHistory(4);
  }

  getDetailTransactions = async (idtransaction) => {
    try {
      let res = await HTTP.get(`/user/detail-transactions/${idtransaction}`)
      this.setState({ detailTransactions: res.data })
      console.log("detail trans", res.data)
    } catch (error) {
      console.log(error)
    }
    // HTTP.get(`/user/detail-transactions/${idtransaction}`)
    //   .then((res) => {
    //     this.setState({
    //       detailTransactions: res.data,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  handleClick = (event) => {
    this.setState({
      currentPage: Number(event.target.id),
    });
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

  onProductReviewChange = (rating, idproduct, index, idtransaction) => {
    console.log(rating, idproduct, idtransaction)
    this.state.productReview[index]= { idproduct, rating, idtransaction }
    this.setState({ productReview: this.state.productReview }, () => console.log("after", this.state.productReview))
  }

  onInputChange = (review, index) => {
    this.state.productReview[index] = {...this.state.productReview[index], review}
    this.setState({ productReview: this.state.productReview }, () => console.log("after IC", this.state.productReview))
  }

  onBtnSubmitReview = async () =>{
    try {
      await HTTP.post('/product/review', this.state.productReview)
      this.getTransactionHistory()
      this.setState({modal: !this.state.modal})
    } catch (error) {
      console.log(error)
    }
  }
  printModal = (modalType) => {
    if (modalType === 'detail') {
      return (
        <>
          <Modal isOpen={this.state.modal}>
            <ModalBody>
              <Container>
                <Row>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="pt-4">Detail Transaction</p>
                    <Button
                      color="danger"
                      onClick={() => {
                        this.setState({ modal: !this.state.modal });
                      }}
                    >
                      X
                    </Button>
                  </div>
                  <hr style={{border: "2px solid rgba(34, 129, 133, 1)"}} className="mt-3"/>
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
                        <Col md="12">
                          <p>
                            Note : <br />
                            {item.note}
                          </p>
                        </Col>
                      </>
                    );
                  })}

                  <Col md="6"></Col>
                </Row>
              </Container>
              <hr style={{border: "2px solid rgba(34, 129, 133, 1)"}}/>
              <Container>
                <Row>
                  {this.state.detailTransactions.map((item, idx) => {
                    return (
                      <>
                      {item.idtype === 1 && item.iduser ? (<><Col md="4">
                          <img src={
                            item.image_url.includes("http")
                              ? `${item.image_url}`
                              
                              : `${URL_API}/${item.image_url}`
                          } width="100%" alt="user-image"/>
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
                        </>):(<>
                          
                          {item.img_order_url && !item.image_url ? (<><Col md="12"><h6>Image Perscription</h6><img src={
                          item.img_order_url.includes("http")
                            ? `${item.img_order_url}`
                            
                            : `${URL_API}/${item.img_order_url}`
                        } width="100%" alt="img-perscription"/></Col></>):(<><Col md="4"><img src={
                          item.image_url.includes("http")
                            ? `${item.image_url}`
                            
                            : `${URL_API}/${item.image_url}`
                        } width="100%" alt="img-perscription"/></Col></>)}
                          
                        
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
                      </Col></>):
                        (<></>)}
                        </>)}  
                      </>
                    );
                  })}
                </Row>
              </Container>
              <Container>
              <hr style={{border: "2px solid rgba(34, 129, 133, 1)"}}/>
                <Row style={{lineHeight:"4px"}}>
                  {this.state.detailTransactions.splice(0, 1).map((item, idx) => {
                    return (
                      <>
                      {item.shipping_cost || item.total_price ? 
                      (<><Col md="4"><strong>Shipping Cost</strong></Col>
                      <Col md="8"><p> Rp.{item.shipping_cost.toLocaleString()}</p></Col>
                      <Col md="4"><strong>Total</strong></Col>
                      <Col md="8"><p> Rp.{item.total_price.toLocaleString()}</p></Col></>):
                      (<><center><p><i>Please Wait Admin Accept Your Custom Order.</i></p></center></>)}
                      </>
                    );
                  })}
                </Row>
              </Container>
            </ModalBody>
          </Modal>
        </>
      );
    } else if (modalType === 'review') {
      return (
        <Modal isOpen={this.state.modal} toggle={() => this.setState({ modal: !this.state.modal })}>
          <ModalHeader>Review</ModalHeader>

          <Container className="p-3">
            {this.state.detailTransactions.map((item, idx) => {

              return (
                <>
                  {/* <img src={item.image_url} height="30%" /> */}
                  <strong>{idx + 1}. {item.product_name}</strong>
                  <br />
                  <div className="d-flex">
                    <span>Rating : </span>
                    <Rating value={this.state.productReview[idx] && this.state.productReview[idx].rating} onChange={(e) => this.onProductReviewChange(e.value, item.idproduct, idx, item.idtransaction)} className="mx-1" />
                  </div>
                  <Form>
                    <FormGroup>
                      <Label>Review :</Label>
                      <Input value={this.state.productReview[idx] && this.state.productReview[idx].review} onChange={(e) => this.onInputChange(e.target.value, idx)}/>
                    </FormGroup>
                  </Form>
                  <br />
                </>
              );
            })}
            <Button className="my-2" onClick={this.onBtnSubmitReview}>
              Submit Review
            </Button>
          </Container>
        </Modal>
      )
    }
  };

  getTransactionHistory = (status = 4) => {
    if (status) {
      console.log("status trans", status)
      let value = `?id_transaction_status=${status}`;

      HTTP.get(`/user/sort-transactions${value}`)
        .then((res) => {
          this.setState({
            historyTransactions: res.data,
          });

          console.log("res history", res.data)
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let value = ``;

      HTTP.get(`/user/sort-transactions${value}`)
        .then((res) => {
          this.setState({
            historyTransactions: res.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };


  onBtnTransactionProof = () => {
    let formData = new FormData();
    let data = {
      idtransaction: this.state.idtransaction,
      id_transaction_status: 5,
    };
    formData.append("data", JSON.stringify(data));
    formData.append("images", this.state.fileUpload);

    if (this.state.fileUpload !== null) {
      let token = localStorage.getItem("tkn_id");
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios
        .post(URL_API + `/user/upload-transaction`, formData, headers)
        .then((res) => {
          this.setState({
            modalUpload: !this.state.modalUpload,
            alertUpload: !this.state.alertUpload,
            color: "success",
            alertMessage: res.data.message,
          });
          setTimeout(() => {
            this.setState({
              alertUpload: !this.state.alertUpload,
            });
          }, 3000);
          this.getTransactionHistory();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  printModalPayment = () => {
    return (
      <>
        <Modal isOpen={this.state.modalPayment}>
          <div className="d-flex justify-content-between header-upload">
            <p>Payment Details</p>

            <Button
              outline
              color="danger"
              onClick={() => {
                this.setState({ modalPayment: !this.state.modalPayment });
              }}
            >
              X
            </Button>
          </div>

          <ModalBody className="body-upload">
          <Container className="mt-1">
            <Row>
                <center>
                <Col md="12"><h6>Complete your payment</h6></Col>
                <Col md="5 mt-3" style={{border:`3px solid #76B3B4`}}>
                    <center>
                    {/* <h3>Rp {this.props.location.state.total_price}</h3> */}
                    {this.state.detailTransactions.splice(0,1).map((item,idx)=>{
                      return (<><h3>Rp {item.total_price.toLocaleString()}</h3></>)
                    })}
                    </center>
                </Col>
                </center>
                    <center>
                <Col md="12 mt-5 p-3" style={{border:`1px solid #ccc`,borderRadius:"15px"}}>
                    {/* <hr style={{border: "2px solid rgba(34, 129, 133, 1)"}} className="mt-3"/> */}
                    <div className="d-flex justify-content-between align-items-center">
                    <img src="https://infobanknews.com/wp-content/uploads/2018/05/logo-BNI-46-1.png" width="20%" alt="bank-logo"/>
                    <h6>BNI Virtual Account</h6>
                    </div>
                    <hr style={{border: "2px solid rgba(34, 129, 133, 1)"}} className="mt-3"/>
                    <div className="d-flex justify-content-between align-items-center">
                    {this.props.phone_number !== "" ? (<><h6>827{this.props.phone_number}</h6></>):(<><h6>827938216555</h6></>)}
                    <h6>Virtual Account Number</h6>
                    </div>
                </Col>
                <div className="btn-getstarted mt-4">
                </div>
                    </center>
                    <center>
                <Col md="12">
                    <div style={{textAlign:"left"}}>
                    <h5 className="mt-5">Payment Guide</h5>
                    <div className="d-flex justify-content-between mt-3">
                    <a  onClick={()=>{this.setState({collapse:!this.state.collapse})}} style={{cursor:"pointer"}}>ATM BNI</a>
                    <a onClick={()=>{this.setState({collapse:!this.state.collapse})}} style={{cursor:"pointer"}}><FontAwesomeIcon icon={faAngleDown} /></a>
                    </div>
                    <Collapse
                    isOpen={this.state.collapse}
                    // onEntering={onEntering}
                    // onEntered={onEntered}
                    // onExiting={onExiting}
                    // onExited={onExited}
                    >
                    <p style={{color:"#A6A6A6"}}> 1. Insert your Card.<br/>
                        2. Select a language.<br/>
                        3. Enter your ATM PIN.<br/>
                        4. Select "More Menu".<br/>
                        5. Select "Transfers".<br/>
                        6. Select the type of account you will use (Example: "From a Savings Account").<br/>
                        7. Select "Virtual Account Billing".<br/>
                        8. Enter your Virtual Account number.<br/>
                        9. The bill to be paid will appear on the confirmation screen.<br/>
                        10. Confirm, if it is appropriate, continue the transaction.<br/>
                        11. The transaction has been completed.</p>
                        </Collapse>
                        </div>

                        <div>
                        <div className="d-flex justify-content-between mt-3">
                        <a  onClick={()=>{this.setState({collapse1:!this.state.collapse1})}} style={{cursor:"pointer"}}>Mobile Banking BNI</a>
                        <a onClick={()=>{this.setState({collapse1:!this.state.collapse1})}} style={{cursor:"pointer"}}><FontAwesomeIcon icon={faAngleDown} /></a>
                        </div>
                        <Collapse
                        isOpen={this.state.collapse1}
                        // onEntering={onEntering}
                        // onEntered={onEntered}
                        // onExiting={onExiting}
                        // onExited={onExited}
                        >
                        <p style={{color:"#A6A6A6",textAlign:"left"}}> 
                        1. Access BNI Mobile Banking from your cellphone then enter your user ID and password.<br/>
                        2. Select the "Transfer" menu.<br/>
                        3. Select the "Virtual Account Billing" menu then select a debit account.<br/>
                        4. Enter your Virtual Account number in the "new input" menu.<br/>
                        5. The bill to be paid will appear on the confirmation screen.<br/>
                        6. Confirm the transaction and enter the Transaction Password.<br/>
                        7. Your Payment Has Been Successful</p>
                        </Collapse>
                        </div>

                        <div>
                        <div className="d-flex justify-content-between mt-3">
                        <a  onClick={()=>{this.setState({collapse2:!this.state.collapse2})}} style={{cursor:"pointer"}}>SMS Banking BNI</a>
                        <a onClick={()=>{this.setState({collapse2:!this.state.collapse2})}} style={{cursor:"pointer"}}><FontAwesomeIcon icon={faAngleDown} /></a>
                        </div>
                        <Collapse
                        isOpen={this.state.collapse2}
                        // onEntering={onEntering}
                        // onEntered={onEntered}
                        // onExiting={onExiting}
                        // onExited={onExited}
                        >
                        <p style={{color:"#A6A6A6",textAlign:"left"}}> 
                        1. Open the BNI SMS Banking application<br/>
                        2. Select the Transfer menu<br/>
                        3. Select the BNI account Trf menu<br/>
                        4. Enter the destination account number with a 16-digit Virtual Account Number.<br/>
                        5. Enter the transfer amount according to your bill or obligation. Different denominations cannot be processed.<br/>
                        6. Select "Process" then "Agree"<br/>
                        7. Reply sms by typing the pin according to the command<br/>
                        8. Transaction Successful</p>
                        </Collapse>
                        </div>

                        <div className="mb-5">
                        <div className="d-flex justify-content-between mt-3">
                        <a  onClick={()=>{this.setState({collapse3:!this.state.collapse3})}} style={{cursor:"pointer"}}>Transfer from other bank</a>
                        <a onClick={()=>{this.setState({collapse3:!this.state.collapse3})}} style={{cursor:"pointer"}}><FontAwesomeIcon icon={faAngleDown} /></a>
                        </div>
                        <Collapse
                        isOpen={this.state.collapse3}
                        // onEntering={onEntering}
                        // onEntered={onEntered}
                        // onExiting={onExiting}
                        // onExited={onExited}
                        >
                        <p style={{color:"#A6A6A6",textAlign:"left"}}> 
                        1. Select the "Interbank transfer" or "Interbank online transfer" menu.<br/>
                        2. Enter the BNI bank code (009) or select the destination bank, namely BNI.<br/>
                        3. Enter the 16 Digit Virtual Account Number in the destination account field.<br/>
                        4. Enter the transfer amount according to your bill or obligation. Different denominations cannot be processed.<br/>
                        5. Enter the payment amount: .
                        6. Confirmation of your details will appear on the screen, check and if it is appropriate please continue the transaction until it is complete.<br/>
                        7. Transaction Successful.</p>
                        </Collapse>
                        </div>
                </Col>
                </center>
            </Row>
        </Container>          
        </ModalBody>
        </Modal>
      </>
    );
  };

  printModalUploadTransactions = () => {
    return (
      <>
        <Modal isOpen={this.state.modalUpload}>
          <div className="d-flex justify-content-between header-upload">
            <p>UPLOAD PAYMENT PROOF</p>

            <Button
              outline
              color="danger"
              onClick={() => {
                this.setState({ modalUpload: !this.state.modalUpload });
              }}
            >
              X
            </Button>
          </div>

          <ModalBody className="body-upload">
            <Container>
              <Col md="12 pb-5">
                <Container className="contain-upload">
                  <Row>
                    <Col md="12" className="card-upload">
                      <center className="mt-3">
                        <img
                          src={this.state.file}
                          alt="file"
                          width="250px"
                          height="200px"
                        />
                      </center>
                    </Col>
                    <div className="d-flex justify-content-evenly align-items-center">
                      <div class="image-upload">
                        <label for="file-input">
                          <div className="btn-getstarted mt-3">
                            <a>
                              <span>
                                <FontAwesomeIcon icon={faCamera} />
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
                    </div>
                    {this.state.file !== Upload && (
                      <>
                        <Button
                          color="primary"
                          className="btn-upload mt-4"
                          onClick={() => {
                            this.onBtnTransactionProof();
                          }}
                        >
                          SUBMIT
                        </Button>
                      </>
                    )}
                  </Row>
                </Container>
                {/* <h6>Upload Your Proof Transactions</h6> */}
              </Col>
            </Container>
          </ModalBody>
        </Modal>
      </>
    );
  };

  onTabChange = (status) => {
    this.getTransactionHistory(status)
    let index = this.items.findIndex(item => item.status === status)
    this.setState({ activeIndex: index })
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
    console.log("waw", this.state.historyTransactions);
    console.log("iduser", this.props.iduser);
    // console.log("detran", this.state.detailTransactions);
    return (
      <Col md="10 mt-5">
        {this.printModalUploadTransactions()}
        <Container style={{ height: '100vh' }}>
          {this.printModal(this.state.modalType)}
          {this.printModalPayment()}
          <Row>
            <Col md="12">
              <TabMenu model={this.items} onTabChange={(e) => this.onTabChange(e.value.status)} activeIndex={this.state.activeIndex} />
            </Col>
            <Col md="12 mt-2">
              <Alert isOpen={this.state.alertUpload} >
                {this.state.alertMessage}
              </Alert>
            </Col>
            {
              this.state.historyTransactions.length > 0 ?
              currentTodos.map((item) => {
                  return (
                    <>
                    {item.idtype === 1 && item.iduser === this.props.iduser ? (<><Col md="12">
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
                              <Col md="3">
                                <CardTitle tag="h6">Order Type</CardTitle>
                                <CardText>Pack</CardText>
                              </Col>
                              <Col md="2">
                                <CardTitle tag="h6">Status</CardTitle>
                                <CardText>{item.status_name}</CardText>
                              </Col>
                              <Col
                                md="3"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Button
                                  color="warning"
                                  onClick={() => {
                                    this.setState({ modal: !this.state.modal, modalType: 'detail' });
                                    this.getDetailTransactions(item.id);
                                  }}
                                >
                                  Detail
                                </Button>
                                &nbsp; &nbsp;
                                {item.status_name === "request"  && (
                                  <>
                                    <Button
                                      color="primary"
                                      onClick={() => {
                                        this.setState({
                                          modalUpload: !this.state.modalUpload,
                                          idtransaction: item.id,
                                        });
                                      }}
                                    >
                                      Upload
                                    </Button>
                                  </>
                                )}
                                {item.status_name === "accept"  && (
                                  <>
                                    <Button
                                      color="primary"
                                      onClick={() => {
                                        this.setState({
                                          modalUpload: !this.state.modalUpload,
                                          idtransaction: item.id,
                                        });
                                      }}
                                    >
                                      Upload
                                    </Button>
                                  </>
                                )}
                                {
                                  item.status_name === "done" && (
                                    <Button
                                      color="success"
                                      onClick={() => {
                                        this.getDetailTransactions(item.id)
                                        this.setState({ modal: !this.state.modal, modalType: 'review' })
                                      }}
                                      disabled={parseInt(item.review)}>
                                        {
                                          parseInt(item.review) ?
                                          'Product Reviewed' :
                                          'Review Product' 
                                        }
                                    </Button>
                                  )
                                }
                              </Col>
                              <Col md="9 pt-3" style={{fontSize:"0.9em",color:"#ccc"}}><FontAwesomeIcon icon={faExclamationCircle} /> Your order will be processed after the proof of payment has been confirmed</Col>
                              <Col md="3 pl-5">{item.status_name === "request" && (<><a onClick={() => {
                                  this.setState({ modalPayment: !this.state.modalPayment });
                                  this.getDetailTransactions(item.id);
                                }} style={{cursor:"pointer",fontSize:"0.9em"}}>How to pay ?</a></>)}</Col>   
                            </Row>
                          </Container>
                        </Card>
                      </Col>
                      </>):
                      item.idtype === 2 && item.iduser === this.props.iduser &&(<><Col md="12">
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
                            <Col md="3">
                              <CardTitle tag="h6">Order Type</CardTitle>
                              <CardText>Custom</CardText>
                            </Col>
                            <Col md="2">
                              <CardTitle tag="h6">Status</CardTitle>
                              <CardText>{item.status_name}</CardText>
                            </Col>
                            <Col
                              md="3"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                color="warning"
                                onClick={() => {
                                  this.setState({ modal: !this.state.modal, modalType: 'detail' });
                                  this.getDetailTransactions(item.id);
                                }}
                              >
                                Detail
                              </Button>
                              &nbsp; &nbsp;
                              {item.status_name === "request" && (
                                <>
                                  {/* <Button
                                    color="primary"
                                    onClick={() => {
                                      this.setState({
                                        modalUpload: !this.state.modalUpload,
                                        idtransaction: item.id,
                                      });
                                    }}
                                  >
                                    Upload
                                  </Button> */}
                                </>
                              )}
                              {item.status_name === "accept" && (
                                <>
                                  <Button
                                    color="primary"
                                    onClick={() => {
                                      this.setState({
                                        modalUpload: !this.state.modalUpload,
                                        idtransaction: item.id,
                                      });
                                    }}
                                  >
                                    Upload
                                  </Button>
                                </>
                              )}
                              {
                                item.status_name === "done" && (
                                  <Button
                                    color="success"
                                    onClick={() => {
                                      this.getDetailTransactions(item.id)
                                      this.setState({ modal: !this.state.modal, modalType: 'review' })
                                    }}
                                    disabled={parseInt(item.review)}>
                                      {
                                        parseInt(item.review) ?
                                        'Product Reviewed' :
                                        'Review Product' 
                                      }
                                  </Button>
                                )
                              }
                            </Col>
                            {item.status_name === "accept" && (<><Col md="9 pt-3" style={{fontSize:"0.9em",color:"#ccc"}}><FontAwesomeIcon icon={faExclamationCircle} /> Your order will be processed after the proof of payment has been confirmed</Col>
                              <Col md="3 pl-5"><a onClick={() => {
                                  this.setState({ modalPayment: !this.state.modalPayment });
                                  this.getDetailTransactions(item.id);
                              }}
                                 style={{cursor:"pointer",fontSize:"0.9em"}}>How to pay ?</a></Col></>)}
                            
                          </Row>
                        </Container>
                      </Card>
                    </Col></>)}
                    </>
                  );
                })
                :
                <h6>No records found</h6>
            }
          </Row>
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
        </Container>
      </Col>
    );
  }
}

const mapStateToProps = ({ authReducer }) => {
  return {
    ...authReducer
  }
}
export default connect(mapStateToProps)(TransactionPage);
