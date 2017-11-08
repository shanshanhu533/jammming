import React from 'react';

import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import TrackList from '../TrackList/TrackList';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends React.Component {
  constructor(props){
   super(props);
   this.state={searchResults:[],
    playlistName:'New Playlist',
    playlistTracks:[]
  };

    this.search=this.search.bind(this);
    this.addTrack=this.addTrack.bind(this);
    this.removeTrack=this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
  }

  search(term){
    Spotify.search(term).then(searchResults=>{
      this.setState({searchResults:searchResults});
   });
   console.log(term);
  }


  addTrack(track){
     let tracks = this.state.playlistTracks;
    if (!tracks.includes(track)){
     tracks.push(track);
      this.setState({playlistTracks:tracks});
    }
  }

   
  removeTrack(track) {
   let tracks = this.state.playlistTracks;
   tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
   this.setState({playlistTracks: tracks});

 }

  /*updatePlaylistName(name){
    let newPlaylistName = this.state.playlistName;
      if (newPlaylistName !== name){
      this.setState({playlistName:newPlaylistName});
      console.log(newPlaylistName);
    }
  }*/

  updatePlaylistName(name) {
   this.setState({playlistName: name});

  }

  savePlaylist() {
   const trackUris = this.state.playlistTracks && this.state.playlistTracks.map(track => track.uri);
   Spotify.savePlaylist(this.state.playlistName, trackUris).then(()=>{
    this.setState({
    playlistName: 'New Playlist',
    searchResults: []
    });

  });
  }

  render() {
    return (
      <div>
       <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
          {<SearchBar onSearch={this.search}/>}
         <div className="App-playlist">
          <SearchResults onAdd={this.addTrack}  searchResults={this.state.searchResults} />
           <Playlist playlistTracks={this.state.playlistTracks}
           playlistName={this.state.playlistName}
           onRemove={this.removeTrack}
           onNameChange={this.updatePlaylistName}
           onSave={this.savePlaylist}/>
      </div>
       </div>
      </div>
    );
  }
}

export default App;
