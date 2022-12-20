import styles from '../styles/Home.module.css';

import { Component } from "react"

function ParamSelect({label, name, options, onChange}) {
  return (
    <div className={styles.searchFormRow}>
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} className={styles.searchFormSelect} onChange={onChange}>
        <option value="all">All</option>
        {options.map((opt) => {
          return <option value={opt} key={opt}>{opt}</option>
        })}
      </select>
    </div>
  )
}

function ExoplanetResult({planet}) {
  return (
    <li className={styles.exoplanetResult}>
      <span>{planet.pl_name}</span>
      <span>{planet.pl_masse}</span>
      <span>{planet.disc_year}</span>
      <span>{planet.discoverymethod}</span>
      <span>{planet.disc_facility}</span>
      <span>{planet.hostname}</span>
    </li>
  )
}

export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      discoveryYearOptions: [],
      discoveryMethodOptions: [],
      discoveryFacilityOptions: [],
      hostNameOptions: [],
      allData: [],
      filteredResults: [],
      discoveryYearFilter: "all",
      discoveryMethodFilter: "all",
      discoveryFacilityFilter: "all",
      hostNameFilter: "all"
    }
  }

  async updateFromApi() {
    try {
      const res = await fetch("/api/exoplanets");
      const raw = await res.json();
      const data = JSON.parse(raw);

      let discoveryYearOptionsSet = new Set;
      let discoveryMethodOptionsSet = new Set;
      let discoveryFacilityOptionsSet = new Set;
      let hostNameOptionsSet = new Set;

      for (let item of data) {
        discoveryYearOptionsSet.add(item.disc_year);
        discoveryMethodOptionsSet.add(item.discoverymethod);
        discoveryFacilityOptionsSet.add(item.disc_facility);
        hostNameOptionsSet.add(item.hostname);
      }

      this.setState({
        discoveryYearOptions: Array.from(discoveryYearOptionsSet).sort((a, b) => a < b),
        discoveryMethodOptions: Array.from(discoveryMethodOptionsSet).sort((a, b) => a < b),
        discoveryFacilityOptions: Array.from(discoveryFacilityOptionsSet).sort((a, b) => a < b),
        hostNameOptions: Array.from(hostNameOptionsSet).sort((a, b) => a < b),
        allData: data,
        filteredResults: data
      })
    
    } catch (err) {
      console.log(err);
    }
  }

  clearSearchForm = () => {
    this.setState({
      discoveryYearFilter: "all",
      discoveryMethodFilter: "all",
      discoveryFacilityFilter: "all",
      hostNameFilter: "all",
      filteredResults: [...this.state.allData]
    });
  }

  filterBySearchForm = () => {
    console.log("Filtering Results...");

    let filteredResults = [...this.state.allData];
    if (this.state.discoveryYearFilter !== "all") {
      filteredResults = filteredResults.filter((p) => (parseInt(p.disc_year) == parseInt(this.state.discoveryYearFilter)))
    }
    if (this.state.discoveryMethodFilter !== "all") {
      filteredResults = filteredResults.filter((p) => (p.discoverymethod == this.state.discoveryMethodFilter))
    }
    if (this.state.discoveryFacilityFilter !== "all") {
      filteredResults = filteredResults.filter((p) => (p.disc_facility == this.state.discoveryFacilityFilter))
    }
    if (this.state.hostNameFilter !== "all") {
      filteredResults = filteredResults.filter((p) => (p.hostname == this.state.hostNameFilter))
    }
    this.setState({ filteredResults });
  }

  handleYearChange = (e) => {
    this.setState({
      discoveryYearFilter: e.target.value
    })
  }

  handleMethodChange = (e) => {
    this.setState({
      discoveryMethodFilter: e.target.value
    })
  }

  handleFacilityChange = (e) => {
    this.setState({
      discoveryFacilityFilter: e.target.value
    })
  }

  handleHostNameChange = (e) => {
    this.setState({
      hostNameFilter: e.target.value
    })
  }

  async componentDidMount() {
    await this.updateFromApi();
  }

  render() {
    return (
      <div className={styles.app}>
        <div className={styles.searchForm}>
          <div className={styles.searchFormFields}>
            <ParamSelect label="Discovery Year" name="discoveryYear" onChange={this.handleYearChange} options={this.state.discoveryYearOptions} />
            <ParamSelect label="Discovery Method" name="discoveryMethod" onChange={this.handleMethodChange} options={this.state.discoveryMethodOptions} />
            <ParamSelect label="Discovery Facility" name="discoveryFacility" onChange={this.handleFacilityChange} options={this.state.discoveryFacilityOptions} />
            <ParamSelect label="Host Name" name="hostName" onChange={this.handleHostNameChange} options={this.state.hostNameOptions} />
          </div>
          <div className={styles.searchFormButtons}>
            <button className={styles.btn} onClick={this.clearSearchForm}>Clear</button>
            <button className={styles.btn} onClick={this.filterBySearchForm}>Search</button>
          </div>
          <h3 className={styles.header}>Earth-like Exoplanets</h3>
        </div>
        <ul className={styles.resultsList}>
          <li className={`${styles.resultHeader} ${styles.exoplanetResult}`}>
            <span>Planet Name</span>
            <span>Mass (Earths)</span>
            <span>Discovery Year</span>
            <span>Discovery Method</span>
            <span>Discovery Facility</span>
            <span>Host Name</span>
          </li>
          {this.state.filteredResults.map((planet, i) => {
            return (
              <ExoplanetResult key={i} planet={planet} />
            )
          })}
        </ul>
      </div>
    )
  }
}