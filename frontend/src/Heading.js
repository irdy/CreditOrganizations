import React from 'react';

const styles = {
    display: "inline-flex",
    marginBottom: 0
};

const Heading = ({ text, color='text-primary', blockClassName }) => {
    return (
        <div className={blockClassName}>
            <h3 style={styles} className={color}>{ text }</h3>
        </div>
    )
};

export default Heading;