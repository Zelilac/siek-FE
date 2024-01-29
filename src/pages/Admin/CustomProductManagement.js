import React from "react";
import "../../assets/css/SidebarComp.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { connect } from "react-redux";
import { getProductAction } from "../../action";
import "../../assets/css/ProductManagement.css";
import "primeflex/primeflex.css";
import DialogProductCustom from "../../components/DialogProductCustom";
import DialogAddCustom from "../../components/DialogAddCustom";
import DialogRestockCustom from "../../components/DialogRestockCustom";
import { Toast } from "primereact/toast";
import { URL_API } from "../../Helper";
import { ConfirmDialog } from "primereact/confirmdialog";
import HTTP from "../../service/HTTP";

class CustomProductManagementPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProduk: [],
      loading: false,
      costumers: [],
      productDialog: false,
      productRestockDialog:false,
      productDetail: [],
      addDialog: false,
      notif: false,
      selectedUnit: {},
      selectedCategory: {},
    };
    this.category = [
      { name: 'Seragam', id: 1 },
      { name: 'Alat Tulis', id: 2 },
      { name: 'Buku Cetak', id: 3 },
      { name: 'Olahraga', id: 4 },
  ];

    this.unit = [
      { name: 'pcs' },
      { name: 'lembar' },
      { name: 'roll' },
      { name: 'botol' }
  ]
  }

  componentDidMount() {
    this.props.getProductAction(2);
  }

  // componentWillUnmount() {
  //   this.props.getProductAction(2);
  // }
  //COLUMN BODY
  bodyImage = (rowData) => {
    if (rowData.images) {
      return (
        <img
          src={
            rowData.images[0].includes("http")
              ? `${rowData.images[0]}`
              
              : `${URL_API}/${rowData.images[0]}`
          }
          style={{ height: "100px", width: "100px" }}
        />
      );
    } else {
      return (
        <img
          src={"/"}
          alt="No image Available"
          style={{ height: "100px", width: "100px" }}
        />
      );
    }
  };

  bodyQty = (rowData) => {
    if (rowData.stock) {
      return rowData.stock.map((item, index) => {
        return (
          <>
            <Row>{item.qty}</Row>
          </>
        );
      });
    }
  };

  bodyType = (rowData) => {
    if (rowData.stock) {
      return rowData.stock.map((item, index) => {
        return (
          <>
            <Row>{item.type}</Row>
          </>
        );
      });
    }
  };

  bodyQty = (rowData) => {
    return rowData.stock.map((item, index) => {
      return (
        <>
          <Row>{item.qty}</Row>
        </>
      );
    });
  };

  bodyType = (rowData) => {
    return rowData.stock.map((item, index) => {
      return (
        <>
          <Row>{item.type}</Row>
        </>
      );
    });
  };

  bodyNetto = (rowData) => {
    return <Row>{`${rowData.netto} ${rowData.unit}`}</Row>;
  };

  bodyPrice = (rowData) => {
    return (
      <>
        <Row>IDR. {rowData.pack_price.toLocaleString()}</Row>
      </>
    );
  };


  bodyCategory = (rowData) => {
    return (
      <Row>
        <span style={{ textTransform: "capitalize" }}>{rowData.category}</span>
      </Row>
    );
  };

  bodyDescription = (rowData) => {
    return (<Row>{rowData.description}</Row>)
  }
  bodyEffect = (rowData) => {
    return (<Row>{rowData.effect ? rowData.effect.replace(/[+]/g, '\n') : null}</Row>)
  }
  bodyUsage = (rowData) => {
    return (<Row>{rowData.usage}</Row>)
  }
  bodyDosage = (rowData) => {
    return (<Row>{rowData.dosage}</Row>)
  }

  editProduct = async (product) => {
    try {
      let index = this.category.findIndex(
        (item) => item.name.toLocaleLowerCase() === product.category
      );
      let unitIndex = this.unit.findIndex(
        (item) => item.name.toLocaleLowerCase() === product.unit
      );

      this.setState({
        productDetail: product,
        productDialog: true,
        addDialog: false,
        confirmDialog: false,
        idstock: null,
        selectedCategory: this.category[index],
        selectedUnit: this.unit[unitIndex],
      });

      this.setState({
        productDetail: product,
        productDialog: true,
        addDialog: false,
        confirmDialog: false,
        idstock: null,
        selectedCategory: this.category[index],
        selectedUnit: this.unit[unitIndex],
      });
    } catch (error) {
      console.log(error);
    }
  };

  restockProduct = async (product) => {
    try {
      let index = this.category.findIndex(
        (item) => item.name.toLocaleLowerCase() === product.category
      );
      let unitIndex = this.unit.findIndex(
        (item) => item.name.toLocaleLowerCase() === product.unit
      );

      this.setState({
        productDetail: product,
        productRestockDialog: true,
        addDialog: false,
        confirmDialog: false,
        idstock: null,
        selectedCategory: this.category[index],
        selectedUnit: this.unit[unitIndex],
      });

      this.setState({
        productDetail: product,
        productRestockDialog: true,
        addDialog: false,
        confirmDialog: false,
        idstock: null,
        selectedCategory: this.category[index],
        selectedUnit: this.unit[unitIndex],
      });
    } catch (error) {
      console.log(error);
    }
  };

  actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => this.editProduct(rowData)}
        />
        <Button
          icon="pi pi-undo"
          className="p-button-rounded p-button-primary ml-1"
          onClick={() => this.restockProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning ml-1"
          onClick={() =>
            this.setState({ confirmDialog: true, idstock: rowData.stock[0].id })
          }
        />
        <ConfirmDialog
          visible={this.state.confirmDialog}
          onHide={() => this.setState({ confirmDialog: false })}
          message="Are you sure you want to proceed?"
          header="Confirmation"
          icon="pi pi-exclamation-triangle"
          accept={() => this.confirmDeleteProduct(rowData.stock[0].id)}
          reject={() =>
            this.toast.show({
              severity: "info",
              summary: "Rejected",
              detail: "Cancel delete product",
              life: 3000,
            })
          }
        />
      </React.Fragment>
    );
  };

  //TOOL BAR
  leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <h4>Custom Product Management</h4>
      </React.Fragment>
    );
  };

  rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mx-3"
          onClick={() => this.setState({ addDialog: true })}
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-danger"
        />
      </React.Fragment>
    );
  };

  inputChange = (e, property) => {
    if (property === "category") {
      this.setState({ selectedCategory: e.value });
    } else if (property === "unit") {
      this.setState({ selectedUnit: e.value });
    } else {
      let val = e.target.value;
      let productDetail = { ...this.state.productDetail };
      productDetail[`${property}`] = val;
      this.setState({ productDetail });
    }
  };

  stockChange = (e, property) => {
    const val = e.target.value;
    let productDetail = { ...this.state.productDetail };
    productDetail.stock[0][`${property}`] = val;
    console.log(productDetail.stock);
    this.setState({ productDetail });
  };

  confirmDeleteProduct = async (idstock) => {
    try {
      let deleteProduct = await HTTP.delete(`/product/${idstock}`);
      console.log(deleteProduct.data);
      this.toast.show({
        severity: "success",
        summary: "Success",
        detail: "Delete product success",
        life: 3000,
      });
      this.props.getProductAction(2);
    } catch (error) {
      console.log("error delete produk", error);
    }
  };
  render() {
    let {
      productDetail,
      productDialog,
      productRestockDialog,
      addDialog,
      selectedCategory,
      selectedUnit,
    } = this.state;
    let headerGroup = (
      <ColumnGroup>
        <Row>
          <Column
            header="Product"
            rowSpan={2}
            style={{ textAlign: "center" }}
          />
          <Column header="Brand" rowSpan={2} style={{ textAlign: "center" }} />
          <Column header="Stock" colSpan={3} style={{ textAlign: "center" }} />
          <Column header="Price" rowSpan={2} style={{ textAlign: "center" }} />
          <Column header="Image" rowSpan={2} style={{ textAlign: "center" }} />
          <Column
            header="Category"
            rowSpan={2}
            style={{ textAlign: "center" }}
          />
          <Column
            header="Description"
            rowSpan={2}
            style={{ textAlign: "center" }}
          />
          {/* <Column
            header="Side Effect"
            rowSpan={2}
            style={{ textAlign: "center" }}
          />
          <Column header="Usage" rowSpan={2} style={{ textAlign: "center" }} />
          <Column header="Dosage" rowSpan={2} style={{ textAlign: "center" }} />
          <Column
            header="Indication"
            rowSpan={2}
            style={{ textAlign: "center" }}
          /> */}
          <Column header="Action" rowSpan={2} style={{ textAlign: "center" }} />
        </Row>
        <Row>
          <Column header="Netto" style={{ textAlign: "center" }} />
          <Column header="Qty" style={{ textAlign: "center" }} />
          <Column header="Type" style={{ textAlign: "center" }} />
        </Row>
      </ColumnGroup>
    );

    return (
      <div class="main-content">
        <main>
          {/* TOAST NOTIFICATION */}
          <Toast ref={(el) => (this.toast = el)} />
          <Toolbar
            className="p-mb-4 mb-3"
            left={this.leftToolbarTemplate}
            right={this.rightToolbarTemplate}
          ></Toolbar>
          <div className="datatable-style">
            <div className="card">
              <DataTable
                value={this.props.dataProduk}
                headerColumnGroup={headerGroup}
                paginator
                rows={3}
                className="p-datatable-sm"
                showGridlines
                scrollable
                style={{ width: "auto" }}
                className="datatable-style"
              >
                <Column
                  field="product_name"
                  headerStyle={{ width: "200px" }}
                ></Column>
                <Column field="brand" headerStyle={{ width: "120px" }}></Column>
                <Column
                  body={this.bodyNetto}
                  headerStyle={{ width: "100px" }}
                ></Column>
                <Column
                  body={this.bodyQty}
                  headerStyle={{ width: "100px" }}
                ></Column>
                <Column
                  body={this.bodyType}
                  headerStyle={{ width: "100px" }}
                ></Column>
                <Column
                  body={this.bodyPrice}
                  headerStyle={{ width: "110px" }}
                ></Column>
                <Column
                  body={this.bodyImage}
                  headerStyle={{ width: "150px" }}
                ></Column>
                <Column
                  body={this.bodyCategory}
                  headerStyle={{ width: "150px" }}
                ></Column>
                <Column
                  body={this.bodyDescription}
                  headerStyle={{ width: "500px" }}
                ></Column>
                <Column
                  body={this.bodyEffect}
                  headerStyle={{ width: "300px" }}
                ></Column>
                <Column
                  body={this.bodyUsage}
                  headerStyle={{ width: "150px" }}
                ></Column>
                <Column
                  body={this.bodyDosage}
                  headerStyle={{ width: "250px" }}
                ></Column>
                <Column
                  body={this.actionBodyTemplate}
                  headerStyle={{ width: "150px" }}
                ></Column>
              </DataTable>
            </div>
          </div>

          {/* DIALOG */}
          <DialogProductCustom
            category={selectedCategory}
            selectedUnit={selectedUnit}
            productDetail={productDetail}
            productDialog={productDialog}
            hide={() => this.setState({ productDialog: false })}
            inputChange={(e, property) => {
              this.inputChange(e, property);
            }}
            stockChange={(e, property) => this.stockChange(e, property)}
            toast={(a) =>
              this.toast.show({
                severity: "success",
                summary: "Success!",
                detail: a,
                life: 3000,
              })
            }
          />
          <DialogRestockCustom
            category={selectedCategory}
            unit={selectedUnit}
            productDetail={productDetail}
            productRestockDialog={productRestockDialog}
            hide={() => this.setState({ productRestockDialog: false })}
            inputChange={(e, property) => {
              this.inputChange(e, property);
            }}
            stockChange={(e, property) => this.stockChange(e, property)}
            toast={(a) =>
              this.toast.show({
                severity: "success",
                summary: "Success!",
                detail: a,
                life: 3000,
              })
            }
          />
          <DialogAddCustom
            productDetail={productDetail}
            addDialog={addDialog}
            hide={() => this.setState({ addDialog: false })}
            inputChange={(e, property) => {
              this.inputChange(e, property);
            }}
            stockChange={(e, property) => this.stockChange(e, property)}
            toast={() =>
              this.toast.show({
                severity: "success",
                summary: "Success!",
                detail: "Add Product success!",
                life: 3000,
              })
            }
          />
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ productReducer }) => {
  return {
    dataProduk: productReducer.product_list,
  };
};

export default connect(mapStateToProps, { getProductAction })(
  CustomProductManagementPage
);
