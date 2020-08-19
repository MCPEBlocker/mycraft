import React, { Component } from 'react';
import { makeStyles, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography, Link } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        maxWidth: 345
    }
});
const defaultImage = `https://mycraft-uz-api.herokuapp.com/api/photo/b61ec340273f604f7a75768cd7a52e26.png`;

class New extends Component {
    classes = useStyles();
    
    render() { 
        return (
            <Card className={this.classes.root}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt={this.props.title}
                        height="200"
                        image={this.props.data.urlToImageimage || defaultImage}
                        title={this.props.data.title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">{this.props.data.title}</Typography>
                        <Typography variant="body2" color="textSecondary" component="p">{this.props.data.description}</Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Typography variant="subtitle1" component="p" color="textSeconary">Author: {this.props.data.author}</Typography>
                    <Button size="small" color="primary">
                        <Link href={this.props.data.url}>Learn more</Link>
                    </Button>
                </CardActions>
            </Card>
        );
    }
}
 
export default New;