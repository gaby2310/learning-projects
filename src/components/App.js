import React from 'react';
import SearchBar from './SearchBar';
import youtube, { baseParams } from '../apis/youtube';
import VideoList from './VideoList';
import VideoDetail from './VideoDetail';



export default class App extends React.Component {
    state = {videos: [], selecteVideo: null };

    componentDidMount() {
        this.onTermSubmit('Parazitii')
    };

    onTermSubmit = async term => {
        const response = await youtube.get('/search' , {
            params: {
                ...baseParams,
                q: term
            }
        });

        this.setState({
            videos: response.data.items,
            selecteVideo: response.data.items[0]
        });
    };

    onVideoSelect = (video) => {
        this.setState({selecteVideo: video})
    }

    render() {
        return (
            <div className="ui container">
                <SearchBar onFormSubmit={this.onTermSubmit} /> 
                <div className="ui grid">
                    <div className="ui row">
                        <div className= "eleven wide column">
                            <VideoDetail video={this.state.selecteVideo} />
                        </div>
                        <div className="five wide column">
                            <VideoList onVideoSelect={this.onVideoSelect} videos={this.state.videos} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};


