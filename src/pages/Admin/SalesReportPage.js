import React from 'react'
import HTTP from '../../service/HTTP';
import "primeflex/primeflex.css";
import '../../assets/css/SidebarComp.css'
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { URL_API } from '../../Helper';
import 'primereact/resources/themes/md-light-deeppurple/theme.css'

const data = {
    datasets: [
        {
            label: '',
            data: [],
            fill: true,
            borderColor: '#4bc0c0'
        }
    ]
};

let filter = { selectedTime: '', selectedDetailTime: '', year: '', schoolName: "" }
let schoolFilter = {name: 'SMK 1 Pancasila'}
class SalesReportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            salesReport: { ...data },
            totalProductSold: null,
            totalQtySold: null,
            dateRange: null,
            filter: { ...filter },
            productSales: [],
            expandedRows: null,
            totalUnconfirmed: null
        }

        this.school = [
            {name: "SMK 1 Pancasila", code:1},
            {name: "SMK 2 Pancasila", code:2},
            {name: "SMK 2 Pancasila", code:3}
        ]

        this.time = [
            { name: 'Yearly', code: 'Yearly' }, 
            { name: 'Monthly', code: 'Monthly' }];

        this.year = [
            { name: '2020', code: '2020' },
            { name: '2021', code: '2021' }
        ];

        this.month = [
            { name: 'January', code: 0 },
            { name: 'February', code: 1 },
            { name: 'March', code: 2 },
            { name: 'April', code: 3 },
            { name: 'May', code: 4 },
            { name: 'June', code: 5 },
            { name: 'July', code: 6 },
            { name: 'August', code: 7 },
            { name: 'September', code: 8 },
            { name: 'October', code: 9 },
            { name: 'November', code: 10 },
            { name: 'December', code: 11 }
        ]
        this.options = {
            // scales: {
            //     y: {
            //         max: 40,
            //     }
            // }
        }
    }

    async componentDidMount() {
        await this.getSalesReport()
        await this.getProductSales()

    }
    getSalesReport = async () => {
        try {
            let res = await HTTP.get('/transaction/sales-report')
            // console.log(res.data[0])
            let { detail } = res.data[0]
            let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            detail.forEach((item, index) => data[item.month - 1] += item.qty_buy)
            let datasets = [
                {
                    label: 'Total Pieces of Product Sold Per-Month',
                    data: data,
                    fill: true,
                    borderColor: '#4bc0c0'
                }
            ]

            let labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            // console.log(this.state.salesReport)
            this.setState({
                salesReport: { ...this.state.salesReport, labels, datasets },
                totalProductSold: res.data[0].total_product,
                totalQtySold: res.data[0].total_qty,
                totalUnconfirmed: res.data[0].total_unconfirmed
            })
        } catch (error) {
            console.log("error get sales report", error)
        }
    }

    onTimeChange = async (key, value) => {
        this.setState({
            filter: {
                ...this.state.filter,
                [key]: value
            }
        })
    }

    onBtnFilter = async () => {
        try {
            let { selectedTime, selectedDetailTime, year } = this.state.filter
            let url = `/transaction/sales-report`
            let labels = []
            let data = []
            if (selectedTime.name === "Yearly") {
                if (selectedDetailTime.name === "2021") url += `?start=2021-01-01&end=2021-12-31`
                if (selectedDetailTime.name === "2020") url += `?start=2020-01-01&end=2020-12-31`
                labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }

            if (selectedTime.name === "Monthly") {
                url += `?start=${year.code}-${selectedDetailTime.code + 1}-01&end=${year.code}-${selectedDetailTime.code + 1}-31`
                labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
                data = [0, 0, 0, 0]
            }
            // console.log("url: ", url)
            let res = await HTTP.get(url)

            // console.log("filter data", res.data[0])
            let { detail } = res.data[0]
            // let a = detail.filter(item => item.sttu)
            if (selectedTime.name === "Yearly") detail.forEach((item, index) => data[item.month - 1] += item.qty_buy)
            if (selectedTime.name === "Monthly") detail.forEach((item, index) => data[item.week - 1] += item.qty_buy)
            let datasets = [
                {
                    label: 'Total Pieces of Product Sold Per-Month',
                    data: data,
                    fill: true,
                    borderColor: '#4bc0c0'
                }
            ]
            // console.log(data)

            // console.log(this.state.salesReport)
            this.setState({
                salesReport: { ...this.state.salesReport, labels, datasets },
                totalProductSold: res.data[0].total_product,
                totalQtySold: res.data[0].total_qty,
                totalUnconfirmed: res.data[0].total_unconfirmed
            })
        } catch (error) {
            console.log("error filter", error)
        }
    }

    getProductSales = async () => {
        try {
            let res = await HTTP.get('/transaction/product-sales')
            this.setState({ productSales: res.data })
            // console.log(res.data)
        } catch (error) {
            console.log("error get product sales", error)
        }
    }

    imageBodyTemplate = (rowData) => {
        return <img src={rowData.image_url.includes('http') ? rowData.image_url : `${URL_API}/${rowData.image_url}`}
            style={{ width: '100px', boxShadow: 'box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);' }} />
    }

    rowExpansion = (data) => {
        // console.log(data)
        return (
            <div>
                <h5>Orders for {data.product_name}</h5>
                <DataTable value={data.orders}>
                    <Column field="invoice" header="Invoice" sortable></Column>
                    <Column field="fullname" header="Customer" sortable></Column>
                    <Column field="created_at" header="Date" sortable></Column>
                    <Column field="qty" header={`Amount ${data.type === 'pack' ? '(pack)' : '(bottle)'}`} sortable></Column>
                    <Column field="total_netto" header={`Amount by Unit (${data.unit})`} sortable></Column> 
                    <Column field="transaction_status" header="Transaction Status" sortable></Column> 
                    {/* <Column headerStyle={{ width: '4rem' }} body={this.searchBodyTemplate}></Column> */}
                </DataTable>
            </div>
        );
    }
    render() {
        let { salesReport, totalQtySold, totalProductSold, filter, productSales, expandedRows, totalUnconfirmed } = this.state
        return (
            <div className="main-content">
                <main>
                    {/* <hr /> */}
                    <div>
                        <div className="d-flex justify-content-between my-2">
                            <h2>Sales Chart</h2>
                        </div>
                        <div className="d-flex align-items-center">
                            
                            {/* Chart */}
                            <div style={{ width: '65%' }}>
                                <Card>
                                    <Chart type="line" data={salesReport} options={this.options} />
                                </Card>
                            </div>
                            <div style={{ width: '30%', margin: 'auto' }}>
                                
                                <Card className="my-3 d-flex justify-content-center" style={{ textAlign: 'center', height: '50%' }}>
                                    <div className="d-flex">
                                        <i className="pi pi-check mx-1"></i>
                                        <h6>Total Product Sold:</h6>
                                    </div>
                                    <h2 style={{ color: 'blueviolet' }}>{totalProductSold} </h2>
                                    <h6>Product</h6>
                                </Card>
                                <Card className="my-3 d-flex justify-content-center" style={{ textAlign: 'center', height: '50%' }}>
                                    <div className="d-flex">
                                        <i className="pi pi-check mx-1"></i>
                                        <h6>Total Pieces Sold:</h6>
                                    </div>
                                    <h2 style={{ color: 'blueviolet' }}>{totalQtySold} </h2>
                                    <h6>Product</h6>
                                </Card>
                                <Card className="my-3 d-flex justify-content-center" style={{ textAlign: 'center', height: '50%' }}>
                                    <div className="d-flex">
                                        <i className="pi pi-check mx-1"></i>
                                        <h6>Total Unpaid Product:</h6>
                                    </div>
                                    <h2 style={{ color: 'blueviolet' }}>{totalUnconfirmed} </h2>
                                    <h6>Product</h6>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <hr />

                    {/* Product Sales */}
                    {/* Filter */}
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <Dropdown optionLabel="name" value={filter.selectedTime} options={this.time} onChange={(e) => this.onTimeChange("selectedTime", e.value)} placeholder="Select Time" />
                        <Dropdown optionLabel="name" value={filter.selectedDetailTime}
                            options={filter.selectedTime.name === 'Yearly' ? this.year : this.month}
                            onChange={(e) => this.onTimeChange("selectedDetailTime", e.value)} placeholder="Select Detail" className="mx-3" />
                            {
                                filter.selectedTime.name === "Monthly"
                                &&
                                <Dropdown optionLabel="name" value={filter.year} options={this.year} onChange={(e) => this.onTimeChange("year", e.value)} placeholder="Select Time" className="mr-3" />
                            }
                        <Dropdown optionLabel="name" value={filter.schoolName} options={this.school} onChange={(e) => this.onTimeChange("schoolName", e.value)} placeholder="Select School Name" />
                        <Button label="Filter" className="p-button-raised ml-2" onClick={this.onBtnFilter} style={{width:"8vw"}}/>
                        <Button label="Reset" className="p-button-danger ml-2" onClick={""} style={{width:"5vw"}}/>
                    </div>
                    {/* List Of Products */}
                    <div className='mt-4'>
                        <Card title="Product Sales Recap" subTitle="Recap of all product sales">
                            <DataTable value={productSales} paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                rowExpansionTemplate={this.rowExpansion}
                                expandedRows={expandedRows}
                                onRowToggle={(e) => this.setState({ expandedRows: e.data })}>
                                <Column expander />
                                <Column header="Image" body={this.imageBodyTemplate} />
                                <Column field="school_name" header="School Name" sortable />
                                <Column field="product_name" header="Name" sortable />
                                <Column field="pack_price" header="Price" sortable />
                                <Column field="type" header="Type" sortable />
                                {/* <Column field="unit_price" header="Unit Price" sortable /> */}
                                <Column field="unit" header="Unit" sortable />
                                <Column field="status" header="Status" sortable />
                            </DataTable>
                        </Card>
                    </div>
                </main>
            </div >
        );
    }
}

export default SalesReportPage;

