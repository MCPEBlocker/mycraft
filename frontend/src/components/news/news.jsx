import React, { Component } from 'react';
import New from './new';
import axios from 'axios';
import { Alert } from '@material-ui/lab';

class News extends Component {
    reqUrl = `http://newsapi.org/v2/everything?sortBy=publishedAt&apiKey=3b429cf3ff1a42d2973d0bf000babf2a&q=`;
    constructor(props) {
        super(props);
        this.state = {
            news: [],
            query: 'all',
            perPage: 20,
            error: null
        }
        this.getNews = this.getNews.bind(this);
    }
    getNews = function() {
        axios.get(this.reqUrl+this.state.query).then((response) => {
            this.setState({
                news: response.data.articles
            })
        });
    }

    componentDidMount() {
        this.getNews();
    }

    render() { 
        return (
            <div>
                <Alert variant="filled" severity="error" style={{ display: !this.state.error ? 'none' : 'block' }}>{this.state.error}</Alert>
                {this.state.news.map((value,index) => (
                    <New key={index} data={value} />
                ))}
            </div>
        );
    }
}
 
export default News;