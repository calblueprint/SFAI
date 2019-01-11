import PropTypes from "prop-types";
import React from "react";
import Button from "../helpers/Button"

/**
* @prop buyer: buyer associated with profile
*/
class BuyerProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buyer: [],
      canEditProfile: false,
      componentDidMount: false
    }
  }

  componentDidMount = () => {
    const { user, userType, buyer } = this.props;
    const buyer_id = this.props.buyer.id;
    const buyer_route = APIRoutes.buyers.show(buyer_id);
    Promise.all([
      Requester.get(buyer_route)
    ]).then(response => {
      const [buyer_response] = response;
      this.setState({
        buyer: buyer_response,
        canEditProfile: userType === "buyer" && user && user.id === buyer.id,
        componentDidMount: true
      });
    });
  }

  render() {

    const { componentDidMount, activeFilter, buyer, canEditProfile } = this.state;
    const { name, email, phone_number } = buyer;

    if (!componentDidMount) {
      return (
        <div>
          <p>Loading</p>
        </div>
      );
    }

    return (
      <div className="center mw8">
        <div className="buyer-profile-header">
          <h1>{name}</h1>
          {
            this.state.canEditProfile &&
            <Button
              onClick={()=>{window.location = `/buyers/${this.props.buyer.id}/update`}}
              type="button-primary"
              color="indigo"
              className="w4"
            >
              Edit Profile
            </Button>
          }
        </div>
        <div className="bg-white w-100 buyer-contents-container pa3">
          <div className="h4 w4 br-100 bg-gray ma4">
            <img className="br-100 avatar-img" src={buyer.avatar.url} />
          </div>
          <div>
            <div className="buyer-contents">
              <div>
                <h5>Name</h5>
                <h5>Email</h5>
                <h5>Phone Number</h5>
              </div>
              <div className="ml4">
                <h5>{name}</h5>
                <h5>{email}</h5>
                <h5>{phone_number}</h5>
              </div>
            </div>
          </div>
        </div>
        </div>
    );
  }
}
export default BuyerProfile;