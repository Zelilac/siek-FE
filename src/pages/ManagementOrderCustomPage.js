import React from 'react';
import {Container,Row,Col,Button,Modal,ModalBody,Alert,Label,Input,PaginationItem,PaginationLink,Pagination} from "reactstrap";
import { URL_API } from "../Helper";
import "../assets/css/ManagementOrder.css"
import HTTP from "../service/HTTP.js";
import { connect } from "react-redux";
import { getProductAction } from "../action";

class ManagementOrderCustomPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            historyTransactions:[],
            detailTransactions:[],
            modal:false,img_order:"",
            modalServe:false,
            products:[{idproduct: "", netto: "", unit: ""}],
            product:[],
            userTransactions:[],
            shippingCost:[],
            stock:[],
            invalid:false,
            alertMessage:"",
            alertInvalid:false,
            color:"",
            service:"",
            currentPage: 1,
            todosPerPage: 5,
         }
        //  this.handleRemoveFields.bind(this)
    }

    componentDidMount() {
        this.getTransactionHistory()
        this.props.getProductAction(2)
    }

    handleClick = (event) => {
        this.setState({
          currentPage: Number(event.target.id),
        });
      }

    onBtnSubmit = () =>{
        let iduser = this.state.userTransactions.iduser
        let idtransaction = this.state.userTransactions.id;
        let products = this.state.products;
        let destination = this.state.userTransactions.destination;
        let postalCode = this.state.userTransactions.postal_code;
        let recipient = this.recipientForm.value;
        let note = this.state.userTransactions.note;
        let address = this.state.userTransactions.address;
        let expedition = this.state.userTransactions.expedition;
        let service = this.state.service;
        let shippingCost = this.state.shippingCost;
        let totalPrice = this.checkPrice()
        console.log('cek submit cek 9',products,destination,postalCode,recipient,note,address,expedition,service,shippingCost)
        let token = localStorage.getItem("tkn_id");
        const headers = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        HTTP.post(`/transaction/perscription`,{
            iduser:iduser,
            idtransaction:idtransaction,
            products:products,
            destination:destination,
            postalCode:postalCode,
            recipient:recipient,
            note:note,
            address:address,
            expedition:expedition,
            service:service,
            shippingCost:shippingCost,
            totalPrice:totalPrice,
        },headers).then((res)=>{
            this.getTransactionHistory()
            alert(res.data.message)
            this.setState({modalServe:false})
        }).catch((err)=>{
            console.log(err)
        })
    }

    checkPrice = () => {
        let price = null
        price = this.state.products.reduce(
          (a, v) => (a = a + (v.total_netto*v.unit_price)),
          0
        );
        return price = parseInt(price) + parseInt(this.state.shippingCost)
      };

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

    getTransactionHistory = (val) => {
        let vals = `&id=${val}`
        if(val){
            const headers = {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('tkn_id')}`,
                },
              };
            HTTP.get( `/user/sort-transactions?idtype=2${vals}`,headers)
                .then((res) => {
                this.setState({      
                    userTransactions: res.data[0],
                });
                this.getShippingCost()
                })
                .catch((err) => {
                console.log(err);
                });
        }else{
            const headers = {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('tkn_id')}`,
                },
              };
            HTTP.get(`/user/sort-transactions?idtype=2&id_transaction_status=4`,headers)
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

    getShippingCost = (address) => {
     return HTTP.post(`/transaction/shipping-cost`, {
        origin: 22,
        destination: this.destinationForm.value,
        weight: 1000,
      })
        .then((res) => {
            let cost = null
        res.data[parseInt(this.state.userTransactions.service)].cost.cost.map((item,idx)=>{
            return cost = item.value
        })
          this.setState({shippingCost:cost,service:res.data[parseInt(this.state.userTransactions.service)].cost.service})
        })
        .catch((error) => {
          return error;
        });
  };

    handleProducts = (e, index) => {
        if(!this.qtyVal.value){

        }else{
        HTTP.get(`/product/2?idproduct=${this.productVal.value}`)
        .then((res)=>{
            this.setState({product:res.data[0]})
            res.data[0].stock.map((item,idx)=>{
                this.setState({stock:item})
            })
            this.state.products[index] = {id:index,idproduct:parseInt(this.productVal.value),netto:this.state.product.netto,total_netto:parseInt(this.qtyVal.value),unit:this.state.product.unit,unit_price:this.state.stock.unit_price };
            this.setState({ products: this.state.products});
        }).catch((err)=>{
            console.log(err)
        })
        if (e.target.value > this.state.stock.total_netto){
            e.target.value=this.state.stock.total_netto
            this.setState({ 
                invalid : true,
                alertMessage:`Stock not enough, 
                remaining stock is ${this.state.stock.total_netto}`,
                alertInvalid:true,
                color:"danger" 
            });
        }else{
            this.setState({ 
                invalid : false,
                alertInvalid:false 
            });
        }                 
        }     
    };

    onBtAddProducts = () => {
        this.state.products.push([{idproduct: "",netto: "", total_netto: "", unit: ""}]);
        this.setState({ products: this.state.products,alertInvalid:false });

    };

    handleRemoveFields = (id) => {
        const products=this.state.products
        products.splice(id,1)
        this.setState({products})
      }

//    handleRemoveFields = (index) =>{
//     let values  = [...this.state.products];
//     let lastVal = values.splice(index, 1);
//     return console.log('cek penghapusan',values.splice(index, 1))
//     this.setState({products:lastVal})
//    }

    printProducts = () => {
        if (this.state.products.length >= 0) {
        return this.state.products.map((item, index) => {
            console.log('ITEM NI BOUS',item.idproduct)
            return (
            <Container fluid className="p-0">
                <Row>
                    <Col md="4"><Label>Product Name</Label>
                        <Input type="select" name="select" id="exampleSelect" innerRef={(e) => (this.productVal = e)} onChange={(e) => this.handleProducts(e, index)}>
                                <option value={0}>Choose Product</option>
                                {this.props.products.map((val,idx)=>{
                                    return(<><option value={val.idproduct}>{val.product_name}</option></>)  
                                })}
                        </Input>
                    </Col>
                    <Col md="3">
                            <Label>Netto</Label>
                            <Input type="number" innerRef={(e) => (this.qtyVal = e)} onChange={(e) => this.handleProducts(e, index)} min={1} max={this.state.stock.total_netto}  />
                            {/* <FormFeedback invalid={this.state.invalid}>Stock not enough, remaining stock is {this.state.stock.total_netto}</FormFeedback> */}
                   </Col>
                    <Col md="3"><Label>Measure</Label>
                         <Input type="text" name="select" id="exampleSelect" innerRef={(e) => (this.unitVal = e)} value={item.unit} onChange={(e) => this.handleProducts(e, index)} disabled />
                    </Col>
                    {item.idproduct !== undefined  && (
                                <><Col md="1 mt-4">
                                    <Button
                                    color="success"
                                    type="button"
                                    size="sm"
                                    style={{ float: "right" }}
                                    onClick={this.onBtAddProducts.bind(this)}
                                    >
                                    +
                                    </Button>
                                </Col></>)}
                    
                                <Col md="1 mt-4">
                                    {/* {this.printProducts()} */}
                                    <Button
                                    color="danger"
                                    type="button"
                                    size="sm"
                                    style={{ float: "right" }}
                                    onClick={this.handleRemoveFields.bind(index, this)}
                                    >
                                    -
                                    </Button>
                                    </Col>
                </Row>
            </Container>
            );
        });
        }
    };

    printModalServeProduct = () =>{
        return(
            <>
                <Modal isOpen={this.state.modalServe}>
                    <ModalBody>
                        <Container>
                            <Row>
                             <div className="d-flex justify-content-between">
                    <p className="pt-2">Serve Transaction</p>
                    <Button
                        color="danger"
                        onClick={() => {
                        this.setState({ modalServe: !this.state.modalServe,products:[{idproduct: "",netto: "", total_netto: "", unit: ""}] });
                        }}
                    >
                        X
                    </Button>
                        </div>
                                
                                <Col md="12 mt-2"><img src={`${URL_API}/${this.state.img_order}`} width="100%"/></Col>
                                <hr style={{border: "2px solid rgba(34, 129, 133, 1)"}} className="mt-3"/>
                                <Col md="12">{this.printProducts()}</Col>
                                <Col md="12 mt-2"><Alert isOpen={this.state.alertInvalid} color={this.state.color} style={{fontSize:"11px"}}>{this.state.alertMessage}</Alert></Col>
                                <Col md="6">
                                    <Label>Destination</Label>
                                    <Input type="select" name="select" id="exampleSelect" innerRef={(e) => (this.destinationForm = e)} disabled>
                                        <option value={this.state.userTransactions.id_city_destination}>{this.state.userTransactions.destination}</option>
                                    </Input>
                                </Col>
                                <Col md="6">
                                    <Label>Postal Code</Label>
                                    <Input type="text" value={this.state.userTransactions.postal_code} innerRef={(e) => (this.postal_codeForm = e)} disabled/>
                                </Col>
                                <Col md="6 mt-1">
                                    <Label>Recipient</Label>
                                    <Input type="text" value={this.state.userTransactions.recipient} innerRef={(e) => (this.recipientForm = e)} disabled/>
                                </Col>
                                <Col md="6 mt-1">
                                    <Label>Note</Label>
                                    <Input type="text" value={this.state.userTransactions.note} innerRef={(e) => (this.noteForm = e)} disabled/>
                                </Col>
                                <Col md="12 mt-1">
                                    <Label>Address</Label>
                                    <Input type="textarea" value={this.state.userTransactions.address} innerRef={(e) => (this.addressForm = e)} disabled/>
                                </Col>
                                <Col md="6 mt-1">
                                    <Label>Expedition</Label>
                                    <Input type="text" value={this.state.userTransactions.expedition} innerRef={(e) => (this.expeditionForm = e)} disabled/>
                                </Col>
                                <Col md="6 mt-1">
                                    <Label>Service</Label>
                                    <Input type="text" value={this.state.service} innerRef={(e) => (this.serviceForm = e)} disabled/>
                                </Col>
                                <Col md="12 mt-1">
                                    <Label>Shipping Cost</Label>
                                    <Input type="number" value={this.state.shippingCost} innerRef={(e) => (this.shippingCostForm = e)} disabled/>
                                </Col>
                                <Col md="12 mt-1">
                                    <Button color="primary" width="100%" onClick={()=>{this.onBtnSubmit()}}>Submit</Button>
                                </Col>
                            </Row>
                        </Container>
                    </ModalBody>
                </Modal>
            </>
        )
    }

    render() { 
        console.log('img order',this.state.img_order)
        console.log('transaction history',this.state.historyTransactions)
        console.log('detail history',this.state.detailTransactions)
        console.log('products',this.state.product)
        console.log('products props',this.props.products)
        console.log('user',this.props.user)
        console.log('shippingCost',this.state.shippingCost)
        console.log('isi form products',this.state.products)
        console.log('service',this.state.service)
        console.log('user transaction',this.state.userTransactions)
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
        console.log("product",this.state.product)
        return ( 
            <div className="main-content">
                    <main>
                        <Container fluid>
                            <Row>
                                <Col md="12">
                                {this.printModalServeProduct()}
                                    <div className="wrapper rounded">
                                        <nav className="navbar navbar-expand-lg navbar-dark dark d-lg-flex align-items-lg-start"> <a className="navbar-brand" href="#" style={{color:"black"}}>Transactions <p className="pl-1">Serve Transactions</p> </a> 
                                        {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon"></span> </button> */}
                                        </nav>
                                        <Row className="mt-2 pt-2">
                                            <Col md="6" id="income">
                                                <div className="d-flex justify-content-start align-items-center" style={{color:"black"}}>
                                                    <p className="pi pi-credit-card"></p>
                                                    <p className=" mx-3" style={{color:"black"}}>Total Request Custom Order</p>
                                                    <p className=" money">{this.state.historyTransactions.length}</p>
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className="d-flex justify-content-md-end align-items-center" style={{color:"black"}}>
                                                    <div><i className="pi pi-user"></i></div>
                                                    <div className="mx-3">{this.props.user.fullname}</div>
                                                    {/* <div className="text-white ml-4 money">{this.props.user.role}</div> */}
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <ul className="nav nav-tabs w-75" >
                                                <li className="nav-item"> <a className="nav-link active" href="" style={{color:"black"}}>Request</a> </li>
                                                {/* <li className="nav-item"> <a className="nav-link" href="#">Reports</a> </li> */}
                                            </ul> 
                                            {/* <button className="btn btn-primary">New Transaction</button> */}
                                        </div>
                                        <div className="table-responsive mt-3">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" style={{color:"black"}}>Invoice</th>
                                                        <th scope="col" style={{color:"black"}}>Recipient</th>
                                                        <th scope="col" style={{color:"black"}}>Note</th>
                                                        <th scope="col" style={{color:"black"}}>Status</th>
                                                        <th scope="col" style={{color:"black"}}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {currentTodos.map((item,idx)=>{
                                                    return(
                                                        <>
                                                        {item.status_name === "request" &&(<><tr className="title-table">
                                                        <td>{item.invoice} </td>
                                                        <td>{item.recipient}</td>
                                                        <td>{item.note}</td>
                                                        <td>{item.status_name}</td>
                                                        <td><Button outline color="success" 
                                                        onClick={async()=>{await this.getTransactionHistory(item.id);
                                                        this.setState({modalServe:!this.state.modalServe,img_order:item.img_order_url});
                                                        }}>Serve</Button></td>
                                                        </tr></>)}
                                                        
                                                    </>
                                                    )
                                                })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center results"> <span className="pl-md-3">Showing<b style={{color:"black"}}> 1-{pageNumbers} of {currentTodos.length} </b> trasactions</span>
                                            <div className="pt-3">
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
                                                                style={{color:"black"}}
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
                                            </div>
                                        </div>
                                    </div> 
                                </Col>
                            </Row>
                        </Container>
                    </main>
                </div> 
                );
    }
}

const mapStateToProps = ({ productReducer, authReducer }) => {
  return {
    products: productReducer.product_list,
    user: authReducer,
    profile: productReducer.image_profile,
  };
};
 
export default connect(mapStateToProps,{ getProductAction})(ManagementOrderCustomPage);