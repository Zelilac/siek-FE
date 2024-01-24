import React from 'react';
import HTTP from '../../service/HTTP';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

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


let filter = { selectedTime: 'Yearly', selectedDetailTime: '2024', year: '2024' }
class DashboardPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalRevenue: 0,
            totalUserTrans: 0,
            usersList: [],
            registeredUser: 0,
            salesReport: { ...data },
            totalProductSold: 0,
            totalQtySold: 0,
            dateRange: null,
            filter: { ...filter },
            productSales: [],
            expandedRows: null,
            totalUnconfirmed: 0
        }

        this.time = [
            { name: 'Yearly', code: 'Yearly' }, { name: 'Monthly', code: 'Monthly' }];

        this.year = [
            { name: '2024', code: '2024' },
            { name: '2025', code: '2025' },
            { name: '2026', code: '2026' },
            { name: '2027', code: '2028' }
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
    }

    async componentDidMount() {
        await this.getRevenue()
        await this.getUser()
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

    getRevenue = async () => {
        try {
            let res = await HTTP.get('/transaction/revenue')
            this.setState({ totalRevenue: res.data[0].total_revenue, totalUserTrans: res.data[0].total_user })
        } catch (error) {
            console.log("error get revenue", error)
        }
    }

    getUser = async () => {
        try {
            let user = await HTTP.get('/user/get')
            let registeredUser = user.data.length
            this.setState({ usersList: user.data, registeredUser })
        } catch (error) {
            console.log("getuser", error)
        }
    }

    dateFormat = (value) => {
        return value.toLocaleDateString()
    }

    printCreatedDate = (rowData) => {
        return <span>{new Date(rowData.created_at).toLocaleDateString('id')}</span>
    }

    printLastUpdate = (rowData) => {
        return <span>{new Date(rowData.updated_at).toLocaleDateString('id')}</span>
    }
    render() {
        let { totalRevenue, totalUserTrans, usersList, registeredUser } = this.state
        let { salesReport, totalQtySold, totalProductSold, filter, totalUnconfirmed } = this.state
        return (
            <div class="main-content">
                <main>
                    <div className="my-3">
                        <h2 class="dash-title">SMK Pasti Bisa Dashboard</h2>
                        <span>Hello! You logged in as admin</span>
                    </div>
                    <div class="dash-cards">
                        <div class="card-single">
                            <div class="card-body">
                                <span class="ti-briefcase"></span>
                                <div>
                                    <h5>Total Transaction</h5>
                                    <h4>IDR. {totalRevenue.toLocaleString()}</h4>
                                </div>
                            </div>
                            <div class="card-footer">
                                <a href="">View all</a>
                            </div>
                        </div>

                        <div class="card-single">
                            <div class="card-body">
                                <span class="ti-reload"></span>
                                <div>
                                    <h5>Total Registered User</h5>
                                    <h4>{registeredUser}</h4>
                                </div>
                            </div>
                            <div class="card-footer">
                                <a href="">View all</a>
                            </div>
                        </div>

                        <div class="card-single">
                            <div class="card-body">
                                <span class="ti-check-box"></span>
                                <div>
                                    <h5>Total User did Transactions</h5>
                                    <h4>{totalUserTrans}</h4>
                                </div>
                            </div>
                            <div class="card-footer">
                                <a href="">View all</a>
                            </div>
                        </div>
                    </div>
                    
                    {/* SALES REPORT */}
                    <div>
                        <div className="d-flex justify-content-between my-5">
                            <h2>Sales Chart</h2>
                            <div>
                                <Dropdown optionLabel="name" value={filter.selectedTime} options={this.time} onChange={(e) => this.onTimeChange("selectedTime", e.value)} placeholder="Select Time" />
                                <Dropdown optionLabel="name" value={filter.selectedDetailTime}
                                    options={filter.selectedTime.name === 'Yearly' ? this.year : this.month}
                                    onChange={(e) => this.onTimeChange("selectedDetailTime", e.value)} placeholder="Select Detail" className="mx-3" />
                                {
                                    filter.selectedTime.name === "Monthly"
                                    &&
                                    <Dropdown optionLabel="name" value={filter.year} options={this.year} onChange={(e) => this.onTimeChange("year", e.value)} placeholder="Select Time" className="mr-3" />
                                }
                                <Button label="Filter" className="p-button-raised h-100" onClick={this.onBtnFilter} />
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            
                            {/* Chart */}
                            <div style={{ width: '100%', marginRight: '10px' }}>
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
                </main>
            </div>
        );
    }
}

export default DashboardPage;