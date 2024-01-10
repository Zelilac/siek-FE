import React from 'react';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
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
class DialogProduct extends React.Component {
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
            { name: 'Covid', id: 1 },
            { name: 'Mata', id: 2 },
            { name: 'Flu dan Batuk', id: 3 },
            { name: 'Vitamin dan Suplemen', id: 4 },
            { name: 'Demam', id: 5 },
            { name: 'Pencernaan', id: 6 },
            { name: 'Hipertensi', id: 7 },
            { name: 'Otot, tulang dan sendi', id: 8 },
            { name: 'Kulit', id: 9 },
            { name: 'P3K', id: 10 }
        ];

        this.unit = [
            { name: 'ml' },
            { name: 'L' },
            { name: 'mg' },
            { name: 'g' },
            { name: 'lembar' },
            { name: 'tablet' },
            { name: 'kapsul' },
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
            let { idproduct, product_name, brand, stock, price, description, usage, dosage, indication, effect, pack_price, netto } = this.props.productDetail
            let { category, selectedUnit } = this.props
            // console.log('selected unit', selectedUnit.name)
            let checkField = [product_name, brand, stock, price, description, usage, dosage, indication, effect]
            if (checkField.indexOf("") > -1) {
                this.setState({ error: true })
                setTimeout(() => {
                    this.setState({ error: false })
                }, 3000)
            } else {
                // fumgsi edit ke API
                let formData = new FormData()
                // let index = this.category.findIndex(item => item.name.toLowerCase() === category)
                // let idcategory = this.category[index].id
                let unit = selectedUnit.name
                let idcategory = category.id
                let data = { idproduct, product_name, brand, idcategory, stock, description, usage, dosage, indication, effect, netto, pack_price, unit }
                formData.append('data', JSON.stringify(data))
                formData.append('products', this.state.fileUpload)

                this.setState({loading: true})
                let edit = await HTTP.patch('/product/custom', formData)
                console.log(edit.data)
                this.setState({fileUpload: '', loading: false})
                this.props.getProductAction(2)
                this.props.toast(edit.data.messages)
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
        let { productDialog, productDetail, hide, stockChange, inputChange, category, selectedUnit } = this.props
        
        const productDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-danger p-button-text" onClick={this.onBtnCancel} />
                <Button label="Save" icon="pi pi-check" className="p-button-success p-button-text" onClick={this.saveChanges} loading={this.state.loading} />
            </React.Fragment>
        );
        return (
            <Dialog visible={productDialog} style={{ width: '450px' }} header="Product Details" modal className="p-fluid " onHide={hide} footer={productDialogFooter}>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    {
                        productDetail.images &&
                        <img src={productDetail.images[0].includes('http') ? productDetail.images: (this.state.fileUpload ? URL.createObjectURL(this.state.fileUpload) : `${URL_API}/${productDetail.images[0]}`)} alt={productDetail.images[0]} style={{ width: '200px' }} />
                    }
                    <FileUpload auto mode="basic" name="products" accept="image/*" maxFileSize={1000000} className="mb-3"
                        onSelect={(e) => this.setState({ fileUpload: e.files[0] })} />
                    <div className="w-100">
                        <label style={{ fontWeight: 'bold' }}>Product Name</label>
                        <InputText value={productDetail.product_name} onChange={(e) => inputChange(e, 'product_name')} style={{ border: productDetail.product_name === "" ? '1px solid red' : null }} />
                        {productDetail.product_name === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }} >Brand</label>
                        <InputText value={productDetail.brand} onChange={(e) => inputChange(e, 'brand')} style={{ border: productDetail.brand === "" ? '1px solid red' : null }} />
                        {productDetail.brand === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div>
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Stok</label>
                        <div className="d-flex" style={{ fontSize: '15px', width: '100%' }}>
                            <span style={{ width: '25%' }}>
                                <label style={{ width: '25%' }}>Netto</label>
                                <InputNumber inputId="minmax-buttons" value={productDetail.netto} onValueChange={(e) => inputChange(e, 'netto')} mode="decimal" showButtons min={0} max={100} />
                            </span>
                            <span className="mx-3" style={{ width: '40%' }}>
                                <label >Unit</label>
                                <Dropdown value={selectedUnit} options={this.unit} onChange={(e) => inputChange(e, 'unit')} optionLabel="name" placeholder="Select a Unit" />
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
                            <Dropdown value={category} options={this.category} onChange={(e) => inputChange(e, 'category')} optionLabel="name" placeholder="Select Category" />
                        </span>
                        <span className="ml-2" style={{ width: '50%' }}>
                            <label style={{ fontWeight: 'bold' }}>Type</label>
                            <InputText disabled value="pack" />
                        </span>

                    </div>
                    <div className="w-100 my-2">
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Price</label>
                        <InputNumber inputId="minmax-buttons" value={productDetail.stock && productDetail.pack_price} mode="decimal" showButtons min={0} max={100} mode="currency" currency="IDR" />
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }} >Description</label>
                        <InputTextarea value={productDetail.description} onChange={(e) => inputChange(e, 'description')} autoResize style={{ border: productDetail.description === "" ? '1px solid red' : null }} />
                        {productDetail.description === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }}>Usage</label>
                        <InputTextarea value={productDetail.usage} onChange={(e) => inputChange(e, 'usage')} style={{ border: productDetail.usage === "" ? '1px solid red' : null }} />
                        {productDetail.usage === "" ? <small className="p-error">Required.</small> : null}
                    </div>

                    <div className="w-100 my-2">
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Dosage</label>
                        <InputTextarea value={productDetail.dosage} autoResize onChange={(e) => inputChange(e, 'dosage')} style={{ border: productDetail.dosage === "" ? '1px solid red' : null }} />
                        {productDetail.dosage === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    <div className="w-100 my-2">
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Indication</label>
                        <InputTextarea value={productDetail.indication} onChange={(e) => inputChange(e, 'indication')} autoResize style={{ border: productDetail.indication === "" ? '1px solid red' : null }} />
                        {productDetail.indication === "" ? <small className="p-error">Required.</small> : null}
                    </div>
                    {this.state.error && <Message severity="error" text="Fill all the form!" />}
                </div>
            </Dialog>
        );
    }
}
export default connect(null, { getProductAction })(DialogProduct);