import React from 'react';

const MovieListHeading = (props) => {
    return (
        <div className="col">
            <h1 className="mb-4 mx-3">{props.heading}</h1>
        </div>
    )
}

export default MovieListHeading;