import React from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../../assets/css/SidebarComp.css'
import { Calendar } from 'primereact/calendar';
import HTTP from '../../service/HTTP';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';

const bodyStyle = {
    textAlign: 'center'
}
let filter = { selectedTime: 'Yearly', selectedDetailTime: '2021', year: '2021' }
const data = { // ganti jd deafault
    datasets: [
        {
            label: '',
            data: [],
            fill: true,
            borderColor: '#4bc0c0'
        }
    ]
};

class RevenuePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: '', // start date pada selection date
            endDate: '', // end that pada selection date
            dataRevenues: [], // data dari backend
            date: '', // date pada input form
            revenuesReport: { ...data }, // data untuk chart (default)
            filter: { ...filter } // variabel untuk filter data
        }

        this.options = {
            // scales: {
            //     y: {
            //         max: 1000000,
            //     }
            // }
        }

        this.time = [
            { name: 'Yearly', code: 'Yearly' }, { name: 'Monthly', code: 'Monthly' }];

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
    }

    componentDidMount() {
        this.getRevenue()

    }
    getRevenue = async () => {
        try {
            let revenue = await HTTP.get('/transaction/revenue')
            let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            let { transactions } = revenue.data[0]
            // let transactionDone = transactions.filter(item => item.status === "done" || item.status === "custom")
            console.log(revenue.data[0])
            transactions.forEach((item, index) => data[item.month - 1] += item.total_price)
            let datasets = [
                {
                    label: "Total Revenue",
                    data: data,
                    fill: true,
                    borderColor: '#4bc0c0'
                }
            ]
            let labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            this.setState({ dataRevenues: revenue.data[0], revenuesReport: { ...this.state.revenuesReport, labels, datasets } })
        } catch (error) {
            console.log("Error get revenue")
        }
    }

    getDate = (value) => {
        let startDate = value[0]
        let endDate = value[1] ? value[1] : new Date()
        console.log(startDate.toLocaleDateString().split('T')[0], endDate.toLocaleDateString().split('T')[0])
        // filter revenue
        this.filterRevenue(startDate.toLocaleDateString('sv').split('T')[0].replace(/[//]/g, "-"),
            endDate.toLocaleDateString('sv').split('T')[0].replace(/[//]/g, "-"))
        this.setState({ date: value })
    }

    filterRevenue = async (start, end) => {
        try {
            let filter = await HTTP.get(`/transaction/revenue?start=${start}&end=${end}`)
            this.setState({ dataRevenues: filter.data[0] })
        } catch (error) {
            console.log("error filter revenue", error)
        }
    }

    reset = () => {
        this.getRevenue()
        this.setState({ date: '' })
    }

    onTimeChange = async (key, value) => {
        console.log(key, value)
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
            let url = `/transaction/revenue`
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
            console.log("url: ", url)
            let res = await HTTP.get(url)

            console.log("filter data", res.data[0])
            console.log("data", data)
            let { transactions } = res.data[0]
            if (selectedTime.name === "Yearly") transactions.forEach((item, index) => data[item.month - 1] += item.total_price)
            if (selectedTime.name === "Monthly") transactions.forEach((item, index) => data[item.week - 1] += item.total_price)
            console.log("data", data)
            let datasets = [
                {
                    label: 'Total Revenue',
                    data: data,
                    fill: true,
                    borderColor: '#4bc0c0'
                }
            ]

            this.setState({
                revenuesReport: { ...this.state.revenuesReport, labels, datasets },
                dataRevenues: res.data[0]
            })
        } catch (error) {

        }
    }
    render() {
        let { dataRevenues, date, revenuesReport, filter } = this.state

        return (
            <div className="main-content">
                <main>
                    {/* Revenue Chart */}
                    {/* <h3 className="my-3">Revenue Overview</h3> */}
                    <div className="my-2 mb-5 d-flex">
                        <div style={{ width: '60%' }}>
                            <Card title="Revenue Overview" subTitle="Revenue vs time" >
                                <Chart type="line" data={revenuesReport} options={this.options} />
                            </Card>
                        </div>
                        <div style={{ width: '40%', margin: 'auto', }} className="mx-3 p-auto">
                            <div className="d-flex justify-content-between">
                                <Dropdown optionLabel="name" value={filter.selectedTime} options={this.time} onChange={(e) => this.onTimeChange("selectedTime", e.value)}
                                    placeholder="Select Time" style={{ width: '100%' }} />
                                <Dropdown optionLabel="name" value={filter.selectedDetailTime}
                                    className="mx-1"
                                    options={filter.selectedTime.name === 'Yearly' ? this.year : this.month}
                                    onChange={(e) => this.onTimeChange("selectedDetailTime", e.value)} placeholder="Select Detail" />
                                {
                                    filter.selectedTime.name === "Monthly"
                                    &&
                                    <Dropdown optionLabel="name" value={filter.year} options={this.year} onChange={(e) => this.onTimeChange("year", e.value)} placeholder="Select Time" className="mr-3" />
                                }
                                <Button label="Filter" className="p-button-raised" onClick={this.onBtnFilter} />
                            </div>
                            <div className="d-flex h-100 my-3">
                                <Card className="d-flex justify-content-center" style={{ textAlign: 'center', height: '20vh', width: '50%' }}>
                                    <p style={{ fontSize: '14px' }}>Total Confirmed Revenue :</p>
                                    <h4 style={{ color: 'blueviolet' }}>IDR. {dataRevenues.total_revenue ? dataRevenues.total_revenue.toLocaleString() : 0} </h4>
                                    {/* <h6>IDR</h6> */}
                                </Card>
                                <Card className="d-flex justify-content-center ml-2" style={{ textAlign: 'center', height: '20vh', width: '50%' }}>
                                    <span style={{ fontSize: '14px' }}>Total Confirmed Transaction :</span>
                                    <h4 style={{ color: 'blueviolet' }}>{dataRevenues.total_transactions} </h4>
                                    <h6>Transactions</h6>
                                </Card>
                            </div>
                            <div className="d-flex h-100">
                                <Card className="my-3 d-flex justify-content-center align-items-center" style={{ textAlign: 'center', height: '20vh', width: '50%' }}>
                                    <p>Unconfirmed Revenue:</p>
                                    <h4 style={{ color: 'blueviolet' }}>IDR. {dataRevenues.total_revenue ? dataRevenues.total_unconfirmed_revenue.toLocaleString() : 0} </h4>
                                </Card>
                                <Card className="my-3 d-flex justify-content-center ml-2" style={{ textAlign: 'center', height: '20vh', width: '50%' }}>
                                    <span>Total Unconfirmed Transaction:</span>
                                    <h5 style={{ color: 'blueviolet' }}>{dataRevenues.total_unconfirmed_trans} </h5>
                                    <h6>Transactions</h6>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {/* REVENUE TABLE */}
                    <h3>Revenue Per Transaction</h3>
                    <div className="d-flex justify-content-between w-100">
                        <div className="w-70">
                            <Card>
                                <DataTable value={dataRevenues.transactions} paginator rows={7} selectionMode="single">
                                    <Column field="invoice" header="Invoice" style={bodyStyle} />
                                    <Column field="recipient" header="Recipient" style={bodyStyle} />
                                    <Column field="created_at" header="Date" style={bodyStyle} />
                                    <Column field="total_price" header="Revenue (IDR)" style={{ textAlign: 'center', width: '10em' }} />
                                    {/* <Column field="invoice" header="Invoice" />  */}
                                </DataTable>
                            </Card>
                        </div>
                        <div className="px-3 w-30">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6>Date : </h6>
                                <Calendar id="range" value={this.state.date} onChange={(e) => this.setState({ date: e.value })} selectionMode="range" readOnlyInput dateFormat="yy/mm/dd"
                                    className="mb-1 mx-2" disabled />
                                <Button label="Reset" onClick={this.reset} />
                            </div>
                            <Calendar value={date} dateFormat="yy/mm/dd" onChange={(e) => this.getDate(e.value)} inline selectionMode="range" readOnlyInput
                            />
                        </div>
                    </div>


                </main>
            </div>
        );
    }
}

export default RevenuePage;