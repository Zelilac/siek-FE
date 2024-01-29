import React from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message'
import { URL_API } from '../Helper';
import { Dropdown } from 'primereact/dropdown';
import { connect } from 'react-redux';
import { getProductAction } from '../action'
import HTTP from '../service/HTTP';
class DialogRestockCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nameEdit: '',
            stockEdit: '',
            error: false,
            selectedCategory: '',
            selectedUnit: '',
            fileUpload: '',
            loading: false
        }

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


    printWarning = (trigger) => {
        if (trigger) {
            return <small className="p-error">Required.</small>
        } else {
            return null
        }
    }
    saveChanges = async () => {
        try {
            let { idproduct, product_name, brand, stock, price, description, unit, pack_price, category, netto } = this.props.productDetail
            let checkField = [product_name, brand, stock, price, description]
            if (checkField.indexOf("") > -1) {
                this.setState({ error: true })
                setTimeout(() => {
                    this.setState({ error: false })
                }, 3000)
            } else {
                // fumgsi edit ke API
                let formData = new FormData()
                let index = this.category.findIndex(item => item.name.toLowerCase() === category)
                let idcategory = this.category[index].id

                let data = { idproduct, product_name, brand, idcategory, stock, description, netto, pack_price, unit }
                formData.append('data', JSON.stringify(data))
                formData.append('products', this.state.fileUpload)

                this.setState({loading: true})
                let edit = await HTTP.patch('/product/custom', formData)
                console.log(edit.data)
                this.setState({fileUpload: '', loading: false})
                this.props.getProductAction(2)
                this.props.toast("Success Restock Product")
                this.props.hide()
            }

        } catch (error) {
            console.log("error edit", error)
        }
    }

    onBtnCancel = () =>{
        this.setState({fileUpload: ''})
        this.props.hide()
    }

    render() {
        let { productRestockDialog, productDetail, hide, stockChange, inputChange, category, unit } = this.props
        
        const productRestockDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-danger p-button-text" onClick={this.onBtnCancel} />
                <Button label="Save" icon="pi pi-check" className="p-button-success p-button-text" onClick={this.saveChanges} loading={this.state.loading} />
            </React.Fragment>
        );
        return (
            <Dialog visible={productRestockDialog} style={{ width: '450px' }} header="Restock Product" modal className="p-fluid " onHide={hide} footer={productRestockDialogFooter}>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    {
                        productDetail.images &&
                        <img src={productDetail.images[0].includes('http') ? productDetail.images: (this.state.fileUpload ? URL.createObjectURL(this.state.fileUpload) : `${URL_API}/${productDetail.images[0]}`)} alt={productDetail.images[0]} style={{ width: '200px' }} />
                    }
                    {/* <FileUpload auto mode="basic" name="products" accept="image/*" maxFileSize={1000000} className="mb-3"
                        onSelect={(e) => this.setState({ fileUpload: e.files[0] })} /> */}
                    <div className="w-100">
                        <label style={{ fontWeight: 'bold' }}>Product Name</label>
                        <InputText disabled value={productDetail.product_name} onChange={(e) => inputChange(e, 'product_name')} style={{ border: productDetail.product_name === "" ? '1px solid red' : null }} />
                        {productDetail.product_name === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }} >Brand</label>
                        <InputText disabled value={productDetail.brand} onChange={(e) => inputChange(e, 'brand')} style={{ border: productDetail.brand === "" ? '1px solid red' : null }} disabled/>
                        {productDetail.brand === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div>
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Stok</label>
                        <div className="d-flex" style={{ fontSize: '15px', width: '100%' }}>
                            <span style={{ width: '25%' }}>
                                <label style={{ width: '25%' }}>Netto</label>
                                <InputNumber disabled inputId="minmax-buttons" value={productDetail.netto} onValueChange={(e) => inputChange(e, 'netto')} mode="decimal" showButtons min={0} max={100} />
                            </span>
                            <span className="mx-3" style={{ width: '40%' }}>
                                <label >Unit</label>
                                <Dropdown disabled value={unit} options={this.unit} onChange={(e) => inputChange(e, 'unit')} optionLabel="name" placeholder="Select a Unit" />
                            </span>
                            <span style={{ width: '25%' }}>
                                <label >Qty</label>
                                <InputNumber inputId="minmax-buttons" value={productDetail.stock && productDetail.stock[0].qty} onValueChange={(e) => stockChange(e, 'qty')} mode="decimal" showButtons min={0} max={100} />
                            </span>
                        </div>
                    </div>
                    <div className="d-flex my-3" style={{ fontSize: '15px', width: '100%' }}>
                        <span style={{ width: '50%' }}>
                            <label style={{ fontWeight: 'bold' }} >Category</label>
                            <Dropdown disabled value={category} options={this.category} onChange={(e) => inputChange(e, 'category')} optionLabel="name" placeholder="Select Category" />
                        </span>
                        <span className="ml-2" style={{ width: '50%' }}>
                            <label style={{ fontWeight: 'bold' }}>Type</label>
                            <InputText disabled value="custom" />
                        </span>

                    </div>
                    <div className="w-100 my-2">
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Price</label>
                        <InputNumber disabled inputId="minmax-buttons" value={productDetail.stock && productDetail.pack_price} mode="decimal" showButtons min={0} max={100} mode="currency" currency="IDR" />
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }} >Description</label>
                        <InputTextarea disabled value={productDetail.description} onChange={(e) => inputChange(e, 'description')} autoResize style={{ border: productDetail.description === "" ? '1px solid red' : null }} />
                        {productDetail.description === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    {/* <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }}>Usage</label>
                        <InputTextarea disabled value={productDetail.usage} onChange={(e) => inputChange(e, 'usage')} style={{ border: productDetail.usage === "" ? '1px solid red' : null }} />
                        {productDetail.usage === "" ? <small className="p-error">Required.</small> : null}
                    </div>

                    <div className="w-100 my-2">
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Dosage</label>
                        <InputTextarea disabled value={productDetail.dosage} autoResize onChange={(e) => inputChange(e, 'dosage')} style={{ border: productDetail.dosage === "" ? '1px solid red' : null }} />
                        {productDetail.dosage === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div className="w-100 my-2">
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Indication</label>
                        <InputTextarea disabled value={productDetail.indication} onChange={(e) => inputChange(e, 'indication')} autoResize style={{ border: productDetail.indication === "" ? '1px solid red' : null }} />
                        {productDetail.indication === "" ? <small className="p-error">Required.</small> : null}
                    </div> */}
                    {this.state.error && <Message severity="error" text="Fill all the form!" />}
                </div>
            </Dialog>
        );
    }
}
export default connect(null, { getProductAction })(DialogRestockCustom);