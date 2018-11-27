import PropTypes from "prop-types"
import React from 'react';
import { Button, Dialog, Intent } from "@blueprintjs/core";



class UpdateArtist extends React.Component {
  constructor(props) {
    super(props);
    const { name, genres, program, description, avatar, id, featured_work_id } = this.props.artist;
    this.state = {
      artist: {
        name,
        genres,
        program,
        description,
        avatar,
        featured_work_id,
        artist_id: id
      },
      works: [],
      componentDidMount: false,
    }
  }

  componentDidMount = () => {
    const works_route = APIRoutes.artists.works(this.props.artist.id);
    Requester.get(works_route)
      .then(response => {
        this.setState({
          works: response,
          componentDidMount: true
        });
      });
  }

  handleChange = (event) => {
    const artist = this.state.artist;
    artist[event.target.name] = event.target.value;
    this.setState({ artist: artist });
  }

  setFile = (e) => {
    const files = e.target.files;
    if (!files || !files[0]) {
      return;
    }

    this.setState({ avatar: files[0] });
  }

  handleSubmit = (event) => {

    event.preventDefault();
    //
    let formData = new FormData();
    formData.append('artist[name]', this.state.artist.name);
    formData.append('artist[program]', this.state.artist.program);
    formData.append('artist[genres]', this.state.artist.genres);
    formData.append('artist[description]', this.state.artist.description);
    formData.append('artist[featured_work_id]', this.state.artist.featured_work_id);

    let { avatar } = this.state;
    if (avatar) {
      formData.append(
        'artist[avatar]',
        avatar,
        avatar.name
      );
    }

    fetch(APIRoutes.artists.update(this.state.artist.artist_id), {
      method: 'PUT',
      body: formData,
      credentials: 'same-origin',
      headers: {
        "X_CSRF-Token": document.getElementsByName("csrf-token")[0].content
      }
    }).then((data) => {
      window.location = `/artists/` + this.state.artist.artist_id;
    }).catch((data) => {
      console.error(data);
    });
  }

  render() {
    return (
      <div>
        <h1>UPDATE ARTIST</h1>
        <form action={APIRoutes.artists.update(this.state.artist.artist_id)} method="PUT" onSubmit={this.handleSubmit}>
          <h5>Name</h5>
          <input
            value={this.state.artist.name}
            onChange={this.handleChange}
            name="name"
            type="text"
            className="textinput"
            required
          />
          <h5>Program</h5>
          <input
            value={this.state.artist.program}
            onChange={this.handleChange}
            name="program"
            type="text"
            className="textinput"
            required
          />
          <h5>Genres</h5>
          <input
            value={this.state.artist.genres}
            onChange={this.handleChange}
            name="genres"
            type="text"
            className="textinput"
            required
          />
          <h5>Description</h5>
          <input
            value={this.state.artist.description}
            onChange={this.handleChange}
            name="description"
            type="text"
            className="textinput"
            required
          />

          <h5>Featured Work</h5>
          <select
            onChange={this.handleChange}
            value={this.state.artist.featured_work_id}
            name="featured_work_id"
            className="input-dropdown">
            {
              this.state.works.map(work => {
                return <option key={work.id} value={work.id}>{work.title}</option>
              })
            }
          </select>

          <h5>Profile Photo</h5>
          <input name="avatar" id="avatar" type="file" onChange={this.setFile} />

          <div className="submit-container mt3 mb3">
            <Button
              intent={Intent.PRIMARY}
              onClick={() => { window.location = `/artists/${this.state.artist.artist_id}` }}
              text="Cancel"
              className="button-secondary b--magenta w4"
            />
            <Button
              intent={Intent.SECONDARY}
              type="submit"
              text="Save"
              className="button-primary bg-magenta w4 ml3"
            />
          </div>
        </form>
      </div>
    )
  }
}

export default UpdateArtist;
