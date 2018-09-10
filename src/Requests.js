import React, { Component } from "react";
import { getRequests } from "./Api";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";

class Requests extends Component {
  state = {
    requestStatus: "All",
    dropDown: null,
  };
  // store input change
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  // store input change and apply status filter
  handleStatusChange = event => {
    const { name, value } = event.target;
    this.filterStatus(value);
    this.setState({
      [name]: value,
    });
  };
  // deletes table row
  handleRowDel = item => {
    let index = item.target.id;
    this.state.data.splice(index, 1);
    this.setState(this.state.data);
  };

  // get new date
  getNewDate = () => {
    let dt = new Date();
    let month = dt.getMonth() + 1;
    let day = dt.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    let newDate =
      dt.getFullYear() +
      "-" +
      month +
      "-" +
      day +
      " " +
      dt.toLocaleTimeString();
    return newDate;
  };

  // update status and update time
  changeStatus = event => {
    let index = event.target.id;
    let newStatus = event.target.name;
    this.state.data[index].status = newStatus;
    let newDate = this.getNewDate();
    this.state.data[index].updated_at = newDate;
    this.dateSort(this.state.data);
    this.setState(this.state.data);
  };

  // sort date by newest first
  dateSort = data => {
    data.sort(function(a, b) {
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
  };

  // get mock data and sort it 
  getData = () => {
    getRequests()
      .then(data => {
        this.dateSort(data);
        this.setState({ data });
      })
      .catch(err => console.log(err));
  };

  // only display date
  displayDate = date => {
    let splitDate = date.split(" ");
    let newDate = splitDate[0];
    return newDate;
  };

  // change background color based on status
  getBackground = status => {
    if (status === "Denied") {
      return { backgroundColor: "#ffcccc" };
    } else if (status === "Approved") {
      return { backgroundColor: "#e6ffe6" };
    } else {
      return;
    }
  };

  // popOver content from react-bootstrap 
  popOver = numb => (
    <Popover id="popover-positioned-right">
      <button
        id={numb}
        name="Approved"
        onClick={this.changeStatus}
        className="btn-block bg-transparent border-0"
      >
        Approved
      </button>
      <button
        id={numb}
        name="Denied"
        onClick={this.changeStatus}
        className="btn-block bg-transparent border-0"
      >
        Denied
      </button>
    </Popover>
  );

  // update data based on status change
  getfilterData = status => {
    getRequests().then(data => {
      this.dateSort(data);
      let newData = data.filter(function(val) {
        return val.status === status;
      });
      this.setState({ data: newData });
    });
  };

  // check how status changed
  filterStatus = status => {
    if (status === "Pending") {
      this.getfilterData(status);
    } else if (status === "Approved") {
      this.getfilterData(status);
    } else if (status === "Denied") {
      this.getfilterData(status);
    } else {
      this.getData();
    }
  };

  // initial data 
  componentWillMount() {
    this.getData();
  }

  render() {
    if (this.state.data) {
      return (
        <div className="container col-md-8 ml-4">
          <div className="row">
            <h3>Requests</h3>
          </div>
          <div className="row jumbotron jumbotron-fluid">
            <div className="container">
              <p className="lead">
                Filter by Status:
                <select
                  className="ml-3 w-25"
                  name="requestStatus"
                  onChange={this.handleStatusChange}
                  required
                >
                  <option value="All">All Requests</option>
                  <option value="Approved">Approved Requests</option>
                  <option value="Pending">Pending Requests</option>
                  <option value="Denied">Denied Requests</option>
                </select>
              </p>
            </div>
          </div>
          <div className="row">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Status</th>
                  <th scope="col">Created</th>
                  <th scope="col">Updated</th>
                  <th scope="col">Deleted</th>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((person, numb) => (
                  <tr style={this.getBackground(person.status)} key={person.id}>
                    <td>{person.title}</td>
                    <td>
                      <OverlayTrigger
                        trigger="click"
                        placement="right"
                        rootClose={true}
                        overlay={this.popOver(numb)}
                      >
                        <Button
                          style={{ textDecoration: "underline" }}
                          type="button"
                          className="bg-transparent border-0"
                          name="dropDown"
                          value={person.id}
                          onClick={this.handleInputChange}
                        >
                          {person.status}
                        </Button>
                      </OverlayTrigger>
                    </td>

                    <td>{this.displayDate(person.created_at)}</td>
                    <td>{this.displayDate(person.updated_at)}</td>
                    <td>
                      <button
                        className="bg-transparent border-0"
                        onClick={this.handleRowDel}
                      >
                        <u id={numb}>Delete</u>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return (
      <div className="container col-md-8 ml-4">
        <div className="row">
          <h3>Requests</h3>
        </div>
        <div className="row jumbotron jumbotron-fluid">
          <div className="container">
            <p className="lead">
              Filter by Status:
              <select
                className="ml-3 w-25"
                name="requestStatus"
                onChange={this.handleInputChange}
                required
              >
                <option value="All">All Requests</option>
                <option value="Approved">Approved Requests</option>
                <option value="Pending">Pending Requests</option>
                <option value="Denied">Denied Requests</option>
              </select>
            </p>
          </div>
        </div>
        <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Created</th>
                <th scope="col">Updated</th>
                <th scope="col">Deleted</th>
              </tr>
            </thead>
            <tbody />
          </table>
        </div>
      </div>
    );
  }
}
export default Requests;
