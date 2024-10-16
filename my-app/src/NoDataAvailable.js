import React from "react";

const NoDataAvailable = () => {
  return (
    <div style={styles.div}>
      <img
        style={styles.image}
        src="https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png"
        alt="No data found"
      />
    </div>
  );
};

const styles = {
  div: {
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
  },
  image: {
    borderRadius: "2rem",
  },
};

export default NoDataAvailable;
