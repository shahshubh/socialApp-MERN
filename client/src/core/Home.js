import React from 'react';

import Posts from '../post/Posts';

const Home = () => (
    <>
        <div className="container">
            <Posts />
        </div>
        <footer class="page-footer font-small" style={{ background: "#3E4551" }}>
            <div class="container">
                <p class="text-center" style={{ color: "#fff", fontSize: "large", margin: "0", padding: "20px" }}>
                    Made with <i class="fas fa-heart" style={{ color: "red", fontSize: "24px" }}></i> by
                        <a href="https://github.com/shahshubh" style={{ color: "white" }} > Shubh Shah </a>
                </p>
            </div>
        </footer>
    </>
);

export default Home;