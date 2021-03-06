import PropTypes from "prop-types";
import React from "react";
import ArtistColumnPanel from "./ArtistColumnPanel";
import LoadingOverlay from "../helpers/LoadingOverlay";
import Filters from "../works/Filters";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Button from "../helpers/Button";
import IconButton from "../helpers/IconButton";

/**
 * @prop userType: { "artist", "buyer", "admin" }
 */

class AllArtists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: null,
      filters: [],
      componentDidMount: false,
      isLoading: true,
      pageCount: 0,
      currentPage: 0,
      filtering: false,
    };
  }

  componentDidMount() {
    const artist_route = APIRoutes.artists.index(1);
    const categories_route = APIRoutes.artists.categories;
    Promise.all([
      Requester.get(artist_route),
      Requester.get(categories_route),
    ]).then(
      response => {
        const [artists_response, filters_response] = response;
        let artists_response_filtered = artists_response.artists;
        this.setState({
          artists: artists_response_filtered,
          filters: filters_response,
          componentDidMount: true,
          isLoading: false,
          pageCount: Math.ceil(
            artists_response.artist_count / artists_response.per_page
          ),
        });
      },
      error => {
        console.error(error);
      }
    );
  }

  getFilteredArtists = page => {
    // NOTE: Can't pass empty searchParams string to filtered_artists
    // Possible fix by editing routes.fb, but not sure how -B.Y.
    const searchParams = this.filters.getQuery();
    this.setState({ isLoading: true });
    const artists_route = searchParams.length
      ? APIRoutes.artists.filtered_artists(searchParams, page)
      : APIRoutes.artists.index(1);
    Requester.get(artists_route).then(
      response => {
        const artists = response.artists;
        this.setState({
          artists: artists,
          isLoading: false,
          pageCount: Math.ceil(response.artist_count / response.per_page),
          currentPage: page - 1,
          filtering: searchParams.length ? true : false,
        });
      },
      response => {
        console.error(response);
      }
    );
  };

  hideArtist = artist_id => {
    let formData = new FormData();
    formData.append(`artist[hidden]`, true);
    fetch(APIRoutes.artists.update(artist_id), {
      method: "PUT",
      body: formData,
      credentials: "same-origin",
      headers: {
        "X_CSRF-Token": document.getElementsByName("csrf-token")[0].content,
      },
    })
      .then(data => {
        window.location = `/artists`;
      })
      .catch(data => {
        console.error(data);
      });
  };

  unHideArtist = artist_id => {
    let formData = new FormData();
    formData.append(`artist[hidden]`, false);
    fetch(APIRoutes.artists.update(artist_id), {
      method: "PUT",
      body: formData,
      credentials: "same-origin",
      headers: {
        "X_CSRF-Token": document.getElementsByName("csrf-token")[0].content,
      },
    })
      .then(data => {
        window.location = `/artists`;
      })
      .catch(data => {
        console.error(data);
      });
  };

  toggleHideArtist = artist => {
    if (artist.hidden) {
      this.unHideArtist(artist.id);
    } else {
      this.hideArtist(artist.id);
    }
  };

  handlePageClick = data => {
    let selected = data.selected + 1;
    if (this.state.filtering) {
      this.getFilteredArtists(selected);
    } else {
      const artists_route = APIRoutes.artists.index(selected);
      Requester.get(artists_route).then(
        response => {
          this.setState({
            artists: response.artists,
            currentPage: selected - 1,
          });
        },
        response => {
          console.error(response);
        }
      );
    }
  };

  render() {
    if (!this.state.componentDidMount) {
      return (
        <div>
          <LoadingOverlay itemType="artists" fullPage={true} />
        </div>
      );
    }

    const { isLoading, filters, artists, pageCount } = this.state;
    const { userType } = this.props;

    return (
      <div className="pt4">
        {isLoading ? (
          <LoadingOverlay itemType="artists" fullPage={true} />
        ) : null}
        <div className="fl w-20 pa3 mt5" role="search">
          <Filters
            ref={node => {
              this.filters = node;
            }}
            filters={filters}
            color="denim"
          />
          <button
            onClick={() => this.getFilteredArtists(1)}
            className="button-primary bg-denim w-100"
          >
            Apply
          </button>
        </div>
        <div className="fl w-80 pb5">
          <div className="flex justify-between items-baseline">
            <h1>Artists</h1>
            <nav
              className="li-denim pagination"
              role="navigation"
              aria-label="Pagination Navigation"
            >
              <ReactPaginate
                previousLabel={"\u00ab"}
                nextLabel={"\u00bb"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                activeClassName={"active"}
                disabledClassName={"hidden"}
                forcePage={this.state.currentPage}
              />
            </nav>
          </div>
          <div className="col-list-3">
            {artists.map((artist, i) => {
              return (
                <ArtistColumnPanel key={i} artist={artist} userType={userType}>
                  {userType == "admin" && (
                    <IconButton
                      onClick={() => this.toggleHideArtist(artist)}
                      isActiveIcon={artist.hidden}
                      activeIcon={faEye}
                      inactiveIcon={faEyeSlash}
                      text={artist.hidden ? "Unhide" : "Hide"}
                    />
                  )}
                </ArtistColumnPanel>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default AllArtists;
