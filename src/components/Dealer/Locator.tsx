// @ts-nocheck
import React from 'react';
import Header from './components/Header/Header';
import DealerList from './components/Locator/DealerList';
import DealerMap from './components/Locator/DealerMap';
import Search from './components/Search/Search';
import './assets/styles.scss';
// import dealers from './dealer.json'; //enable this line to use mock data

interface LocatorProps {
  storeHash: any;
  showLocator: any;
  handleCancel: any;
  selectDealer: any;
  googleMapsApiKey: any;
}

interface LocatorState {
  dealers: any;
  location: any;
  radius: any;
  miles: any;
  announcement: any;
}

export default class Locator extends React.PureComponent<LocatorProps, LocatorState> {

  constructor(props: any) {
    super(props);

    this.state = {
      dealers: [],
      // dealers: dealers.dealers, //enable this line to use mock data
      searched: false,
      loading: false,
      location: "",
      currentLocation: "",
      radius: 5,
      miles: [5, 10, 30, 75],
      announcement: "",
      activeDealer: null,
      showMap: false,
      dealersHeight: 0,
    };

    this.dealersRef = React.createRef();

    this.handleSearch = this.handleSearch.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeRadius = this.onChangeRadius.bind(this);
    this.onHandleKeypress = this.onHandleKeypress.bind(this);
    this.handleActiveDealer = this.handleActiveDealer.bind(this);
  }

  handleSearch(): void {
    const { location, radius } = this.state;

    if (location && radius) {
      this.setState({
        loading: true,
        currentLocation: location,
        activeDealer: null,
        dealers: []
      });
      fetch(`${process.env.REACT_APP_HOST}/store-front/api/${this.props.storeHash}/dealers?location=${location}&radius=${radius}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
        }
      })
      .then(res => res.json())
      .then(data => {
        this.setState({
          dealers: data.dealers
        });
      })
      .finally(() => this.setState({searched: true, loading: false}))
      .catch(console.log);
    }
  }

  handleActiveDealer(dealer): void {
    this.setState({ activeDealer: dealer, showMap: true });
  }

  onChangeLocation(event: any): void {
    this.setState({ location: event.target.value });
  }

  onChangeRadius(event: any): void {
    this.setState({radius: event.target.value});
  }

  onHandleKeypress(event: any): void {
    if (event.charCode === 13) {
      this.handleSearch();
    }
  }

  componentDidMount() {
    this.handleSearch();
    fetch(`${process.env.REACT_APP_HOST}/store-front/api/stores/${this.props.storeHash}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
      if (data.announcement) {
        this.setState({ announcement: data.announcement }, () => {
          this.updateDealersHeight();
        });
      }
    })
    .catch(console.log);
    this.updateDealersHeight();
    window.addEventListener("resize", this.updateDealersHeight.bind(this));
  }

  updateDealersHeight() {
    if (this.dealersRef?.current) {
      this.setState({ dealersHeight: this.dealersRef.current.clientHeight });
    }
  }

  render() {
    const { handleCancel, selectDealer } = this.props;
    return (
      <div className="flex flex-col h-screen">
        {this.state.announcement && (
          <div className="bg-secondary text-white text-center text-sm font-semibold py-2.5 px-4">
            {this.state.announcement}
          </div>
        )}
        <div className={`flex flex-1 bg-custom-gray relative overflow-hidden ${this.props.showLocator?'show-locator':''}`}>
          <div className="w-full lg:w-1/3 flex flex-col">
            <div>
              <Header handleCancel={ handleCancel } />
              <Search location={this.state.location} miles={this.state.miles} onChangeLocation={this.onChangeLocation} onHandleKeypress={this.onHandleKeypress} onChangeRadius={this.onChangeRadius} handleSearch={this.handleSearch}/>
            </div>
            <DealerList
              dealersRef={this.dealersRef}
              dealers={this.state.dealers}
              loading={this.state.loading}
              searched={this.state.searched}
              currentLocation={this.state.currentLocation}
              activeDealer={this.state.activeDealer}
              handleActiveDealer={this.handleActiveDealer}
              selectDealer={selectDealer}
            />
          </div>
          <DealerMap
            googleMapsApiKey={this.props.googleMapsApiKey}
            dealers={this.state.dealers}
            selectDealer={selectDealer}
            activeDealer={this.state.activeDealer}
            handleActiveDealer={this.handleActiveDealer}
            showMap={this.state.showMap}
            setShowMap={(show) => this.setState({ showMap: show })}
            dealersHeight={this.state.dealersHeight}
            loading={this.state.loading} />
        </div>
      </div>
    );
  }
}
