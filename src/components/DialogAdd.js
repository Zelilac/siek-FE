import React from 'react';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import { getProductAction } from '../action'
import { connect } from 'react-redux';
import HTTP from '../service/HTTP';
class DialogAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileUpload: '',
            productName: '',
            brand: '',
            stock: [],
            price: 0,
            description: '',
            usage: '',
            dosage: '',
            netto: 1,
            qty: 1,
            indication: '',
            effect: '',
            error: false,
            idcategory: '',
            unit: '',
            selectedCategory: '',
            selectedUnit: ''

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

    onBtnAdd = async () => {
        try {
            let { productName, brand, description, usage, dosage, effect, price, qty, netto, indication, stock, selectedCategory, selectedUnit, fileUpload } = this.state
            let a = [productName, brand, description, usage, dosage, effect, indication, price, qty, netto, selectedUnit, selectedCategory, fileUpload].indexOf("")
            let b = [price, qty, netto].indexOf(0)
            if (a >= 0 || b >= 0) {
                this.setState({ error: true })
                setTimeout(() => {
                    this.setState({ error: false })
                }, 3000);
                return null
            }
            // fungsi add
            let formData = new FormData()
            let total_netto = qty * netto
            stock = [{ idtype: 1, qty, total_netto, idstatus: 1 }]
            // this.setState({ stock })

            let data = { product_name: productName, brand, idcategory: selectedCategory.id, description, effect, usage, dosage, indication, netto, pack_price: price, unit: selectedUnit.name, stock }
            formData.append('data', JSON.stringify(data))
            formData.append('products', fileUpload)

            // let res = await axios.post(URL_API + '/product',  formData )
            let res = await HTTP.post('/product', formData)
            console.log(res.data)
            this.setState({ selectedCategory: '', selectedUnit: '', fileUpload: '', stock })
            this.props.hide()
            this.props.toast()
            this.props.getProductAction(1)
        } catch (error) {
            console.log("ERROR ADD DATA", error)
        }
    }

    onBtnClose = () => {
        this.setState({ selectedCategory: '', selectedUnit: '' })
        this.props.hide()
    }
    render() {
        let { addDialog, hide } = this.props
        let { productName, brand, price, description, usage, dosage, indication, effect, netto, qty, error, fileUpload, selectedCategory, selectedUnit } = this.state

        const productDialogFooter = (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-danger p-button-text" onClick={this.onBtnClose} />
                <Button label="Add" icon="pi pi-check" className="p-button-success p-button-text" onClick={this.onBtnAdd} />
            </React.Fragment>
        );

        return (
            <Dialog visible={addDialog} style={{ width: '450px' }} header="Add New Product" modal className="p-fluid " onHide={hide} footer={productDialogFooter}>

                <div className="d-flex flex-column justify-content-center align-items-center">
                    <div>
                        <div style={{ width: '250px', height: '150px', border: this.state.fileUpload ? '1px solid white' : '1px solid grey' }} className="d-flex align-items-center justify-content-center">
                            <img src={this.state.fileUpload ? URL.createObjectURL(this.state.fileUpload) : 'https://image.flaticon.com/icons/png/512/1837/1837526.png'}
                                style={{ height: this.state.fileUpload ? '110%' : '30px' }} alt='dialog'/>
                        </div>
                        {!fileUpload && <small className="p-error" style={{ fontSize: '10px' }}>Required.</small>}
                    </div>
                    <FileUpload auto mode="basic" name="products" accept="image/*" maxFileSize={1000000} className="mb-3" onUpload={(e) => this.uploadImage(e)}
                        onSelect={(e) => this.setState({ fileUpload: e.files[0] })} />

                    <div className="w-100">
                        <label style={{ fontWeight: 'bold' }}>Product Name</label>
                        <InputText onChange={(e) => this.setState({ productName: e.target.value })} />
                        {!productName && <small className="p-error">Required.</small>}

                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }} >Brand</label>
                        <InputText onChange={(e) => this.setState({ brand: e.target.value })} />
                        {!brand && <small className="p-error">Required.</small>}

                    </div>
                    <div>
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Stok</label>
                        <div className="d-flex" >
                            <span style={{ width: '25%' }}>
                                <label >Netto</label>
                                <InputNumber inputId="minmax-buttons" mode="decimal" showButtons min={1} max={100} onValueChange={(e) => this.setState({ netto: e.target.value })} value={this.state.netto} />
                                {!netto && <small className="p-error">Required.</small>}
                            </span>
                            <span className="mx-3" style={{ width: '40%' }}>
                                <label >Unit</label>
                                <Dropdown value={this.state.selectedUnit} options={this.unit} onChange={(e) => this.setState({ selectedUnit: e.value })} optionLabel="name" placeholder="Select a Unit" />
                                {!selectedUnit && <small className="p-error">Required.</small>}
                            </span>
                            <span style={{ width: '25%' }}>
                                <label >Qty</label>
                                <InputNumber inputId="minmax-buttons" mode="decimal" showButtons min={1} max={100} onValueChange={(e) => this.setState({ qty: e.target.value })} value={this.state.qty} />
                                {!qty && <small className="p-error">Required.</small>}
                            </span>
                        </div>
                        <div className="d-flex my-3" style={{ fontSize: '15px' }}>
                            <span style={{ width: '50%' }}>
                                <label style={{ fontWeight: 'bold' }} >Category</label>
                                <Dropdown value={this.state.selectedCategory} options={this.category} onChange={(e) => this.setState({ selectedCategory: e.value })} optionLabel="name" placeholder="Select Category" />
                                {!selectedCategory && <small className="p-error">Required.</small>}
                            </span>
                            <span className="ml-2" style={{ width: '50%' }}>
                                <label style={{ fontWeight: 'bold' }}>Type</label>
                                <InputText disabled value="pack" />
                            </span>

                        </div>
                    </div>
                    <div className="w-100 my-2">
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Price</label>
                        <InputNumber inputId="minmax-buttons" showButtons min={0} mode="currency" currency="IDR" onValueChange={(e) => this.setState({ price: e.target.value })} />
                        {!price && <small className="p-error">Required.</small>}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }} >Description</label>
                        <InputTextarea autoResize onChange={(e) => this.setState({ description: e.target.value })} />
                        {!description && <small className="p-error">Required.</small>}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }}>Usage</label>
                        <InputTextarea onChange={(e) => this.setState({ usage: e.target.value })} />
                        {!usage && <small className="p-error">Required.</small>}
                    </div>
                    <div className="w-100 my-2">
                        <label style={{ fontWeight: 'bold' }}>Side Effect</label>
                        <InputTextarea onChange={(e) => this.setState({ effect: e.target.value })} />
                        {!effect && <small className="p-error">Required.</small>}
                    </div>
                    <div className="w-100 my-2">
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Dosage</label>
                        <InputTextarea autoResize onChange={(e) => this.setState({ dosage: e.target.value })} />
                        {!dosage && <small className="p-error">Required.</small>}
                    </div>
                    <div className="w-100 my-2">
                        <label htmlFor="minmax-buttons" style={{ fontWeight: 'bold' }}>Indication</label>
                        <InputTextarea autoResize onChange={(e) => this.setState({ indication: e.target.value })} />
                        {!indication && <small className="p-error">Required.</small>}
                    </div>
                    {error && <Message severity="error" text="Fill all the form!" />}
                </div>
            </Dialog>
        );
    }
}

export default connect(null, { getProductAction })(DialogAdd);